const { range, omit } = require('lodash')
const rpgen = require('@rolodromo/rpgen')

const { getDb } = require('../src/db')
const usedBy = require('../src/db/used_by')
const { noTables, flattenFields, omitFields, printTable } = require('./utils')

const main = async (name, tpl='main') => {
  try {
    const db = await getDb()

    const TABLES = db.content.get('tables')
    let details = TABLES
      .find({ name })
      .value()

    const content = `;@tpl|test
[${tpl}]
${details.tables}`

    const generator = rpgen.generator.create(content)

    const samples = range(20)
      .map(_ => generator
        .generate()
        .replace(/[\n|\r]+/gm, '\n')
        .match(/.{1,135}/ig).join('\n')
      ).join('\n')

    console.log('-----------------------------------------------')
    console.log(details.tables)
    console.log('-----------------------------------------------')

    details = usedBy(TABLES)(details)
    details.name = `${details.name}\n  [${details.lines}/${details.size}]`
    details = omitFields(['tables', 'lines', 'size'])(details)
    details = flattenFields(['externals', 'usedBy', 'categories'])(details)

    console.log(printTable([ details ]))
    console.log(printTable([{ samples }], { colWiths: [140]}))

  } catch (e) {
    console.error(e)
  }
}

main(process.argv[2], process.argv[3])
