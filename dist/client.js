"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePageHeight = () => {
    const B = document.body;
    const H = document.documentElement;
    return Math.max(B.scrollHeight, B.offsetHeight, H.clientHeight, H.scrollHeight, H.offsetHeight);
};
//# sourceMappingURL=client.js.map