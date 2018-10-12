const { savePending } = require('../src/db')

const main = async () => {
  try {

    await savePending()

    console.log('done')

  } catch (e) {
    console.log(e)
  }
}

main()
