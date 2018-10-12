require('events').EventEmitter.prototype._maxListeners = 1000

const fetchGenerator = require('../src/loader/fetch')
const { getBrowser, closeBrowser } = require('../src/loader/browser')

const main = async ([, , name]) => {
  const content = await fetchGenerator(name)

  console.log('GENERATOR:', content)

  closeBrowser()
}

process.argv[2] = 'Basic D%26D Monster Generator'
main(process.argv)
