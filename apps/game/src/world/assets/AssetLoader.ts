import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const DEFAULT_BASE_STATIC_ASSETS_DIR = path.resolve(
  __dirname,
  "../../../../..",
  "apps",
  "shared-assets",
  "base",
  "static"
);

/**
 * Utility for loading and overlaying base and custom assets.
 * 
 * Allows separating custom content definitions from base content definitions.
 * Custom content is overlaid on top of base content without needing to duplicate
 * entire directories or files.
 */
export class AssetLoader {
  /**
   * Gets the base directory for static assets.
   */
  static getBaseStaticDir(): string {
    return process.env.BASE_STATIC_ASSETS_PATH 
      ? path.resolve(process.env.BASE_STATIC_ASSETS_PATH)
      : process.env.STATIC_ASSETS_PATH 
        ? path.resolve(process.env.STATIC_ASSETS_PATH)
        : DEFAULT_BASE_STATIC_ASSETS_DIR;
  }

  /**
   * Gets the custom directory for static assets, if it exists.
   */
  static getCustomStaticDir(): string | null {
    if (process.env.CUSTOM_STATIC_ASSETS_PATH) {
      return path.resolve(process.env.CUSTOM_STATIC_ASSETS_PATH);
    }
    
    // Automatically infer custom path if not explicitly provided but standard structure is used
    const baseDir = this.getBaseStaticDir();
    // Check if the path includes the standard base path structure
    const baseSuffix = path.join("shared-assets", "base", "static");
    const customSuffix = path.join("shared-assets", "custom", "static");
    
    if (baseDir.includes(baseSuffix)) {
      const customDir = baseDir.replace(baseSuffix, customSuffix);
      if (existsSync(customDir)) {
        return customDir;
      }
    } else if (baseDir.includes(path.join("base", "static"))) {
      // Fallback for slightly different path structures
      const customDir = baseDir.replace(
        path.join("base", "static"), 
        path.join("custom", "static")
      );
      if (existsSync(customDir)) {
        return customDir;
      }
    }
    
    return null;
  }

  /**
   * Resolves a file path, checking the custom directory first, then falling back to base.
   * Useful for single files that are fully overridden like heightmaps or textures.
   */
  static resolveFilePath(filename: string): string {
    const customDir = this.getCustomStaticDir();
    if (customDir) {
      const customPath = path.join(customDir, filename);
      if (existsSync(customPath)) {
        return customPath;
      }
    }
    
    return path.join(this.getBaseStaticDir(), filename);
  }

  /**
   * Loads raw string data from base and custom files if they exist.
   */
  static async loadRawFiles(filename: string): Promise<{ baseData: string | null; customData: string | null; resolvedPath: string }> {
    const baseDir = this.getBaseStaticDir();
    const customDir = this.getCustomStaticDir();
    
    const basePath = path.join(baseDir, filename);
    let baseData: string | null = null;
    let customData: string | null = null;
    let resolvedPath = basePath;
    
    if (existsSync(basePath)) {
      baseData = await fs.readFile(basePath, "utf8");
    }
    
    if (customDir) {
      const customPath = path.join(customDir, filename);
      if (existsSync(customPath)) {
        customData = await fs.readFile(customPath, "utf8");
        resolvedPath = customPath; // custom takes precedence for reporting
      }
    }
    
    return { baseData, customData, resolvedPath };
  }

