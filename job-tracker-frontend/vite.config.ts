import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl =
    env.VITE_API_BASE_URL ||
    env.VITE_API_URL ||
    env.VITE_BACKEND_URL ||
    env.API_BASE_URL ||
    env.API_URL ||
    env.BACKEND_URL ||
    process.env.VITE_API_BASE_URL ||
    process.env.VITE_API_URL ||
    process.env.VITE_BACKEND_URL ||
    process.env.API_BASE_URL ||
    process.env.API_URL ||
    process.env.BACKEND_URL ||
    '';

  return {
    plugins: [react()],
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      __API_URL__: JSON.stringify(apiUrl),
    },
  };
});