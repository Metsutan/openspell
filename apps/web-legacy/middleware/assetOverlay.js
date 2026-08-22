const fs = require('fs');
const path = require('path');

// Array definition files that should be merged by '_id' / appended
const ARRAY_DEFINITIONS = new Set([
    'itemdefs.carbon',
    'conversationdefs.carbon',
    'npcconversationdefs.carbon',
    'worldentitydefs.carbon',
    'worldentities.carbon',
    'npcentitydefs.carbon',
    'npcentities.carbon',
    'instancednpcentities.carbon',
    'shopdefs.carbon',
    'grounditems.carbon',
    'spelldefs.carbon',
    'questdefs.carbon',
    'worldentitylootdefs.carbon',
    'worldentityactions.carbon'
]);

// Object definition files that should be merged as objects
const OBJECT_DEFINITIONS = new Set([
    'npcloot.carbon',
    'specialcoordinatesdefs.carbon'
]);

/**
 * Normalizes request paths by stripping leading slashes and handling hashed/versioned filenames.
 * e.g., "/itemdefs.3a9b0596.carbon" -> "itemdefs.carbon"
 */
function normalizeRelativePath(reqPath) {
    const cleanPath = reqPath.replace(/^\/+/, '');
    const dir = path.dirname(cleanPath);
    const base = path.basename(cleanPath);

    // Match patterns like name.123ab.ext or name.49.ext
    const match = base.match(/^(.*?)\.[a-fA-F0-9]+\.([^.]+)$/);
    const strippedBase = match ? `${match[1]}.${match[2]}` : base;

    const strippedPath = dir && dir !== '.' ? path.join(dir, strippedBase).replace(/\\/g, '/') : strippedBase;
    return {
        originalPath: cleanPath.replace(/\\/g, '/'),
        strippedPath
    };
}

/**
 * Resolves the absolute path of a file in a given directory, checking original then stripped path.
 */
function resolveFilePath(directory, originalPath, strippedPath) {
    if (!directory || !fs.existsSync(directory)) {
        return null;
    }

    const directPath = path.join(directory, originalPath);
    if (fs.existsSync(directPath)) {
        return directPath;
    }

    if (strippedPath && strippedPath !== originalPath) {
        const fallbackPath = path.join(directory, strippedPath);
        if (fs.existsSync(fallbackPath)) {
            return fallbackPath;
        }
    }

    return null;
}

/**
 * Creates the asset overlay middleware.
 */
