const { getDb } = require('../../src/db')
const { findOne, generate, printTable } = require('../utils')

const main = async (name, tpl='main') => {
  try {
    const details = await findOne(name)
    const samples = generate({ data: details, tpl })
    console.log(printTable(samples, { colWiths: [140]}))

  } catch (e) {
    console.error(e)
  }
}

main(process.argv[2], process.argv[3])
