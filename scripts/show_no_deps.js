const { includes, pick } = require('lodash')

const { getDb } = require('../src/db')
const groupByCategories = require('../src/db/group_by_categories')

const usedBy = (db, name) => {
  return db.content.get('tables')
    .filter(x => includes(x.externals, name))
    .map('name')
    .value()
}

const main = async () => {
  try {
    const db = await getDb()
    const TABLES = db.content.get('tables')

    const noDeps = TABLES
      .filter(x => !x.externals || !x.externals.length)
      .map(x => ({ ...pick(x, ['name', 'lines', 'size']), usedBy: usedBy(db, x.name) }))
      .take(10)
      .value()

    console.log(`Tables with no deps: `)
    console.log(JSON.stringify(noDeps, null, 2))
    // console.log(JSON.stringify(groupByCategories(noDeps), null, 2))
    console.log(`total: ${noDeps.length}`)


    console.log('done')

  } catch (e) {
    console.error(e)
  }
}

main()
