const { map, clone, pick } = require('lodash')

const getDb = require('./get_db')

const groupByCategories = require('./group_by_categories')

module.exports = async () => {
  const db = await getDb()

  const tables = db.content.get('tables').map(x => pick(x, ['name', 'categories'])).value()

  const categories = groupByCategories(tables)


  return db.pages.set('categories', categories).write()
}