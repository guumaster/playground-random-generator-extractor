require('events').EventEmitter.prototype._maxListeners = 1000

const fetchGenerator = require('../src/loader/fetch')
const { getDb, savePending, saveCategories } = require('../src/db')
const { getBrowser, closeBrowser } = require('../src/loader/browser')

const BATCH_SIZE = 10
let PROCESSED = 0

const showStats = (db) => {
  const done = db.content.get('tables').keys().size().value()
  const total = db.pages.get('all').size().value()
  const pending = db.pages.get('pending').size().value()

  console.log(`Processed: ${done}/${total}. Pending: ${pending} (${PROCESSED+=BATCH_SIZE})`)
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

      const list = await Promise.all(batch.map(async name => {
        console.log('processing', name)
        return fetchGenerator(name)
      }))

      await list.reduce(async (promise, data) => {
        await promise
        if (!data.name) return
        return db.content.get(`tables`).push(data).write()
        // return Promise.resolve()
      }, Promise.resolve())

      console.log('saving pending')
      await savePending()
      showStats(db)
      //
      // if (PROCESSED % 160 === 0) {
      //   await closeBrowser()
      // }

    } while (batch.length )

    await saveCategories()
    console.log('done')

  } catch (e) {
    console.error(e)
  } finally {
    closeBrowser()
  }
}

main()
