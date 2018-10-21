const { findOne } = require('../utils')

const main = async (name, tpl='main') => {
  try {
    const found = await findOne(name)
    console.log('-----------------------------------------------')
    console.log(found.tables)
    console.log('-----------------------------------------------')

  } catch (e) {
    console.error(e)
  }
}

main(process.argv[2])

