import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
        build: {
            sourcemap: true,
            outDir: 'build',
        },
        plugins: [react()],
        test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: 'src/testSetup.js',
        },
        server: {
            host: '0.0.0.0',
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    changeOrigin: true,
                    secure: false,
                }
            }
        },
        base: '/',
    };
});