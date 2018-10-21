require('events').EventEmitter.prototype._maxListeners = 1000

const fetchGenerator = require('../../src/loader/fetch')
const parseContent = require('../../src/parser')
const { getBrowser, closeBrowser } = require('../../src/loader/browser')

const main = async ([, , name]) => {
  const content = await fetchGenerator(name)

  const data = parseContent(content)
  console.log('GENERATOR:', data)

  closeBrowser()
}

main(process.argv)

