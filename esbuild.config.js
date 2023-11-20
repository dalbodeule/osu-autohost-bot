const { build } = require('esbuild')
const { pnpPlugin } = require('@yarnpkg/esbuild-plugin-pnp')

build({
    entryPoints: [ './src/index.ts' ],
    bundle: true,
    outfile: './dist/bot.js',
    platform: 'node',
    plugins: [ pnpPlugin() ]
})