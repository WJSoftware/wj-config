import typescript from "@rollup/plugin-typescript";
import { minify } from "rollup-plugin-esbuild-minify";

/** @type import("rollup").RollupOptions */
const config = {
    input: 'src/index.ts',
    output: {
        file: './dist/index.min.js',
		format: 'esm',
    },
    plugins: [
        typescript({
            tsconfig: 'tsconfig.bundle.json'
        }),
        minify(),
    ]
};

export default config;
