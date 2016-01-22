
const _ = require('lodash')

const rollup = require('rollup')
const rollupBabel = require('rollup-plugin-babel')

const Promise = require('bluebird')

const fs = Promise.promisifyAll(require('fs-extra'))

const lint = require('./lint')
const utils = require('./utils')

const PACKAGE = require('../bower.json')
const TARGET = PACKAGE['build-target']
const GLOBALS = PACKAGE['globals']

function packageApplication (entry, dest, globals) {
  return Promise.resolve()
    .then(() => rollup.rollup({
      entry,
      external: _.keys(globals),
      plugins: [rollupBabel()]
    }))
    .then((bundle) => bundle.generate({
      dest,
      globals,
      format: 'umd',
      moduleName: 'animation'
    }))
    .then((result) => {
      var mapFileName = `${dest}.map`
      var code = result.code + `\n//# sourceMappingURL=${mapFileName}`
      return Promise.all([
        fs.writeFileAsync(dest, code),
        fs.writeFileAsync(mapFileName, result.map)
      ])
    })
    .then(() => utils.log(`Packaged application at '${entry}'`))
}

function build () {
  return Promise.resolve()
    .then(() => lint())
    .then(() => utils.mkdirs('dist'))
    .then(() => utils.mkdirs('dist/js'))
    .then(() => packageApplication('src/index.js', TARGET, GLOBALS))
}

module.exports = build

if (!module.parent) {
  build().catch(utils.handleError)
}
