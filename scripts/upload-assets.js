require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const isDryRun = process.argv.includes('--dry-run');


const BUCKET_NAME = process.env.R2_BUCKET_NAME || process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION || 'auto';
const ENDPOINT = process.env.R2_ENDPOINT;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

if (isDryRun) {
    console.log('Running in DRY-RUN mode. No files will be uploaded to S3.');
} else if (!BUCKET_NAME || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    console.error('Missing required R2/AWS credentials in environment (BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY).');
    console.error('Tip: To test asset resolution and hash generation without credentials, use: node scripts/upload-assets.js --dry-run');
    process.exit(1);
}

const s3Client = (!isDryRun && BUCKET_NAME && ACCESS_KEY_ID && SECRET_ACCESS_KEY) ? new S3Client({
    region: REGION,
    endpoint: ENDPOINT,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    }
}) : null;

// Paths for base and custom assets
const BASE_SHARED_ASSETS_DIR = path.join(__dirname, '..', 'apps', 'shared-assets', 'base');
const CUSTOM_SHARED_ASSETS_DIR = path.join(__dirname, '..', 'apps', 'shared-assets', 'custom');

const BASE_STATIC_DIR = process.env.BASE_STATIC_ASSETS_PATH
    ? path.resolve(process.env.BASE_STATIC_ASSETS_PATH)
    : (process.env.STATIC_ASSETS_PATH
        ? path.resolve(process.env.STATIC_ASSETS_PATH)
        : path.join(BASE_SHARED_ASSETS_DIR, 'static'));

const CUSTOM_STATIC_DIR = process.env.CUSTOM_STATIC_ASSETS_PATH
    ? path.resolve(process.env.CUSTOM_STATIC_ASSETS_PATH)
    : path.join(CUSTOM_SHARED_ASSETS_DIR, 'static');

const hasCustomStatic = fs.existsSync(CUSTOM_STATIC_DIR);

const ASSETS_CLIENT_PATH = process.env.ASSETS_CLIENT_PATH
    ? path.resolve(process.env.ASSETS_CLIENT_PATH)
    : (fs.existsSync(path.join(CUSTOM_SHARED_ASSETS_DIR, 'assetsClient.json'))
        ? path.join(CUSTOM_SHARED_ASSETS_DIR, 'assetsClient.json')
        : path.join(BASE_SHARED_ASSETS_DIR, 'assetsClient.json'));

// Array definition files that should be merged by '_id' / 'id'
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
    'worldentityactions.carbon',
    'pickpocketdefs.carbon'
]);

// Object definition files that should be merged as objects
const OBJECT_DEFINITIONS = new Set([
    'npcloot.carbon',
    'specialcoordinatesdefs.carbon'
]);

async function uploadFile(bodyOrPath, objectKey, contentType) {
    if (isDryRun) {
        const sizeInfo = Buffer.isBuffer(bodyOrPath)
            ? `${bodyOrPath.length} bytes`
            : (typeof bodyOrPath === 'string' && fs.existsSync(bodyOrPath)
                ? `${fs.statSync(bodyOrPath).size} bytes`
                : 'stream/data');
        console.log(`[DRY-RUN] Would upload to s3://${BUCKET_NAME || 'bucket'}/${objectKey} (${contentType}, ${sizeInfo})`);
        return;
    }

    const body = (typeof bodyOrPath === 'string' && fs.existsSync(bodyOrPath))
        ? fs.createReadStream(bodyOrPath)
        : bodyOrPath;

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
        Body: body,
        ContentType: contentType
    });
    console.log(`Uploading ${typeof bodyOrPath === 'string' ? bodyOrPath : objectKey} to s3://${BUCKET_NAME}/${objectKey}...`);
    await s3Client.send(command);
    console.log(`Successfully uploaded ${objectKey}`);
}

function computeMd5(data) {
    const bytes = Buffer.isBuffer(data)
        ? data
        : (typeof data === 'string' && fs.existsSync(data)
            ? fs.readFileSync(data)
            : Buffer.from(data, 'utf8'));
    return crypto.createHash('md5').update(bytes).digest('hex').substring(0, 8); // 8 char hash
}

function getContentType(ext) {
    if (ext === '.carbon') return 'application/octet-stream';
    if (ext === '.png') return 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
    if (ext === '.gif') return 'image/gif';
    if (ext === '.webp') return 'image/webp';
    if (ext === '.svg') return 'image/svg+xml';
    if (ext === '.js') return 'application/javascript';
    if (ext === '.json') return 'application/json';
    return 'application/octet-stream';
}

