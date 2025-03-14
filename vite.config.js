import { defineConfig } from 'vite';
import legacy from 'vite-plugin-legacy';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: '/examples/index.html',
      }
    }
  },
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  resolve: {
    alias: {
      'jquery': '/bower_components/jquery/jquery.js',
      'jquery-ui': '/lib/jquery/jquery-ui-1.8.24.custom.min.js',
      'jquery.event.drag': '/lib/jquery/plugins/jquery.event.drag-2.0.min.js',
      'jquery-nearest': '/bower_components/jquery-nearest/src/jquery.nearest.min.js',
      'circuit-solver': '/bower_components/circuit-solver/dist/circuitSolver.js'
    }
  }
}); 