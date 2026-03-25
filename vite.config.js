import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import markdownBlog from './plugins/vite-plugin-markdown.js';

export default defineConfig({
  base: '/',
  plugins: [react(), markdownBlog()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
});
