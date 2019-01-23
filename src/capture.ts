import * as puppeteer from 'puppeteer';
import * as devices from 'puppeteer/DeviceDescriptors';
import * as signale from 'signale';

import { calculatePageHeight } from './client';

interface Args {
  url: string;
  verbose: boolean;
  fullscreen: boolean;
  output: string;
  timeout: number;
  device: string;
  vw: number;
  vh: number;
}

const isDev = process.env.NODE_ENV === 'development';

export const takeScreenshot = async ({
  url,
  verbose,
  fullscreen,
  output,
  timeout,
  device,
  vw,
  vh,
}: Args) => {
  const browser = await puppeteer.launch({
    headless: !isDev,
    args: ['--disable-translate', '--mute-audio'],
  });

  const page = await browser.newPage();

  if (verbose) {
    signale.start(`Start loading page ${url}`);
  }

  if (vw && vh) {
    await page.setViewport({ width: vw, height: vh });
  } else {
    await page.emulate(devices[device]);
  }

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout,
  });

  await page.waitFor(2000);

  if (verbose) {
    signale.success('Page loaded sucessfull');
  }

  const pageHeight = await page.evaluate(calculatePageHeight);

  console.log(pageHeight);

  // await browser.close();
};