/**
 * Resolves an asset's content, applying overlay and merging when custom assets exist.
 */
function resolveAsset(dirname, localUnversionedFilename) {
    const baseFilePath = path.join(BASE_STATIC_DIR, dirname, localUnversionedFilename);
    const customFilePath = hasCustomStatic ? path.join(CUSTOM_STATIC_DIR, dirname, localUnversionedFilename) : null;

    const baseExists = fs.existsSync(baseFilePath);
    const customExists = customFilePath && fs.existsSync(customFilePath);

    if (!baseExists && !customExists) {
        return null;
    }

    const filenameKey = localUnversionedFilename.toLowerCase();

    // Case 1: Custom file exists and base does NOT exist
    if (customExists && !baseExists) {
        console.log(`[AssetOverlay] Using custom-only asset: ${customFilePath}`);
        return {
            content: fs.readFileSync(customFilePath),
            sourcePath: customFilePath,
            isCustom: true
        };
    }

    // Case 2: Only base exists
    if (baseExists && !customExists) {
        return {
            content: fs.readFileSync(baseFilePath),
            sourcePath: baseFilePath,
            isCustom: false
        };
    }

    // Case 3: Both base and custom exist
    // 3A: Array definition (e.g. itemdefs.carbon) -> merge by _id / id
    if (ARRAY_DEFINITIONS.has(filenameKey)) {
        try {
            const baseJson = JSON.parse(fs.readFileSync(baseFilePath, 'utf8'));
            const customJson = JSON.parse(fs.readFileSync(customFilePath, 'utf8'));
            if (Array.isArray(baseJson) && Array.isArray(customJson)) {
                const mergedMap = new Map();
                for (const item of baseJson) {
                    const key = item && (item._id !== undefined ? item._id : item.id);
                    if (key !== undefined) mergedMap.set(key, item);
                    else mergedMap.set(item, item);
                }
                for (const item of customJson) {
                    const key = item && (item._id !== undefined ? item._id : item.id);
                    if (key !== undefined) mergedMap.set(key, item);
                    else mergedMap.set(item, item);
                }
                const merged = Array.from(mergedMap.values());
                console.log(`[AssetOverlay] Merged array ${localUnversionedFilename}: ${baseJson.length} base + ${customJson.length} custom = ${merged.length} total`);
                return {
                    content: Buffer.from(JSON.stringify(merged)),
                    sourcePath: `${baseFilePath} + ${customFilePath}`,
                    isCustom: true
                };
            }
        } catch (err) {
            console.error(`[AssetOverlay] Failed to merge array ${localUnversionedFilename}, falling back to custom:`, err.message);
            return {
                content: fs.readFileSync(customFilePath),
                sourcePath: customFilePath,
                isCustom: true
            };
        }
    }

    // 3B: Monster loot tables (npcloot.carbon) -> merge rootLootTables & npcLootTables by _id
    if (filenameKey === 'npcloot.carbon') {
        try {
            const baseJson = JSON.parse(fs.readFileSync(baseFilePath, 'utf8'));
            const customJson = JSON.parse(fs.readFileSync(customFilePath, 'utf8'));
            if (typeof baseJson === 'object' && typeof customJson === 'object') {
                const mergedRoot = new Map((baseJson.rootLootTables || []).map(t => [t._id, t]));
                for (const t of customJson.rootLootTables || []) {
                    mergedRoot.set(t._id, t);
                }

                const mergedNpc = new Map((baseJson.npcLootTables || []).map(t => [t._id, t]));
                for (const t of customJson.npcLootTables || []) {
                    mergedNpc.set(t._id, t);
                }

                const merged = {
                    rareLootTable: customJson.rareLootTable !== undefined ? customJson.rareLootTable : baseJson.rareLootTable,
                    rootLootTables: Array.from(mergedRoot.values()),
                    npcLootTables: Array.from(mergedNpc.values())
                };
                console.log(`[AssetOverlay] Merged npcloot.carbon loot tables (root: ${merged.rootLootTables.length}, npc: ${merged.npcLootTables.length})`);
                return {
                    content: Buffer.from(JSON.stringify(merged)),
                    sourcePath: `${baseFilePath} + ${customFilePath}`,
                    isCustom: true
                };
            }
        } catch (err) {
            console.error(`[AssetOverlay] Failed to merge npcloot.carbon, falling back to custom:`, err.message);
            return {
                content: fs.readFileSync(customFilePath),
                sourcePath: customFilePath,
                isCustom: true
            };
        }
    }

    // 3C: Other object definitions (e.g. specialcoordinatesdefs.carbon) -> merge keys
    if (OBJECT_DEFINITIONS.has(filenameKey)) {
        try {
            const baseJson = JSON.parse(fs.readFileSync(baseFilePath, 'utf8'));
            const customJson = JSON.parse(fs.readFileSync(customFilePath, 'utf8'));
            if (typeof baseJson === 'object' && typeof customJson === 'object') {
                const merged = { ...baseJson, ...customJson };
                console.log(`[AssetOverlay] Merged object definition ${localUnversionedFilename}`);
                return {
                    content: Buffer.from(JSON.stringify(merged)),
                    sourcePath: `${baseFilePath} + ${customFilePath}`,
                    isCustom: true
                };
            }
        } catch (err) {
            console.error(`[AssetOverlay] Failed to merge object ${localUnversionedFilename}, falling back to custom:`, err.message);
            return {
                content: fs.readFileSync(customFilePath),
                sourcePath: customFilePath,
                isCustom: true
            };
        }
    }

    // 3D: All other assets (binaries, heightmaps, sprite packages like items.carbon) -> custom replaces base entirely
    console.log(`[AssetOverlay] Replacing base asset with custom: ${customFilePath}`);
    return {
        content: fs.readFileSync(customFilePath),
        sourcePath: customFilePath,
        isCustom: true
    };
}

