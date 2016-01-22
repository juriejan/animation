
const Promise = require('bluebird')

const utils = require('./utils')

function build () {
  return Promise.resolve()
}

module.exports = build

if (!module.parent) {
  build().catch(utils.handleError)
}
