import * as puppeteer from 'puppeteer';

const scrape = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://books.toscrape.com/', {
    waitUntil: 'domcontentloaded',
  });

  // Scrape
  await page.click(
    '#default > div.container-fluid.page > div > div > div > section > div:nth-child(2) > ol > li:nth-child(1) > article > div.image_container > a > img'
  );

  const result = await page.evaluate(() => {
    const title = document.querySelector('h1').innerText;
    const price = document.querySelector<HTMLParagraphElement>('.price_color')
      .innerText;

    return {
      price,
      title,
    };
  });

  browser.close();
  return result;
};

scrape().then(value => {
  console.log(value); // Success!
});
