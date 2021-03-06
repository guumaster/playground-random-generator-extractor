const { getDb } = require('../../src/db')

const main = async () => {
  try {
    const db = await getDb()
    const TABLES = db.content.get('tables')
    const PAGES = db.content.get('tables')

    await TABLES
      .map(x => {
        x.externals = (x.externals || []).sort()
        x.categories = (x.categories || []).sort()
        return x
      })
      .write()

    await PAGES
      .map(x => {
        x.externals = (x.externals || []).sort()
        x.categories = (x.categories || []).sort()
        return x
      })
      .write()

    console.log('done')

  } catch (e) {
    console.error(e)
  }
}

main()
