const { getBrowser } = require('./browser')

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

  const content = await page.evaluate(() => {
    try {
      const textarea = document.querySelector('textarea#wpTextbox1')
      return textarea ? textarea.value : ''
    } catch (e) {
      console.error('Error parsing', e)
      return ''
    }
  })

  await page.close()
  return content
}

module.exports = async name => {
  if (QUEUE.includes(name)) return {}
  QUEUE.push(name)

  const content =  await fetchTable(name)
  return { name, content }
}
