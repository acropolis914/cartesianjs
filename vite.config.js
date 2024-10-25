import { defineConfig } from 'vite';
import FullReload from 'vite-plugin-full-reload';
import legacy from '@vitejs/plugin-legacy';
import postcssPresetEnv from 'postcss-preset-env'; // Added
import autoprefixer from 'autoprefixer'; // Added

export default defineConfig({
  base: './',
  root: '.',
  publicDir: 'public',
  // Added CSS configuration
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({
          stage: 3,
          browsers: ['iOS >= 9'],
          features: {
            'nesting-rules': true,
            'custom-properties': true,
            'custom-media-queries': true,
            'gap-properties': true,
          }
        }),
        autoprefixer({
          flexbox: true,
          grid: true,
          overrideBrowserslist: ['iOS >= 9']
        })
      ]
    }
  },
  plugins: [
    legacy({
      targets: ['ios >= 9'],
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
    minify: 'terser',
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