const calcPending = require('./calc_pending')
const getDb = require('./get_db')

module.exports = async () => {
  const db = await getDb()
  const pending = await calcPending()
  return db.pages.set('pending', pending).write()
}