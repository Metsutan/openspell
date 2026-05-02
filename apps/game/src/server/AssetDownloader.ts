import { promises as fs, existsSync, mkdirSync } from "fs";
import path from "path";

const DEFAULT_STATIC_ASSETS_DIR = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "shared-assets",
    "base",
    "static"
);

const STATIC_ASSETS_DIR = process.env.STATIC_ASSETS_PATH
    ? path.resolve(process.env.STATIC_ASSETS_PATH)
    : DEFAULT_STATIC_ASSETS_DIR;

export class AssetDownloader {
    static async downloadAssets(): Promise<void> {
        const cdnUrl = process.env.CDN_URL || 'https://cdn.openspell.dev';
        const manifestUrl = `${cdnUrl}/assetsClient.json`;

        console.log(`[AssetDownloader] Fetching asset manifest from ${manifestUrl}...`);
        try {
            const response = await fetch(manifestUrl);
            if (!response.ok) {
                console.error(`[AssetDownloader] Server responded with HTTP ${response.status}`);
                return;
            }
            const data = await response.json() as any;

            if (!data?.data?.files) {
                console.warn(`[AssetDownloader] Manifest missing 'files' payload.`);
                return;
            }

            const files = {
                ...(data.data.files.defs || {}),
                ...(data.data.files.gameAssets || {})
            };

            for (const url of Object.values(files)) {
                if (typeof url !== 'string') continue;

                const urlObj = new URL(url);
                // Extract everything after /static/
                const match = urlObj.pathname.match(/^\/static\/(.*)$/);
                if (!match) continue;

                const relativePath = match[1];
                const filename = path.basename(relativePath);

                let localFilename = filename;
                if (filename.endsWith('.carbon')) {
                    // Strip the hash pattern: name.123ab.carbon -> name.carbon
                    localFilename = filename.replace(/\.[a-fA-F0-9]+\.carbon$/, '.carbon');
                }

                const localDir = path.join(STATIC_ASSETS_DIR, path.dirname(relativePath));
                const localPath = path.join(localDir, localFilename);

                if (!existsSync(localDir)) {
                    mkdirSync(localDir, { recursive: true });
                }

                console.log(`[AssetDownloader] Downloading ${url} -> ${localPath}`);
                const fileRes = await fetch(url);
                if (!fileRes.ok) {
                    throw new Error(`Failed to download ${url}: ${fileRes.status}`);
                }

                const arrayBuffer = await fileRes.arrayBuffer();
                await fs.writeFile(localPath, Buffer.from(arrayBuffer));
            }
            
            console.log(`[AssetDownloader] Successfully downloaded all game assets.`);
        } catch (err) {
            console.error(`[AssetDownloader] Failed to sync assets:`, err);
            throw err; // Blocking failure if we fail to fetch core assets
        }
    }
}
