const { S3Client, GetObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { spawn } = require('child_process');
const zlib = require('zlib');
const path = require('path');
const readline = require('readline');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', 'apps', 'shared-assets', 'base', 'shared.env') });

const BUCKET_NAME = process.env.R2_BUCKET_NAME || process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION || 'auto';
const ENDPOINT = process.env.R2_ENDPOINT;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
const POSTGRES_URL = process.env.DATABASE_URL;

if (!BUCKET_NAME || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !POSTGRES_URL) {
    console.error('Missing required credentials in environment (BUCKET_NAME, ACCESS_KEY_ID, SECRET_ACCESS_KEY, DATABASE_URL).');
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

async function promptUser(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => rl.question(query, (ans) => {
        rl.close();
        resolve(ans);
    }));
}

async function listBackups() {
    console.log('Fetching list of available backups...');
    const listCommand = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: 'backups/postgres/'
    });

    const data = await s3Client.send(listCommand);
    if (!data.Contents || data.Contents.length === 0) {
        console.log('No backups found.');
        return [];
    }

    // Sort descending by date
    const sorted = data.Contents.sort((a, b) => b.LastModified - a.LastModified);
    return sorted;
}

async function main() {
    const args = process.argv.slice(2);
    let targetKey = args[0];

    if (!targetKey) {
        const backups = await listBackups();
        if (backups.length === 0) return;

        console.log('\nAvailable Backups:');
        backups.forEach((b, i) => {
            console.log(`${i + 1}) ${b.Key} (Size: ${(b.Size / 1024 / 1024).toFixed(2)} MB, Date: ${b.LastModified.toISOString()})`);
        });

        const answer = await promptUser('\nEnter the number of the backup to restore (or "latest" to restore the newest, empty to cancel): ');
        if (!answer.trim()) {
            console.log('Cancelled.');
            return;
        }

        if (answer.trim().toLowerCase() === 'latest') {
            targetKey = backups[0].Key;
        } else {
            const index = parseInt(answer, 10) - 1;
            if (isNaN(index) || index < 0 || index >= backups.length) {
                console.error('Invalid selection.');
                process.exit(1);
            }
            targetKey = backups[index].Key;
        }
    }

    console.log(`\nWARNING: You are about to restore database from ${targetKey}.`);
    console.log('This will OVERWRITE your current database tables and data!');
    const confirm = await promptUser('Are you sure you want to proceed? (Type "YES" to confirm): ');
    if (confirm !== 'YES') {
        console.log('Restoration cancelled.');
        return;
    }

    console.log(`\nDownloading and restoring from ${targetKey}...`);
    
    // Create un-gzip stream
    const gunzip = zlib.createGunzip();

    // Spawn psql
    let psqlCmd = 'psql';
    let psqlArgs = [POSTGRES_URL];

    // In a local development environment, use docker exec
    if (process.env.USE_DOCKER_EXEC === 'true') {
        psqlCmd = 'docker';
        psqlArgs = ['exec', '-i', 'openspell-postgres', 'psql', '-U', 'openspell', 'openspell'];
    }

    console.log(`Spawning ${psqlCmd} ${psqlArgs.join(' ')}`);
    const psql = spawn(psqlCmd, psqlArgs);

    psql.stderr.on('data', (data) => {
        console.error(`psql stderr: ${data}`);
    });
    
    psql.on('close', (code) => {
        if (code === 0) {
            console.log('Database restore completed successfully.');
        } else {
            console.error(`Database restore process exited with code ${code}`);
        }
    });

    gunzip.pipe(psql.stdin);

    const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: targetKey
    });

    try {
        const { Body } = await s3Client.send(getCommand);
        // Pipe S3 stream through gunzip to psql
        Body.pipe(gunzip);
    } catch (e) {
        console.error('Failed to download from S3:', e);
        process.exit(1);
    }
}

main().catch(console.error);
