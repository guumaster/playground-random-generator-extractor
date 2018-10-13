const { sort, uniq } = require('lodash')
const { getDb, saveCategories } = require('../src/db')

const main = async () => {
  try {
    const db = await getDb()

    // Filter pulp tables
    // await db.content.get('tables')
    //   // .remove(x => x.name.match(/. pulp/ig))
    //   .sortBy('name')
    //   .write()
    //
    // await saveCategories()


    // add pulp to excluded
    const pulp = await db.pages.get('all')
    .filter(x => x.match(/. pulp/ig))
      .value()

    const newList = db.pages.get('excluded').value().concat(pulp)
    await db.pages.set('excluded', uniq(newList).sort()).write()

    console.log('done')

  } catch (e) {
    console.error(e)
  }
}

main()
