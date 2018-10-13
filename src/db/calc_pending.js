const { clone, pullAll, union } = require('lodash')

const getDb = require('./get_db')

module.exports = async () => {
  const db = await getDb()

  const pages = db.pages.get('all').value()
  const excluded = db.pages.get('excluded').value()
  const redirects = db.pages.get('redirects').value()
  const empty = db.pages.get('empty').value()
  const done = db.content.get('tables').map(x => x.name).value()

  return pullAll(clone(pages), union(excluded, empty, redirects, done))
}
