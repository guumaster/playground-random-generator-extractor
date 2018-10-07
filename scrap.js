require('events').EventEmitter.prototype._maxListeners = 1000
const getBrowser = require('./browser')

const { take, uniq, difference } = require('lodash')
const extractTables = require('./extract_tables')

const getPageUrl = title => `http://www.random-generator.com/index.php?title=${title}&action=edit`

let QUEUE = []

const getTables = async (title) => {
  const url = getPageUrl(title)
  console.log('url', encodeURI(url))

  const browser = await getBrowser()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle0' })

  const tables = await page.evaluate(() => {
    try {
      const textarea = document.querySelector('textarea#wpTextbox1').value
      const [, , tables] = textarea.match(/<sgtable>(((?:(?!<\/sgtable>).*\r?\n?)*))/im)
      return tables

    } catch (e) {
      console.log(e)
    }
  })

  await page.close()
  return tables
}

const getExternals = async externals => {
  return await Promise.all(externals.map(ref => getGenerator(ref)))
}

const getGenerator = async name => {
  if (QUEUE.includes(name)) return {}
  QUEUE.push(name)

  const table = await getTables(name)
  const externals = extractTables(table)

  return { name, table, externals }
}

const main = async ([, , name]) => {
  const { table, externals } = await getGenerator(name)

  const TABLES = {
    [name]: table
  }

  let pending = externals

  while (pending.length) {
    const list = await getExternals(take(pending, 5))

    list.forEach(ref => {
      if (!ref || !ref.name) return

      TABLES[ref.name] = ref.table
      pending = uniq(pending.concat(ref.externals))
    })

    pending = difference(pending, Object.keys(TABLES))
  }


  console.log('GENERATOR:', TABLES)


  const browser = await getBrowser()
  browser.close()
}

process.argv[2] = 'FantasyBooks'
process.argv[2] = 'Tavern'
main(process.argv)
