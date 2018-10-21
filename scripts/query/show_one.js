const { generate, findOne, flattenFields, omitFields, printTable } = require('../utils')

const main = async (name, tpl='main') => {
  try {
    const details = await findOne(name)

    details.name = `${details.name}\n  [${details.lines}/${details.size}]`

    let table = omitFields(['tables', 'lines', 'size'])(details)
    table = flattenFields(['externals', 'usedBy', 'categories'])(table)

    console.log(printTable([ table ]))
    const samples = generate({ data: details, tpl })
    console.log(printTable(samples, { colWiths: [140]}))

  } catch (e) {
    console.error(e)
  }
}

main(process.argv[2], process.argv[3])