async function main() {
    console.log('Starting assets upload script...');
    console.log(`Base Static Dir: ${BASE_STATIC_DIR}`);
    console.log(`Custom Static Dir: ${hasCustomStatic ? CUSTOM_STATIC_DIR : '(none)'}`);
    console.log(`Assets Client Path: ${ASSETS_CLIENT_PATH}`);

    if (!fs.existsSync(ASSETS_CLIENT_PATH)) {
        console.error('assetsClient.json not found at', ASSETS_CLIENT_PATH);
        process.exit(1);
    }
    
    const assetsClientData = JSON.parse(fs.readFileSync(ASSETS_CLIENT_PATH, 'utf8'));
    const filesSection = { ...assetsClientData.data.files.defs, ...assetsClientData.data.files.gameAssets };
    let hasChanges = false;

    for (const [key, url] of Object.entries(filesSection)) {
        const urlObj = new URL(url);
        const urlPath = urlObj.pathname;
        
        const filename = path.basename(urlPath);
        const dirname = path.dirname(urlPath).replace(/^\/static/, '');
        
        let localUnversionedFilename = filename;
        if (filename.endsWith('.carbon')) {
            localUnversionedFilename = filename.replace(/\.[a-fA-F0-9]+\.carbon$/, '.carbon');
        } else if (filename.endsWith('.js') || filename.endsWith('.png')) {
            localUnversionedFilename = filename;
        }

        const asset = resolveAsset(dirname, localUnversionedFilename);
        if (!asset) {
            console.warn(`File not found, skipping: ${path.join(dirname, localUnversionedFilename)}`);
            continue;
        }

        const md5hash = computeMd5(asset.content);
        const ext = path.extname(localUnversionedFilename);
        const base = path.basename(localUnversionedFilename, ext);
        
        let newHashedFilename;
        if (ext === '.carbon') {
            newHashedFilename = `${base}.${md5hash}${ext}`;
        } else {
            newHashedFilename = filename;
        }

        const objectKey = path.join('static', dirname.replace(/^\/+/, ''), newHashedFilename).replace(/\\/g, '/');

        try {
            await uploadFile(asset.content, objectKey, getContentType(ext));
            
            const oldUrl = urlObj.toString();
            urlObj.pathname = `/${objectKey}`;
            urlObj.hostname = 'cdn.openspell.dev';
            urlObj.port = '';
            const newUrl = urlObj.toString();

            if (oldUrl !== newUrl) {
                if (assetsClientData.data.files.defs[key]) {
                    assetsClientData.data.files.defs[key] = newUrl;
                } else if (assetsClientData.data.files.gameAssets[key]) {
                    assetsClientData.data.files.gameAssets[key] = newUrl;
                }
                hasChanges = true;
            }
        } catch (e) {
            console.error(`Failed to upload ${asset.sourcePath}:`, e.message);
        }
    }

    if (hasChanges) {
        if (isDryRun) {
            console.log('[DRY-RUN] assetsClient.json would be updated with new asset hash URLs:');
            console.log(JSON.stringify(assetsClientData, null, 4));
        } else {
            fs.writeFileSync(ASSETS_CLIENT_PATH, JSON.stringify(assetsClientData, null, 4));
            console.log(`Updated ${ASSETS_CLIENT_PATH} with new asset hash URLs.`);
        }
    } else {
        console.log('No URL changes needed for assetsClient.json');
    }
    
    // Upload client JS files explicitly (custom overrides base if present)
    const baseJsClientDir = path.join(BASE_SHARED_ASSETS_DIR, 'js', 'client');
    const customJsClientDir = path.join(CUSTOM_SHARED_ASSETS_DIR, 'js', 'client');
    const jsFiles = new Set();
    if (fs.existsSync(baseJsClientDir)) {
        fs.readdirSync(baseJsClientDir).filter(f => f.endsWith('.js')).forEach(f => jsFiles.add(f));
    }
    if (fs.existsSync(customJsClientDir)) {
        fs.readdirSync(customJsClientDir).filter(f => f.endsWith('.js')).forEach(f => jsFiles.add(f));
    }

    for (const file of jsFiles) {
        const customPath = path.join(customJsClientDir, file);
        const basePath = path.join(baseJsClientDir, file);
        const usePath = fs.existsSync(customPath) ? customPath : basePath;
        if (usePath === customPath && fs.existsSync(basePath)) {
            console.log(`[AssetOverlay] Using custom client JS instead of base: ${file}`);
        }
        const objectKey = `js/client/${file}`;
        try {
            await uploadFile(usePath, objectKey, 'application/javascript');
        } catch (e) {
            console.error(`Failed to upload ${usePath}:`, e.message);
        }
    }

    // Upload static images & heightmaps (recursively to maintain structure, custom overrides base)
    const staticSubDirs = ['assets/images', 'assets/heightmaps', 'images'];
    const uploadedStaticKeys = new Set();

    for (const subDir of staticSubDirs) {
        const baseDir = path.join(BASE_STATIC_DIR, subDir);
        const customDir = path.join(CUSTOM_STATIC_DIR, subDir);

        function collectFiles(dir, relPrefix = '') {
            if (!fs.existsSync(dir)) return [];
            let results = [];
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                const fullPath = path.join(dir, entry.name);
                const relPath = path.join(relPrefix, entry.name).replace(/\\/g, '/');
                if (entry.isDirectory()) {
                    results = results.concat(collectFiles(fullPath, relPath));
                } else {
                    results.push(relPath);
                }
            }
            return results;
        }

        const baseRelFiles = collectFiles(baseDir);
        const customRelFiles = collectFiles(customDir);
        const allRelFiles = new Set([...baseRelFiles, ...customRelFiles]);

        for (const relFile of allRelFiles) {
            const customFilePath = path.join(customDir, relFile);
            const baseFilePath = path.join(baseDir, relFile);
            const customExists = fs.existsSync(customFilePath);
            const baseExists = fs.existsSync(baseFilePath);

            const filePathToUpload = customExists ? customFilePath : baseFilePath;
            if (customExists && baseExists) {
                console.log(`[AssetOverlay] Using custom ${subDir}/${relFile} instead of base`);
            }

            const staticRelativePath = path.join(subDir, relFile).replace(/\\/g, '/');
            const objectKey = path.join('static', staticRelativePath).replace(/\\/g, '/');
            if (!uploadedStaticKeys.has(objectKey)) {
                uploadedStaticKeys.add(objectKey);
                try {
                    await uploadFile(filePathToUpload, objectKey, getContentType(path.extname(relFile)));
                } catch (e) {
                    console.error(`Failed to upload ${filePathToUpload}:`, e.message);
                }
            }
        }
    }
    
    // Always upload assetsClient.json to the root of the bucket after changes are populated
    try {
        const manifestBuffer = Buffer.from(JSON.stringify(assetsClientData, null, 4));
        await uploadFile(manifestBuffer, 'assetsClient.json', 'application/json');
    } catch (e) {
        console.error('Failed to upload assetsClient.json:', e.message);
    }
}

main().catch(console.error);
