import * as puppeteer from 'puppeteer';
import * as devices from 'puppeteer/DeviceDescriptors';
const phone = devices['iPhone X'];

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.emulate(phone);
  await page.goto('http://localhost:3101/', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitFor(2000);

  const bodyHandle = await page.$('body');
  const { width, height } = await bodyHandle.boundingBox();
  const screenshot = await page.screenshot({
    clip: {
      x: 0,
      y: 0,
      width,
      height,
    },
    type: 'jpeg',
    path: 'nice-image.jpg',
    fullPage: false,
  });

  await bodyHandle.dispose();

  // await page.screenshot({
  //   type: 'jpeg',
  //   path: 'nice-image.jpg',
  //   fullPage: true,
  // });

  await browser.close();
};

scrape();
