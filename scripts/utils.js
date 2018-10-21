const { omit, includes, pick } = require('lodash')

const Table = require('cli-table3')

const printTable = (data, options={}) => {
  const table = new Table({
    head: Object.keys(data[0]),
    wordWrap: true,
    ...options
  })
  data.map(x => table.push(Object.values(x)))

  return table.toString()
}

const omitFields = fields => x => omit(x, fields)

const flattenFields = fields => x => {
  fields.forEach(f => {
    x[f] = (x[f]||[]).join('\n')
  })
  return x
}

const noTables = x => omit(x, 'tables')

module.exports = {
  noTables,
  printTable,
  flattenFields,
  omitFields
}
