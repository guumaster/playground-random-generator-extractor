const puppeteer = require('puppeteer')

let BROWSER

const getBrowser = async () => {
  if (BROWSER) return BROWSER

  console.log('opening browser')
  BROWSER = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN || undefined, // eslint-disable-line no-process-env
    args: ['--no-sandbox', '--headless', '--disable-gpu'],
    // args: ['--disable-dev-shm-usage']
  })
  return BROWSER
}

const closeBrowser = async () => {
  await BROWSER.close()
  BROWSER = undefined
}

module.exports = {
  getBrowser,
  closeBrowser
}