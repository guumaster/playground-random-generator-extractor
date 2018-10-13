const { pick } = require('lodash')

const { getDb } = require('../src/db')
const groupByCategories = require('../src/db/group_by_categories')

const main = async () => {
  try {
    const db = await getDb()

    await db.content.get('tables')
      .filter(x => !x.name.match(/pulp/ig))
      .write()

    await saveCategories()

    console.log('done')

  } catch (e) {
    console.error(e)
  }
}

main()
