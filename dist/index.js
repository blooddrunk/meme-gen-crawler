"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const signale = require("signale");
const args_1 = require("./args");
const capture_1 = require("./capture");
capture_1.takeScreenshot(args_1.args).catch(error => {
    signale.fatal(error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map