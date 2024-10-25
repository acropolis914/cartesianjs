import { defineConfig } from 'vite';
import FullReload from 'vite-plugin-full-reload';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  base: './', // Add this line to use relative paths
  root: '.',
  publicDir: 'public',
  plugins: [
    legacy({
      targets: ['ie >= 11', 'ios >= 9'],
      additionalLegacyPolyfills: [
        'regenerator-runtime/runtime',
        'core-js/features/promise',
        'core-js/features/object/assign',
        'core-js/features/string/includes',
        'core-js/features/array/includes'
      ],
      polyfills: true,
      modernPolyfills: true,
      renderLegacyChunks: true,
    }),
    FullReload(['**/*.js'])
  ],
  build: {
    target: ['es2015', 'ios9'],
    sourcemap: true,
    // minify: 'terser',
    terserOptions: {
      safari10: true,
      keep_classnames: true,
      keep_fnames: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    outDir: './docs',
  },
  server: {
    port: 3141,
    open: true,
    hmr: false
  }
});