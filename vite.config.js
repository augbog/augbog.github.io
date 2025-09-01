import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  root: '.',
  base: command === 'build' ? '/build/' : '/',
  server: {
    host: 'localhost',
    port: 8000,
    open: false,
  },
  preview: {
    host: 'localhost',
    port: 8000,
    open: false,
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    minify: 'esbuild',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].min.js',
        chunkFileNames: 'js/[name]-[hash].min.js',
        assetFileNames: (assetInfo) => {
          // Force a single deterministic CSS file name for Tailwind output
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/index[extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
  },
}));
