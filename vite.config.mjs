import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  base: '/', 
  define: {
    global: 'window'
  },
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), 'node_modules/$1')
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), 'src/$1')
      }
    ]
  },
  server: {
    open: true,
    host: '0.0.0.0', 
    port: 8080,  
    proxy: {
      '/api/user/login': {
        target: 'https://backend-superlearner-1083661745884.us-central1.run.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/user\/login/, '/api/user/login'),
      },
      '/api/class/get_Courses': {
        target: 'https://backend-superlearner-1083661745884.us-central1.run.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/class\/get_Courses/, '/api/class/get_Courses'),
      },
      '/api/student/getStudents': {
        target: 'https://backend-superlearner-1083661745884.us-central1.run.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/student\/getStudents/, '/api/student/getStudents'),
      },
      '/api/student/create_session': { // Añadido proxy para create_session
        target: 'https://backend-superlearner-1083661745884.us-central1.run.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/student\/create_session/, '/api/student/create_session'),
      },
      '/api/students/': {
        target: 'https://backend-superlearner-1083661745884.us-central1.run.app',
        changeOrigin: true,
        secure: true,
      },
      '/api/parents/': {
        target: 'https://backend-superlearner-1083661745884.us-central1.run.app',
        changeOrigin: true,
        secure: true,
      },
      '/volunteers/': {
        target: 'https://backend-superlearner-1083661745884.us-central1.run.app',
        changeOrigin: true,
        secure: true,
      }
    },
  },
  preview: {
    open: true,
    host: '0.0.0.0',  // Asegura que el modo de previsualización también esté disponible
    port: 8080  
  }
});
