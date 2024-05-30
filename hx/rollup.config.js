import terser from '@rollup/plugin-terser';
import brotli from "rollup-plugin-brotli";

export default [{
    input: './dist/mod.js',
    output: {
        file: './dist/hx.js',
        name: 'hx'
    },
    plugins: [terser(), brotli()]
}]
