import * as crypto from 'crypto';
import * as devices from 'puppeteer/DeviceDescriptors';
import * as fs from 'fs-extra';
import * as GM from 'gm';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as signale from 'signale';
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds';

const gm = GM();

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

const calculateSlices = (pageHeight, viewportHeight) => {
  const numberOfSlices = Math.max(1, Math.ceil(pageHeight / viewportHeight));
  const lastSlice = numberOfSlices - 1;
  const slices = new Array(numberOfSlices);

  for (let index = 0; index < slices.length; index++) {
    const y = index * viewportHeight;
    let height = viewportHeight;

    if (index === lastSlice) {
      height = pageHeight - y;
    }

    slices[index] = { y, height };
  }

  return slices;
};

const logProgress = (slices, index) => {
  const percentage = Math.ceil((++index / slices.length) * 100);
  signale.pending(
    `Capturing slice ${index} of ${slices.length} - ${percentage}%`
  );
};

export const takeScreenshot = async ({
  url,
  verbose,
  // fullscreen,
  output,
  temp,
  timeout,
  device,
  vw,
  vh,
}: Args) => {
  const startTime = new Date();

  const browser = await puppeteer.launch({
    headless: !isDev,
    args: ['--disable-translate', '--mute-audio'],
  });

  const page = await browser.newPage();

  // const bodyHandle = await page.$('body');
  // const { width, height } = await bodyHandle.boundingBox();
  // const screenshot = await page.screenshot({
  //   clip: {
  //     x: 0,
  //     y: 0,
  //     width,
  //     height,
  //   },
  //   type: 'png',
  // });

  // await bodyHandle.dispose();

  if (verbose) {
    signale.watch(`Start loading page ${url}`);
  }

  if (vw && vh) {
    await page.setViewport({ width: vw, height: vh });

    if (verbose) {
      signale.info(`Viewport info: { width: ${vw}, height: ${vh} }`);
    }
  } else {
    const deviceInfo = devices[device];
    if (!deviceInfo) {
      throw new Error(
        `Device info for ${device} unavailable, please refer to 'https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js'`
      );
    } else {
      vh = deviceInfo.viewport.height;
      vw = deviceInfo.viewport.width;
      await page.emulate(deviceInfo);

      if (verbose) {
        signale.info(`Device info:`);
        signale.info(devices[device]);
      }
    }
  }

  await page.goto(url, {
    waitUntil: 'domcontentloaded',
    timeout,
  });

  await page.waitFor(2000);

  if (verbose) {
    signale.success('Page loaded successfully');
  }

  const pageHeight = await page.evaluate(calculatePageHeight);
  if (verbose) {
    signale.info(`Page height: ${pageHeight}`);
  }

  const slices = await calculateSlices(pageHeight, vh);
  if (verbose) {
    signale.info(`${slices.length} slice(s) created: `);
    signale.info(slices);
  }

  const fileDirectory = path.dirname(output);
  const fileName = path.basename(output);

  let tempDirectory;
  if (temp === 'out') {
    tempDirectory = fileDirectory;
  } else {
    tempDirectory = path.dirname(temp);
  }

  tempDirectory = path.join(
    tempDirectory,
    crypto
      .createHash('md5')
      .update(`${Date.now()}-${fileName}`)
      .digest('hex')
  );

  fs.mkdirSync(tempDirectory);

  for (let index = 0; index < slices.length; index++) {
    const slice = slices[index];
    const slicePath = `${tempDirectory}/slice_${index}.jpg`;

    logProgress(slices, index);

    await page.screenshot({
      path: slicePath,
      fullPage: false,
      type: 'jpeg',
      clip: {
        x: 0,
        y: slice.y,
        width: vw,
        height: slice.height,
      },
    });
    gm.append(slicePath);
  }

  if (verbose) {
    signale.complete(`All ${slices.length} slice(s) created successfully`);

    signale.watch(`saving screenshot to file ${output}`);
  }

  await browser.close();

  await gm.write(output, err => {
    fs.removeSync(tempDirectory);

    if (err) {
      fs.removeSync(output);
      throw err;
    }

    const totalTime = differenceInMilliseconds(new Date(), startTime);

    signale.success(`Finished in ${totalTime} milliseconds`);
  });
};
