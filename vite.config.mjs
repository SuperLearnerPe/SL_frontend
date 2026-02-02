import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import { env } from 'process';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  base: '/SL_frontend/', 
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
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/user\/login/, '/api/user/login'),
      },
      '/api/class/get_Courses': {
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/class\/get_Courses/, '/api/class/get_Courses'),
      },
      '/api/student/getStudents': {
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/student\/getStudents/, '/api/student/getStudents'),
      },
      '/api/student/create_session': { // Añadido proxy para create_session
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/student\/create_session/, '/api/student/create_session'),
      },
      '/api/students/': {
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: true,
      },
      '/api/parents/': {
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: true,
      },
      '/volunteers/': {
        target: env.VITE_API_URL,
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
