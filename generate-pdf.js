const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve('coverage/lcov-report/index.html'));
  await page.pdf({ path: 'coverage/report.pdf', format: 'A4', printBackground: true });
  await browser.close();
  console.log('PDF generado en coverage/report.pdf');
})();