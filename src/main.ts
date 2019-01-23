import * as puppeteer from 'puppeteer';
import * as devices from 'puppeteer/DeviceDescriptors';
const phone = devices['iPhone X'];

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: true });

  const page = await browser.newPage();
  await page.emulate(phone);
  await page.goto('http://localhost:3101/', {
    waitUntil: 'networkidle2',
  });

  await page.waitFor(2000);

  await page.screenshot({
    type: 'jpeg',
    path: 'nice-image.jpg',
    // fullPage: true,
  });

  await browser.close();
};

scrape();
