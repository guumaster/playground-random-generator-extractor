require('events').EventEmitter.prototype._maxListeners = 1000

const fetchGenerator = require('../../src/loader/fetch')
const parseContent = require('../../src/parser')
const { getDb, savePending, saveCategories } = require('../../src/db')
const { getBrowser, closeBrowser } = require('../../src/loader/browser')

const BATCH_SIZE = 10
let PROCESSED = 0

const showStats = (db) => {
  const done = db.content.get('tables').keys().size().value()
  const total = db.pages.get('all').size().value()
  const pending = db.pages.get('pending').size().value()

  console.log(`Processed: ${done}/${total}. Pending: ${pending} (${PROCESSED += BATCH_SIZE})`)
}

const main = async () => {
  try {
    let batch
    let browser
    const db = await getDb()
    await savePending()
    showStats(db)

    do {
      browser = await getBrowser()

      batch = db.pages.get('pending').take(BATCH_SIZE).value()

      await Promise.all(batch.map(async name => {
        const raw = await fetchGenerator(name)
        const data = parseContent(raw)
        if (!data.tables) {
          console.error(`Empty: ${data.name}`)
          return db.pages.get(`empty`).push(data.name).uniq().sort().write()
        }
        return db.content.get(`tables`).push(data).write()
      }))

      console.log('saving pending')
      await savePending()
      showStats(db)

    } while (batch.length)

    await saveCategories()
    console.log('done')

  } catch (e) {
    console.error(e)
  } finally {
    closeBrowser()
  }
}

main()

