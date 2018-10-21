const { includes, omit, pick } = require('lodash')

const { getDb } = require('../src/db')
const groupByCategories = require('../src/db/group_by_categories')

const usedBy = (db, name) => {
  return db.content.get('tables')
    .filter(x => includes(x.externals, name))
    .map('name')
    .value()
}

const main = async (name) => {
  try {
    const db = await getDb()

    const details = db.content.get('tables')
      .find({ name })
      .value()

    details.usedBy = usedBy(db, details.name)
    console.log('-----------------------------------------------')
    console.log(details.tables)
    console.log(JSON.stringify(omit(details, ['tables']), null, 2))
    console.log('done')

  } catch (e) {
    console.error(e)
  }
}

main(process.argv[2])
