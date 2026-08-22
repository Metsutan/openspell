import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load root and shared env if available
dotenv.config();
dotenv.config({ path: path.join(__dirname, '..', 'shared-assets', 'base', 'shared.env') });

const PORT = parseInt(process.env.PORT || process.env.WEB_PORT || '8887', 10);

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  server: {
    port: PORT,
    host: true
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 100
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
});
