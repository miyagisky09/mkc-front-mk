import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import obfuscator from 'vite-plugin-javascript-obfuscator';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      obfuscator({
        // compact: true,
        controlFlowFlattening: true,
        stringArray: true,
        stringArrayEncoding: ['base64'], // or 'rc4'
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.2,
      }as any),
    ],
  };
});
