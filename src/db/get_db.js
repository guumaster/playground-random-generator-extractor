const low = require('lowdb')
const path = require('path')
const FileAsync = require('lowdb/adapters/FileAsync')

let DB

const loadDb = async name => {
  const db = await low(new FileAsync(path.join(__dirname, `../../data/${name}.json`)))
  await db.read()
  return db
}


module.exports = async () => {
  if (DB) return DB

  DB = {
    pages: await loadDb('pages'),
    content: await loadDb('content')
  }
  return DB
}