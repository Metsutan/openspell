require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
require('dotenv').config({ path: require('path').join(__dirname, '..', 'apps', 'shared-assets', 'base', 'shared.env') });

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BUCKET_NAME = process.env.R2_BUCKET_NAME || process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION || 'auto';
const ENDPOINT = process.env.R2_ENDPOINT;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;

if (!BUCKET_NAME || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
    console.error('Missing required R2/AWS credentials in environment (BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY).');
    process.exit(1);
}

const s3Client = new S3Client({
    region: REGION,
    endpoint: ENDPOINT,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY
    }
});

const ASSETS_CLIENT_PATH = path.join(__dirname, '..', 'apps', 'shared-assets', 'base', 'assetsClient.json');
const STATIC_DIR = path.join(__dirname, '..', 'apps', 'shared-assets', 'base', 'static');

async function uploadFile(filePath, objectKey, contentType) {
    const fileStream = fs.createReadStream(filePath);
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
        Body: fileStream,
        ContentType: contentType
    });
    console.log(`Uploading ${filePath} to s3://${BUCKET_NAME}/${objectKey}...`);
    await s3Client.send(command);
    console.log(`Successfully uploaded ${objectKey}`);
}

function computeMd5(filePath) {
    const fileBytes = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(fileBytes).digest('hex').substring(0, 8); // 8 char hash is plenty
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

async function main() {
    console.log('Starting assets upload script...');

    if (!fs.existsSync(ASSETS_CLIENT_PATH)) {
        console.error('assetsClient.json not found at', ASSETS_CLIENT_PATH);
        process.exit(1);
    }
    
    const assetsClientData = JSON.parse(fs.readFileSync(ASSETS_CLIENT_PATH, 'utf8'));
    const filesSection = { ...assetsClientData.data.files.defs, ...assetsClientData.data.files.gameAssets };
    let hasChanges = false;

    for (const [key, url] of Object.entries(filesSection)) {
        // e.g. https://.../static/worldentityactions.3.carbon
        const urlObj = new URL(url);
        const urlPath = urlObj.pathname; // /static/worldentityactions.3.carbon
        
        const filename = path.basename(urlPath);
        const dirname = path.dirname(urlPath).replace(/^\/static/, ''); // e.g. /carbon or empty
        
        let localUnversionedFilename = filename;
        if (filename.endsWith('.carbon')) {
            // Strip .X. from .N.carbon files to look for unversioned local source
            localUnversionedFilename = filename.replace(/\.[a-fA-F0-9]+\.carbon$/, '.carbon');
        } else if (filename.endsWith('.js')) {
            // we will upload the specific .js file referenced because user stated it does not change versions automatically
             localUnversionedFilename = filename; 
        } else if (filename.endsWith('.png')) {
             localUnversionedFilename = filename;
        }

        const localPath = path.join(STATIC_DIR, dirname, localUnversionedFilename);
        
        if (!fs.existsSync(localPath)) {
            console.warn(`File not found, skipping: ${localPath}`);
            continue;
        }

        const md5hash = computeMd5(localPath);
        let ext = path.extname(localUnversionedFilename);
        let base = path.basename(localUnversionedFilename, ext);
        
        let newHashedFilename;
        if (ext === '.carbon') {
            newHashedFilename = `${base}.${md5hash}${ext}`;
        } else {
            // Usually we might hash other assets. But for currently versioned things like client.61.js,
            // we'll just upload it as client.61.js since it's immutable
            newHashedFilename = filename;
        }

        const objectKey = path.join('static', dirname.replace(/^\/+/, ''), newHashedFilename).replace(/\\/g, '/');

        // Only upload if needed (for safety, you could check S3 first, but PutObject overwrites)
        try {
            await uploadFile(localPath, objectKey, getContentType(ext));
            
            // Update the URL in assetsClient.json so the client/server knows the new hash
            const oldUrl = urlObj.toString();
            // Preserve the base domain, update only the path
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
            console.error(`Failed to upload ${localPath}:`, e.message);
        }
    }

    if (hasChanges) {
        fs.writeFileSync(ASSETS_CLIENT_PATH, JSON.stringify(assetsClientData, null, 4));
        console.log('Updated assetsClient.json with new asset hash URLs.');
    } else {
        console.log('No URL changes needed for assetsClient.json');
    }
    
    // Upload client JS files explicitly
    const jsClientDir = path.join(__dirname, '..', 'apps', 'shared-assets', 'base', 'js', 'client');
    if (fs.existsSync(jsClientDir)) {
        const jsFiles = fs.readdirSync(jsClientDir).filter(f => f.endsWith('.js'));
        for (const file of jsFiles) {
            const localPath = path.join(jsClientDir, file);
            const objectKey = `js/client/${file}`;
            try {
                await uploadFile(localPath, objectKey, 'application/javascript');
            } catch (e) {
                console.error(`Failed to upload ${localPath}:`, e.message);
            }
        }
    }

    // Upload image assets explicitly (recursively to maintain structure)
    const imagesDir = path.join(STATIC_DIR, 'assets', 'images');
    async function uploadImagesRecursively(dir) {
        if (!fs.existsSync(dir)) return;
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await uploadImagesRecursively(fullPath);
            } else {
                const relativePath = path.relative(STATIC_DIR, fullPath).replace(/\\/g, '/');
                const objectKey = path.join('static', relativePath).replace(/\\/g, '/');
                try {
                    await uploadFile(fullPath, objectKey, getContentType(path.extname(entry.name)));
                } catch (e) {
                    console.error(`Failed to upload ${fullPath}:`, e.message);
                }
            }
        }
    }
    await uploadImagesRecursively(imagesDir);
    
    // Always upload assetsClient.json to the root of the bucket after changes are populated
    try {
        await uploadFile(ASSETS_CLIENT_PATH, 'assetsClient.json', 'application/json');
    } catch (e) {
        console.error(`Failed to upload assetsClient.json:`, e.message);
    }
}

main().catch(console.error);
