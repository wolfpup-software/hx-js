import terser from '@rollup/plugin-terser';
import brotli from "rollup-plugin-brotli";

export default [{
    input: './dist/mod.js',
    output: {
        file: './dist/hx.js',
        name: 'hx'
    },
}, {
    input: './dist/hx.js',
    output: {
        file: './dist/hx-min.js',
        name: 'hx-min'
    },
    plugins: [terser(), brotli()]
}]
