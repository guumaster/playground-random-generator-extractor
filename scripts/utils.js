const rpgen = require('@rolodromo/rpgen')
const Table = require('cli-table3')
const { range, omit, includes, pick } = require('lodash')

const { getDb } = require('../src/db')
const usedBy = require('../src/db/used_by')

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

const generate = ({ data, tpl='main', total= 20 }) => {
  const content = `;@tpl|test\n[${tpl}]\n${data.tables}`
  const generator = rpgen.generator.create(content)

  return range(total).map(_ => ({ sample: generator.generate().replace(/[\n|\r]{2,}/, '') }))
}

const findOne = async name => {
  const db = await getDb()
  const TABLES = db.content.get('tables')
  const found = TABLES.find({ name }).value()
  found.uses = found.externals.length
  found.tableNames = extractNames(found.tables)
  return usedBy(TABLES)(found)
}

const extractNames = tables => {
  return `\n${tables}`.match(/\n;([^\n])+\n/gm).map(name => name.replace(/;/, '').trim()).sort()
}

module.exports = {
  findOne,
  noTables,
  printTable,
  flattenFields,
  omitFields,
  generate,
  extractNames
}
