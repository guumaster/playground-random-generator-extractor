const { getDb } = require('../../src/db')
const usedBy = require('../../src/db/used_by')
const { noTables, flattenFields, omitFields, printTable } = require('../utils')

const main = async (rawQuery) => {
  const query = rawQuery.toLowerCase().trim()
  try {
    const db = await getDb()
    const TABLES = db.content.get('tables')
    const getUsedBy = usedBy(TABLES)

    const found = TABLES
      .filter(x => {
        return x.name.toLowerCase().match(query) || x.tables.toLowerCase().match(new RegExp(`^;.*${query}`, 'im'))
      })
      .map(getUsedBy)
      .map(x => {
        x.name = `${x.name}\n  [${x.lines}/${x.size}]`
        return x
      })
      .map(flattenFields(['categories']))
      .map(omitFields(['tables', 'usedBy', 'externals', 'lines', 'size', 'tables']))
      .value()

    console.log(printTable(found))
    console.log(`Found ${found.length} for "${query}"`)

  } catch (e) {
    console.error(e)
  }
}

main(process.argv[2])
