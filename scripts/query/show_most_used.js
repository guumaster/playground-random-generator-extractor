const { getDb } = require('../../src/db')

const usedBy = require('../../src/db/used_by')
const { flattenFields, omitFields, printTable } = require('../utils')

const main = async () => {
  try {
    const db = await getDb()
    const TABLES = db.content.get('tables')
    const getUsedBy = usedBy(TABLES)

    const used = TABLES
      .map(getUsedBy)
      .sortBy('totalUsedBy')
      .reverse()
      .map(x => {
        x.name = `${x.name}\n  [${x.lines}/${x.size}]`
        return x
      })
      .map(omitFields(['lines', 'size', 'tables']))
      .map(flattenFields(['usedBy', 'externals']))
      .take(10)
      .value()

      console.log(printTable(used))

  } catch (e) {
    console.error(e)
  }
}

main()
