const { getDb, savePending } = require('../../src/db')

const main = async () => {
  try {

    const db = await getDb()
    await db.pages.get('excluded').sort().uniq().write()

    await savePending()

    console.log('done')

  } catch (e) {
    console.log(e)
  }
}

main()