function createAssetOverlayMiddleware(options = {}) {
    const defaultBaseDir = path.resolve(__dirname, '..', '..', 'shared-assets', 'base', 'static');
    const baseDir = options.baseStaticDir
        ? path.resolve(options.baseStaticDir)
        : (process.env.BASE_STATIC_ASSETS_PATH
            ? path.resolve(process.env.BASE_STATIC_ASSETS_PATH)
            : (process.env.STATIC_ASSETS_PATH
                ? path.resolve(process.env.STATIC_ASSETS_PATH)
                : defaultBaseDir));

    let customDir = options.customStaticDir
        ? path.resolve(options.customStaticDir)
        : (process.env.CUSTOM_STATIC_ASSETS_PATH
            ? path.resolve(process.env.CUSTOM_STATIC_ASSETS_PATH)
            : null);

    if (!customDir) {
        const defaultCustomDir = path.resolve(__dirname, '..', '..', 'shared-assets', 'custom', 'static');
        if (fs.existsSync(defaultCustomDir)) {
            customDir = defaultCustomDir;
        } else if (baseDir.includes(path.join('shared-assets', 'base', 'static'))) {
            const inferred = baseDir.replace(
                path.join('shared-assets', 'base', 'static'),
                path.join('shared-assets', 'custom', 'static')
            );
            if (fs.existsSync(inferred)) {
                customDir = inferred;
            }
        } else if (baseDir.includes(path.join('base', 'static'))) {
            const inferred = baseDir.replace(
                path.join('base', 'static'),
                path.join('custom', 'static')
            );
            if (fs.existsSync(inferred)) {
                customDir = inferred;
            }
        }
    }

    if (process.env.NODE_ENV !== 'production') {
        console.log(`[AssetOverlay] Base Static Dir: ${baseDir}`);
        console.log(`[AssetOverlay] Custom Static Dir: ${customDir || '(none)'}`);
    }

    // In-memory cache for merged definition files
    const cache = new Map();

    return function assetOverlayMiddleware(req, res, next) {
        // Set standard CORS headers for CDN and asset fetching
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Expose-Headers', '*');

        if (req.method === 'OPTIONS') {
            return res.status(204).end();
        }

        // Only handle GET and HEAD requests
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return next();
        }

        const { originalPath, strippedPath } = normalizeRelativePath(req.path);
        const filename = path.basename(strippedPath).toLowerCase();

        const basePath = resolveFilePath(baseDir, originalPath, strippedPath);
        const customPath = resolveFilePath(customDir, originalPath, strippedPath);

        // If neither exists, pass through to 404 or next static handler
        if (!basePath && !customPath) {
            return next();
        }

        const sendFileWithHeaders = (filePath) => {
            if (filePath.endsWith('.carbon')) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
            }
            return res.sendFile(filePath);
        };

        // Case 1: Custom file exists and base does NOT exist -> serve custom directly
        if (customPath && !basePath) {
            console.log(`[AssetOverlay] Serving custom-only file: ${req.path} -> ${customPath}`);
            return sendFileWithHeaders(customPath);
        }

        // Case 2: Only base exists -> serve base directly
        if (basePath && !customPath) {
            return sendFileWithHeaders(basePath);
        }

        // Case 3: Both base and custom files exist -> determine whether to merge or replace
        const isArrayDef = ARRAY_DEFINITIONS.has(filename);
        const isObjectDef = OBJECT_DEFINITIONS.has(filename);

        // If it's not an array or object definition, custom replaces base entirely (e.g. items.carbon, appearance.carbon, textures, etc.)
        if (!isArrayDef && !isObjectDef) {
            console.log(`[AssetOverlay] Replacing base asset with custom: ${req.path} -> ${customPath}`);
            return sendFileWithHeaders(customPath);
        }

        // Merge array or object definitions
        try {
            const baseStat = fs.statSync(basePath);
            const customStat = fs.statSync(customPath);
            const cacheKey = strippedPath;
            const lastModified = Math.max(baseStat.mtimeMs, customStat.mtimeMs);

            const cached = cache.get(cacheKey);
            if (cached && cached.lastModified === lastModified) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.send(cached.data);
            }

            const baseContent = fs.readFileSync(basePath, 'utf8');
            const customContent = fs.readFileSync(customPath, 'utf8');

            const baseJson = JSON.parse(baseContent);
            const customJson = JSON.parse(customContent);

            let mergedJson;

            if (isArrayDef && Array.isArray(baseJson) && Array.isArray(customJson)) {
                // Merge array by _id or id, otherwise append
                const mergedMap = new Map();
                for (const item of baseJson) {
                    const key = (item && (item._id !== undefined ? item._id : item.id));
                    if (key !== undefined) {
                        mergedMap.set(key, item);
                    } else {
                        mergedMap.set(item, item);
                    }
                }
                for (const item of customJson) {
                    const key = (item && (item._id !== undefined ? item._id : item.id));
                    if (key !== undefined) {
                        mergedMap.set(key, item);
                    } else {
                        mergedMap.set(item, item);
                    }
                }
                mergedJson = Array.from(mergedMap.values());
                console.log(`[AssetOverlay] Merged array definition ${filename}: ${baseJson.length} base + ${customJson.length} custom = ${mergedJson.length} total`);
            } else if (isObjectDef && typeof baseJson === 'object' && typeof customJson === 'object') {
                // Merge object keys
                mergedJson = { ...baseJson, ...customJson };
                console.log(`[AssetOverlay] Merged object definition ${filename}`);
            } else {
                // Fallback: custom replaces base
                mergedJson = customJson;
            }

            const responseData = JSON.stringify(mergedJson);
            cache.set(cacheKey, {
                lastModified,
                data: responseData
            });

            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.send(responseData);
        } catch (err) {
            console.error(`[AssetOverlay] Error merging overlay for ${req.path}:`, err);
            // Fallback to custom if available, else base
            if (customPath) {
                return sendFileWithHeaders(customPath);
            }
            return sendFileWithHeaders(basePath);
        }
    };
}

module.exports = {
    createAssetOverlayMiddleware,
    ARRAY_DEFINITIONS,
    OBJECT_DEFINITIONS,
    normalizeRelativePath,
    resolveFilePath
};
