import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import obfuscator from 'vite-plugin-javascript-obfuscator';
// import strip from 'vite-plugin-strip';
import strip from '@rollup/plugin-strip';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      obfuscator({
        controlFlowFlattening: true,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.2,
        disableConsoleOutput: true,
      } as any),
    ],
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,     // This removes all console.* calls
          drop_debugger: true,    // This removes debugger statements
        },
      },
      rollupOptions: {
        plugins: [
          strip({
            include: ['**/*.js', '**/*.ts', '**/*.vue', '**/*.tsx', '**/*.jsx'],
            functions: ['console.log', 'console.debug', 'console.info', 'assert'],
          }),
        ],
      },
    },
  };
});
