import { min } from 'd3';
import { defineConfig } from 'vite';
import FullReload from 'vite-plugin-full-reload'

export default defineConfig({
  root: '.',  // The root directory for the project (default is current directory)
  publicDir: 'public',  // Specify the public directory (for static assets)
  build: {
    target: 'esnext',  // The target environment (modern browsers)
    sourcemap: true,   // Generate source maps for easier debugging
    minify: 'esbuild', // Specify minification options
},
  server: {
    port: 3141,//Math.floor(Math.random() * (4000 - 3000 + 1)) + 3000,  // Specify the port to use
    open: true,
    hmr: false,
    // hmr: {
    //   protocol: 'ws',  // WebSocket-based HMR (default)
    //   port: 3000,         // Keep error overlay enabled for visual feedback
    //   fullReload: ['**/*.js']
    // },
  },
  plugins: [
    FullReload(['**/*.js'])
  ],
});




