const { unset } = require('lodash')
const getDb = require('./get_db')

module.exports = async () => {
  const db = await getDb()

  return db.content.get('tables')
    .sortBy('name')
    .map(x => {
      unset(x, 'TEST');
      return x
    })
    .write()
}

