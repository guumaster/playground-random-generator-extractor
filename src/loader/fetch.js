const { getBrowser } = require('./browser')

const extractTables = require('./extract_tables')
const cleanCategory = require('./clean_category')

const cleanCategories = cats => cats.map(cleanCategory)

const getPageUrl = title => `http://www.random-generator.com/index.php?title=${decodeURIComponent(title)}&action=edit`

let QUEUE = []

const fetchTable = async (title) => {
  const url = getPageUrl(title)
  console.log('url', encodeURI(url))

  const browser = await getBrowser()
  const page = await browser.newPage()

  page.on('error', err => {
    console.error('error happen at the page: ', err)
  })

  page.on('pageerror', pageerr => {
    console.error('pageerror occurred: ', pageerr)
  })

  page.on('console', (msg) => console[msg.type()](`"${title}": `, msg.text(), msg.args()))

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 })

  page.exposeFunction(cleanCategories)

  const tables = await page.evaluate(() => {
    try {
      const textarea = document.querySelector('textarea#wpTextbox1')
      if (!textarea || !textarea.value) {
        throw new Error('Missing textarea')
      }

      if (textarea.value.match(/#REDIRECT/m)) {
        return { tables: '', redirect: true }
      }

      const match = textarea.value.match(/<sgtable>(((?:(?!<\/sgtable>).*\r?\n?)*))/im)
      const categories = textarea.value.match(/\[\[Category:((?:[^\]])*)/ig)

      return {
        tables: match ? match[2] : '',
        categories: categories ? cleanCatetories(categories) : []
      }
    } catch (e) {
      console.error('Error parsing', e)
      return {}
    }
  })

  await page.close()
  return tables
}

module.exports = async name => {
  if (QUEUE.includes(name)) return {}
  QUEUE.push(name)

  const { tables, categories, redirect } = await fetchTable(name)

  const externals = extractTables(tables)

  return { name, tables, categories, externals, redirect }
}
