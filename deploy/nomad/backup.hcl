job "openspell-backup" {
  datacenters = ["dc1"]
  type        = "batch"

  periodic {
    # Run daily at 03:00 UTC
    crons            = ["0 3 * * *"]
    prohibit_overlap = true
  }

  group "backup" {
    network {
      mode = "bridge"
    }

    service {
      name     = "openspell-backup"
      provider = "consul"

      connect {
        sidecar_service {
          proxy {
            upstreams {
              destination_name = "openspell-postgres"
              local_bind_port  = 5432
            }
          }
        }
      }
    }

    task "run-backup" {
      driver = "podman"

      identity {
        env  = true
        file = true
      }

      config {
        image = "node:20-alpine"
        command = "/bin/sh"
        args = ["-c", "apk add --no-cache postgresql-client && cd /local && npm install @aws-sdk/client-s3 @aws-sdk/lib-storage dotenv && node backup-to-r2.js"]
      }

      template {
        data = <<EOH
{{- with nomadVar "nomad/jobs/openspell-backup" -}}
R2_BUCKET_NAME="{{ .R2_BUCKET_NAME }}"
R2_ENDPOINT="{{ .R2_ENDPOINT }}"
R2_ACCESS_KEY_ID="{{ .R2_ACCESS_KEY_ID }}"
R2_SECRET_ACCESS_KEY="{{ .R2_SECRET_ACCESS_KEY }}"
BACKUP_RETENTION_DAYS="{{ .BACKUP_RETENTION_DAYS }}"
POSTGRES_USER="{{ .POSTGRES_USER }}"
POSTGRES_PASSWORD="{{ .POSTGRES_PASSWORD }}"
POSTGRES_DB="{{ .POSTGRES_DB }}"
DATABASE_URL="postgresql://{{ .POSTGRES_USER }}:{{ .POSTGRES_PASSWORD }}@127.0.0.1:5432/{{ .POSTGRES_DB }}"
{{- end -}}
EOH
        destination = "local/env"
        env         = true
      }

      template {
        data = <<EOF
const { S3Client, DeleteObjectsCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { spawn } = require('child_process');
const zlib = require('zlib');
const path = require('path');
const fs = require('fs');

if (fs.existsSync(path.join(__dirname, 'env'))) {
    require('dotenv').config({ path: path.join(__dirname, 'env') });
} else if (fs.existsSync(path.join(__dirname, '.env'))) {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
}

const BUCKET_NAME = process.env.R2_BUCKET_NAME || process.env.AWS_BUCKET_NAME;
const REGION = process.env.AWS_REGION || 'auto';
const ENDPOINT = process.env.R2_ENDPOINT;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
let POSTGRES_URL = process.env.DATABASE_URL;
if (!POSTGRES_URL && process.env.POSTGRES_USER && process.env.POSTGRES_PASSWORD && process.env.POSTGRES_DB) {
    POSTGRES_URL = `postgresql://$${process.env.POSTGRES_USER}:$${process.env.POSTGRES_PASSWORD}@127.0.0.1:5432/$${process.env.POSTGRES_DB}`;
}
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '7', 10);

console.log('Environment check:', {
    hasBucket: !!BUCKET_NAME,
    hasAccessKey: !!ACCESS_KEY_ID,
    hasSecretKey: !!SECRET_ACCESS_KEY,
    hasPostgresUrl: !!POSTGRES_URL,
    endpoint: ENDPOINT
});

if (!BUCKET_NAME || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !POSTGRES_URL) {
    console.error('Missing required credentials in environment. Check Nomad variables for openspell-backup.');
    process.exit(1);
}

const s3Client = new S3Client({
    region: REGION,
    endpoint: ENDPOINT,
    credentials: { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY }
});

async function main() {
    console.log('Starting automated PostgreSQL backup to R2...');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const objectKey = `backups/postgres/openspell-backup-$${timestamp}.sql.gz`;

    const gzip = zlib.createGzip();
    const pgDump = spawn('pg_dump', ['-d', POSTGRES_URL, '-F', 'p', '--clean', '--no-owner']);

    pgDump.stderr.on('data', (data) => console.error(`pg_dump stderr: $${data}`));
    const pgDumpStream = pgDump.stdout.pipe(gzip);

    try {
        const upload = new Upload({
            client: s3Client,
            params: { Bucket: BUCKET_NAME, Key: objectKey, Body: pgDumpStream, ContentType: 'application/gzip' }
        });
        upload.on('httpUploadProgress', (progress) => {
            console.log(`Upload progress: $${Math.round((progress.loaded / (progress.total || 1)) * 100)}%`);
        });
        await upload.done();
        console.log(`Successfully uploaded backup to s3://$${BUCKET_NAME}/$${objectKey}`);
    } catch (e) {
        console.error('Backup upload failed:', e);
        process.exit(1);
    }
    
    if (RETENTION_DAYS > 0) {
        console.log(`Checking for backups older than $${RETENTION_DAYS} days...`);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
        try {
            const data = await s3Client.send(new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: 'backups/postgres/' }));
            if (data.Contents) {
                const objectsToDelete = data.Contents.filter(o => o.LastModified < cutoffDate).map(o => ({ Key: o.Key }));
                if (objectsToDelete.length > 0) {
                    await s3Client.send(new DeleteObjectsCommand({ Bucket: BUCKET_NAME, Delete: { Objects: objectsToDelete, Quiet: false } }));
                    console.log(`Successfully deleted $${objectsToDelete.length} old backups.`);
                }
            }
        } catch (e) {
            console.error('Failed to cleanup old backups:', e);
        }
    }
    console.log('Backup process completed successfully.');
}
main().catch(console.error);
EOF
        destination = "local/backup-to-r2.js"
      }
    }
  }
}
