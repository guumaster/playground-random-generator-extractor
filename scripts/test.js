const { range, includes, omit, pick } = require('lodash')
const rpgen = require('@rolodromo/rpgen')

const { getDb } = require('../src/db')

const main = async (name, tpl='main') => {
  try {
    const db = await getDb()

    const details = db.content.get('tables')
      .find({ name })
      .value()

    const content = `;@tpl|test
[${tpl}]

${details.tables}`
    const generator = rpgen.generator.create(content)
    console.log('-----------------------------------------------')
    console.log(details.tables)
    console.log(JSON.stringify(omit(details, ['tables']), null, 2))
    console.log('-----------------------------------------------')
    console.log(range(20).map(_ => generator.generate()).join('\n').replace(/[\n|\r]+/gm, '\n'))
    console.log('-----------------------------------------------')

  } catch (e) {
    console.error(e)
  }
}

main(process.argv[2], process.argv[3])
