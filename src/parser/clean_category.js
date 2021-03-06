const { upperFirst } = require('lodash')

module.exports = cat => cat
  .replace(/\[\[Category:/i, '')
  .replace(/[_| ]+/, ' ')
  .replace(/^(Story Games Name Project|Fantasy place)\|.*/, '$1')
  .replace(/[_ ]+/g, ' ')
  .trim()
  .split(/ -/g)
  .map(str => upperFirst(str.toLowerCase()))
  .join(' ')
