import terser from '@rollup/plugin-terser';
import brotli from "rollup-plugin-brotli";

export default [{
    input: './dist/mod.js',
    output: {
        file: './dist/hx.js',
        name: 'hx'
    },
}, {
    input: './dist/mod.js',
    output: {
        file: './dist/min.js',
        name: 'hx-dist'
    },
    plugins: [terser(), brotli()]
}]
