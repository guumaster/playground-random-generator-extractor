const { getDb } = require('../../src/db')
const usedBy = require('../../src/db/used_by')
const { noTables, flattenFields, omitFields, printTable } = require('../utils')

const main = async () => {
  try {
    const db = await getDb()
    const TABLES = db.content.get('tables')
    const getUsedBy = usedBy(TABLES)

    const noDeps = TABLES
      .reject(x => x.externals.length)
      .map(getUsedBy)
      .sortBy('lines')
      .reverse()
      .map(x => {
        x.name = `${x.name}\n  [${x.lines}/${x.size}]`
        return x
      })
      .map(flattenFields(['usedBy', 'categories']))
      .map(noTables)
      .map(omitFields(['externals', 'lines', 'size', 'tables']))
      .value()

    console.log(printTable(noDeps, { colWidths: [55, 40, 40, 4] }))
    console.log(`total: ${noDeps.length}`)

  } catch (e) {
    console.error(e)
  }
}

main()

