
function handleError (err) { log(err.stack || err.message || err) }

function log (message) { console.log(message) }

module.exports = {
  handleError,
  log
}
