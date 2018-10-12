const { union } = require('lodash')

const { getDb } = require('../src/db')

const main = async () => {
  try {
    const db = await getDb()

    const all = db.pages.get('all').value()
    const pending = db.pages.get('pending').value()
    const excluded = db.pages.get('excluded').value()
    const redirects = db.pages.get('redirects').value()
    const categories = db.pages.get('categories').keys().value()

    const loadedNames = db.content.get('tables').map(x => x.name).value()

    const skipped = union(excluded, redirects)
    const test = union(loadedNames, skipped).length

    console.log(JSON.stringify(categories.sort(), null, 2))

    console.log(`Loaded: ${loadedNames.length} Total: ${test}. Skipped: ${skipped.length}. Pending: ${pending.length}`)

    console.log(`All loaded?: ${test === all.length}`)
    console.log(`Categories: ${categories.length}`)

    console.log('done')

  } catch (e) {
    console.error(e)
  }
}

main()
