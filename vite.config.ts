import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [dts({
        // copyDtsFiles: true,
        bundleTypes: true,
    })],
    test: {
        include: ['tests/**/*.test.ts'],
    },
    build: {
        minify: false,
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: 'index'
        }
    }
});
