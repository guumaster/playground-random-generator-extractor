const { getDb, saveCategories } = require('../src/db')

const main = async () => {
  try {
    await saveCategories()

    const db = await getDb()

    console.log('CATS', db.pages.get('categories').keys().value())

    console.log('done')

  } catch (e) {
    console.error(e)
  }
}

main()
