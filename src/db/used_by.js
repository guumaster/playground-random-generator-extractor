const { includes } = require('lodash')

module.exports = TABLES => row => {
  const usedBy = TABLES
    .filter(x => includes(x.externals, row.name))
    .map('name')
    .value()
  return { ...row, usedBy, totalUsedBy: usedBy.length }
}
