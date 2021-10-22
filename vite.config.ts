import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 2500,
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       cornerstoneWADOImageLoader: ['cornerstone-wado-image-loader'],
    //       dcmjs: ['dcmjs'],
    //       dicomParser: ['dicom-parser'],
    //     },
    //   },
    // },
  },
});
