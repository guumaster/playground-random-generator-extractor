const { pick } = require('lodash')

const { getDb } = require('../src/db')
const groupByCategories = require('../src/db/group_by_categories')

const main = async () => {
  try {
    const db = await getDb()

    const tables = db.content.get('tables')
      // .filter(x => (x.externals && !x.externals.length))
      .filter(x => x.name.match(/pulp/ig))
      .map(x => pick(x, ['name', 'lines', 'size']))
      .value()

    const lines = db.content.get('tables')
      .filter(x => x.name.match(/pulp/ig))
      .reduce((tot, x) => tot + x.lines, 0)
      .value()

    console.log(`Tables: `)
    console.log(JSON.stringify(tables, null, 2))
    console.log(`total: ${tables.length}`)
    console.log(`total: ${lines}`)

    console.log('done')

  } catch (e) {
    console.error(e)
  }
}

main()
