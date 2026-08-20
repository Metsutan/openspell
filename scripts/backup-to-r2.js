const { S3Client, DeleteObjectsCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { spawn } = require('child_process');
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', 'apps', 'shared-assets', 'base', 'shared.env') });

const BUCKET_NAME = process.env.R2_BUCKET_NAME || process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION || 'auto';
const ENDPOINT = process.env.R2_ENDPOINT;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
const POSTGRES_URL = process.env.DATABASE_URL;

const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '7', 10);

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

async function main() {
    console.log('Starting automated PostgreSQL backup to R2...');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const objectKey = `backups/postgres/openspell-backup-${timestamp}.sql.gz`;

    console.log(`Target object key: ${objectKey}`);

    // Create a gzip stream
    const gzip = zlib.createGzip();

    // Spawn pg_dump
    // If not running in a container, you might need to adjust the path or use docker exec
    // We assume pg_dump is available in the environment (e.g. alpine + postgresql-client)
    let pgDumpCmd = 'pg_dump';
    let pgDumpArgs = ['-d', POSTGRES_URL, '-F', 'p', '--clean', '--no-owner'];

    // In a local development environment, we might need to use docker exec
    // but in Nomad, the container will just reach the database via DATABASE_URL
    if (process.env.USE_DOCKER_EXEC === 'true') {
        pgDumpCmd = 'docker';
        pgDumpArgs = ['exec', '-i', 'openspell-postgres', 'pg_dump', '-U', 'openspell', 'openspell', '-F', 'p', '--clean', '--no-owner'];
    }

    console.log(`Spawning ${pgDumpCmd} ${pgDumpArgs.join(' ')}`);
    const pgDump = spawn(pgDumpCmd, pgDumpArgs);

    pgDump.stderr.on('data', (data) => {
        console.error(`pg_dump stderr: ${data}`);
    });

    // Pipe pg_dump stdout to gzip
    const pgDumpStream = pgDump.stdout.pipe(gzip);

    // Stream upload to S3/R2
    try {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: BUCKET_NAME,
                Key: objectKey,
                Body: pgDumpStream,
                ContentType: 'application/gzip'
            },
            tags: [], // optional tags
            queueSize: 4, // optional concurrency configuration
            partSize: 5 * 1024 * 1024 // optional size of each part
        });

        upload.on('httpUploadProgress', (progress) => {
            console.log(`Upload progress: ${Math.round((progress.loaded / (progress.total || 1)) * 100)}% (${progress.loaded} bytes)`);
        });

        await upload.done();
        console.log(`Successfully uploaded backup to s3://${BUCKET_NAME}/${objectKey}`);
    } catch (e) {
        console.error('Backup upload failed:', e);
        process.exit(1);
    }

    // Cleanup old backups
    await cleanupOldBackups();
    console.log('Backup process completed successfully.');
}

async function cleanupOldBackups() {
    if (RETENTION_DAYS <= 0) {
        console.log('Retention days is 0 or negative. Skipping cleanup.');
        return;
    }

    console.log(`Checking for backups older than ${RETENTION_DAYS} days...`);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

    try {
        const listCommand = new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: 'backups/postgres/'
        });

        const data = await s3Client.send(listCommand);
        if (!data.Contents || data.Contents.length === 0) {
            console.log('No backups found to cleanup.');
            return;
        }

        const objectsToDelete = [];
        for (const object of data.Contents) {
            if (object.LastModified < cutoffDate) {
                objectsToDelete.push({ Key: object.Key });
            }
        }

        if (objectsToDelete.length > 0) {
            console.log(`Found ${objectsToDelete.length} old backups to delete.`);
            const deleteCommand = new DeleteObjectsCommand({
                Bucket: BUCKET_NAME,
                Delete: {
                    Objects: objectsToDelete,
                    Quiet: false
                }
            });
            const delData = await s3Client.send(deleteCommand);
            console.log(`Successfully deleted ${delData.Deleted.length} old backups.`);
        } else {
            console.log('No backups are older than the retention period.');
        }

    } catch (e) {
        console.error('Failed to cleanup old backups:', e);
    }
}

main().catch(console.error);
