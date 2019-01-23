import * as yargs from 'yargs';

const validateInteger = (key, arg) => {
  arg = (arg || '').toString();

  if (arg.match(/^-{0,1}\d+$/)) {
    return Number.parseInt(arg, 10);
  }

  throw new Error(
    `Invalid value for argument ${key}: the value is not an integer number`
  );
};

export const args = yargs
  .usage('$0 [url]', 'Create sreenshot of give URL with options', y =>
    y
      .positional('url', {
        describe: 'The url for which the screenshot will be taken',
        type: 'string',
        default: 'http://localhost:3101', // for development convenience
        alais: 'u',
      })
      .option('output-file', {
        describe:
          'The output file where to save the screenshot, if not provided, will be saved as `screenshot.jpg` in current directory',
        type: 'string',
        demandOption: true,
        default: './screenshot.jpg',
        alias: ['output', 'o'],
      })
      .option('timeout', {
        describe:
          'The amount of time in milliseconds to wait for the page to load completly',
        type: 'number',
        demandOption: false,
        default: 30000,
        alias: 't',
        coerce: arg => validateInteger('timeout', arg),
      })
      .option('verbose', {
        describe: 'Output information about the progress of the screenshot',
        type: 'boolean',
        demandOption: false,
        default: true,
        alias: 'v',
      })
      .option('fullscreen', {
        describe: 'fullscreen screenshot',
        type: 'boolean',
        demandOption: false,
        default: true,
        alias: 'f',
      })
      .option('device', {
        describe:
          'Key of device descriptors, will be ignored if both `viewport-width` and `viewport-height` are provided, see https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js for available devices',
        type: 'string',
        default: 'iPhone X',
        alias: 'd',
      })
      .option('viewport-width', {
        describe: 'The width of the browser viewport',
        type: 'number',
        demand: false,
        alias: 'vw',
        coerce: arg => validateInteger('viewport-width', arg),
      })
      .option('viewport-height', {
        describe: 'The height of the browser viewport',
        type: 'number',
        demand: false,
        alias: 'vh',
        coerce: arg => validateInteger('viewport-height', arg),
      })
  )

  .help()
  .parse();
