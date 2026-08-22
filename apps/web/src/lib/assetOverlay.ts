import fs from 'fs';
import path from 'path';

// Array definition files that should be merged by '_id' / appended
export const ARRAY_DEFINITIONS = new Set([
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
export const OBJECT_DEFINITIONS = new Set([
  'npcloot.carbon',
  'specialcoordinatesdefs.carbon'
]);

const MIME_TYPES: Record<string, string> = {
  '.carbon': 'application/json; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
  '.wasm': 'application/wasm',
  '.js': 'application/javascript',
  '.css': 'text/css'
};

export function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Normalizes request paths by stripping leading slashes and handling hashed/versioned filenames.
 * e.g., "itemdefs.3a9b0596.carbon" -> "itemdefs.carbon"
 */
export function normalizeRelativePath(reqPath: string): { originalPath: string; strippedPath: string } {
  let cleanPath = reqPath.replace(/^\/+/, '');
  if (cleanPath.startsWith('static/')) {
    cleanPath = cleanPath.slice(7);
  }
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
export function resolveFilePath(directory: string | null, originalPath: string, strippedPath: string): string | null {
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

export function getBaseStaticDir(): string {
  if (process.env.BASE_STATIC_ASSETS_PATH) return path.resolve(process.env.BASE_STATIC_ASSETS_PATH);
  if (process.env.STATIC_ASSETS_PATH) return path.resolve(process.env.STATIC_ASSETS_PATH);

  // Try standard locations
  const candidates = [
    path.resolve(process.cwd(), 'apps', 'shared-assets', 'base', 'static'),
    path.resolve(process.cwd(), '..', 'shared-assets', 'base', 'static'),
    path.resolve(process.cwd(), 'shared-assets', 'base', 'static')
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return candidates[0];
}

export function getCustomStaticDir(): string | null {
  if (process.env.CUSTOM_STATIC_ASSETS_PATH) return path.resolve(process.env.CUSTOM_STATIC_ASSETS_PATH);

  const candidates = [
    path.resolve(process.cwd(), 'apps', 'shared-assets', 'custom', 'static'),
    path.resolve(process.cwd(), '..', 'shared-assets', 'custom', 'static'),
    path.resolve(process.cwd(), 'shared-assets', 'custom', 'static')
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

const cache = new Map<string, { lastModified: number; data: string }>();

export function getAsset(reqPath: string): { status: number; contentType: string; body: Buffer | string } | null {
  const baseDir = getBaseStaticDir();
  const customDir = getCustomStaticDir();

  const { originalPath, strippedPath } = normalizeRelativePath(reqPath);
  const filename = path.basename(strippedPath).toLowerCase();

  const basePath = resolveFilePath(baseDir, originalPath, strippedPath);
  const customPath = resolveFilePath(customDir, originalPath, strippedPath);

  if (!basePath && !customPath) {
    return null;
  }

  // Case 1: Custom file exists and base does NOT exist
  if (customPath && !basePath) {
    const data = fs.readFileSync(customPath);
    return {
      status: 200,
      contentType: getMimeType(customPath),
      body: data
    };
  }

  // Case 2: Only base exists
  if (basePath && !customPath) {
    const data = fs.readFileSync(basePath);
    return {
      status: 200,
      contentType: getMimeType(basePath),
      body: data
    };
  }

  // Case 3: Both base and custom exist
  const isArrayDef = ARRAY_DEFINITIONS.has(filename);
  const isObjectDef = OBJECT_DEFINITIONS.has(filename);

  if (!isArrayDef && !isObjectDef) {
    // Custom replaces base
    const data = fs.readFileSync(customPath!);
    return {
      status: 200,
      contentType: getMimeType(customPath!),
      body: data
    };
  }

  try {
    const baseStat = fs.statSync(basePath!);
    const customStat = fs.statSync(customPath!);
    const cacheKey = strippedPath;
    const lastModified = Math.max(baseStat.mtimeMs, customStat.mtimeMs);

    const cached = cache.get(cacheKey);
    if (cached && cached.lastModified === lastModified) {
      return {
        status: 200,
        contentType: 'application/json; charset=utf-8',
        body: cached.data
      };
    }

    const stripBom = (text: string) => text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
    const baseContent = fs.readFileSync(basePath!, 'utf8');
    const customContent = fs.readFileSync(customPath!, 'utf8');

    const baseJson = JSON.parse(stripBom(baseContent));
    const customJson = JSON.parse(stripBom(customContent));

    let mergedJson: any;

    if (isArrayDef && Array.isArray(baseJson) && Array.isArray(customJson)) {
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
      mergedJson = Array.from(mergedMap.values());
    } else if (isObjectDef && typeof baseJson === 'object' && typeof customJson === 'object') {
      mergedJson = { ...baseJson, ...customJson };
    } else {
      mergedJson = customJson;
    }

    const responseData = JSON.stringify(mergedJson);
    cache.set(cacheKey, { lastModified, data: responseData });

    return {
      status: 200,
      contentType: 'application/json; charset=utf-8',
      body: responseData
    };
  } catch (err) {
    if (customPath) {
      return {
        status: 200,
        contentType: getMimeType(customPath),
        body: fs.readFileSync(customPath)
      };
    }
    return {
      status: 200,
      contentType: getMimeType(basePath!),
      body: fs.readFileSync(basePath!)
    };
  }
}
