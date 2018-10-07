const puppeteer = require('puppeteer')

let BROWSER

module.exports = async () => {
  if (BROWSER) return BROWSER

  BROWSER = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN || undefined, // eslint-disable-line no-process-env
    args: ['--no-sandbox', '--headless', '--disable-gpu'],
  })
  return BROWSER
}

