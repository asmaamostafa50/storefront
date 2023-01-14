"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (req, _res, next //resolve linter error to not use Function as a type
) => {
    //to destructure with types you have to assign a type to the whole list
    const { url, method } = req;
    console.log(`visited ${url}. With method ${method}.`);
    next();
};
exports.default = logger;
