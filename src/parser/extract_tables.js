const { uniq } = require('lodash')

module.exports = (content = '') => {
  const tables = content.match(/\[[^\]]*]/gm)

  if (!tables) return []

  const clean = uniq(tables)
    .filter(m => m.match(/\./))
    .filter(m => !m.match(/http/))
    .map(m => m.replace(/\[(.*)]/, '$1').replace(/\..*/, ''))

  return uniq(clean)
}
