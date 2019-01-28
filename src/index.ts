import * as signale from 'signale';
import { args } from './args';
import { takeScreenshot } from './capture';

takeScreenshot(args).catch(error => {
  signale.fatal(error);
  process.exit(1);
});
