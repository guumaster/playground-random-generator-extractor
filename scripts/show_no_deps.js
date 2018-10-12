const { pick } = require('lodash')

const { getDb } = require('../src/db')
const groupByCategories = require('../src/loader/group_by_categories')

const main = async () => {
  try {
    const db = await getDb()

    const noDeps = db.content.get('tables').filter(x => (x.externals && !x.externals.length)).map(x => pick(x, ['name', 'categories'])).value()

    console.log(`Tables with no deps: `)
    console.log(JSON.stringify(groupByCategories(noDeps), null, 2))
    console.log(`total: ${noDeps.length}`)


    console.log('done')

  } catch (e) {
    console.error(e)
  }
}

main()
