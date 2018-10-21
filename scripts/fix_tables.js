const { getDb } = require('../src/db')

const main = async () => {
  try {
    const db = await getDb()
    const TABLES = db.content.get('tables')

    await TABLES

      .map(x => {
        x.externals = x.externals || []
        x.categories = x.categories || []
        return x
      })
      .write()

    console.log('done')

  } catch (e) {
    console.error(e)
  }
}

main()