  /**
   * Loads a JSON array file, overlaying custom entries on top of base entries.
   * 
   * @param filename Name of the file to load
   * @param keyProp Property to use as the unique key for merging (e.g., '_id'). 
   *                If not provided, arrays are simply concatenated.
   */
  static async loadOverlayArray<T>(filename: string, keyProp?: keyof T): Promise<T[]> {
    const { baseData, customData, resolvedPath } = await this.loadRawFiles(filename);
    
    let baseItems: T[] = [];
    if (baseData) {
      try {
        baseItems = JSON.parse(baseData) as T[];
      } catch (err) {
        console.error(`[AssetLoader] Failed to parse base file ${resolvedPath}:`, err);
        throw err;
      }
    }
    
    if (!customData) {
      return baseItems;
    }
    
    let customItems: T[] = [];
    try {
      customItems = JSON.parse(customData) as T[];
    } catch (err) {
      console.error(`[AssetLoader] Failed to parse custom file for ${filename}:`, err);
      throw err;
    }
    
    if (keyProp) {
      const mergedMap = new Map<any, T>();
      
      for (const item of baseItems) {
        mergedMap.set(item[keyProp], item);
      }
      
      for (const item of customItems) {
        mergedMap.set(item[keyProp], item);
      }
      
      return Array.from(mergedMap.values());
    } else {
      // Just concatenate if no key property is provided
      return [...baseItems, ...customItems];
    }
  }

  /**
   * Loads a JSON object file, allowing a custom merger function to combine base and custom.
   */
  static async loadOverlayObject<T extends object>(
    filename: string, 
    merger: (base: T, custom: T) => T
  ): Promise<T> {
    const { baseData, customData, resolvedPath } = await this.loadRawFiles(filename);
    
    let baseObj: T | null = null;
    if (baseData) {
      try {
        baseObj = JSON.parse(baseData) as T;
      } catch (err) {
        console.error(`[AssetLoader] Failed to parse base file ${resolvedPath}:`, err);
        throw err;
      }
    }
    
    if (!customData) {
      if (!baseObj) {
        throw new Error(`[AssetLoader] Could not load base or custom data for object ${filename}`);
      }
      return baseObj;
    }
    
    let customObj: T | null = null;
    try {
      customObj = JSON.parse(customData) as T;
    } catch (err) {
      console.error(`[AssetLoader] Failed to parse custom file for ${filename}:`, err);
      throw err;
    }
    
    if (!baseObj) {
      return customObj;
    }
    
    return merger(baseObj, customObj);
  }

  /**
   * Loads raw string data from base and custom files synchronously if they exist.
   */
  static loadRawFilesSync(filename: string): { baseData: string | null; customData: string | null; resolvedPath: string } {
    const fsSync = require("fs");
    const baseDir = this.getBaseStaticDir();
    const customDir = this.getCustomStaticDir();
    
    const basePath = path.join(baseDir, filename);
    let baseData: string | null = null;
    let customData: string | null = null;
    let resolvedPath = basePath;
    
    if (fsSync.existsSync(basePath)) {
      baseData = fsSync.readFileSync(basePath, "utf8");
    }
    
    if (customDir) {
      const customPath = path.join(customDir, filename);
      if (fsSync.existsSync(customPath)) {
        customData = fsSync.readFileSync(customPath, "utf8");
        resolvedPath = customPath;
      }
    }
    
    return { baseData, customData, resolvedPath };
  }

  /**
   * Loads a JSON array file synchronously, overlaying custom entries on top of base entries.
   */
  static loadOverlayArraySync<T>(filename: string, keyProp?: keyof T): T[] {
    const { baseData, customData, resolvedPath } = this.loadRawFilesSync(filename);
    
    let baseItems: T[] = [];
    if (baseData) {
      try {
        baseItems = JSON.parse(baseData) as T[];
      } catch (err) {
        console.error(`[AssetLoader] Failed to parse base file ${resolvedPath}:`, err);
        throw err;
      }
    }
    
    if (!customData) {
      return baseItems;
    }
    
    let customItems: T[] = [];
    try {
      customItems = JSON.parse(customData) as T[];
    } catch (err) {
      console.error(`[AssetLoader] Failed to parse custom file for ${filename}:`, err);
      throw err;
    }
    
    if (keyProp) {
      const mergedMap = new Map<any, T>();
      
      for (const item of baseItems) {
        mergedMap.set(item[keyProp], item);
      }
      
      for (const item of customItems) {
        mergedMap.set(item[keyProp], item);
      }
      
      return Array.from(mergedMap.values());
    } else {
      return [...baseItems, ...customItems];
    }
  }
}
