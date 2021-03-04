#!/usr/bin/env node

const args = process.argv.slice(2);

let source;
let output;
const resc = {};

const reFlag = /(?:\-\-resc\:|\-r\:)(.*)/;

for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (arg.startsWith('-')) { // flag
        let match = reFlag.exec(arg);
        if (match) {
            let flag = match[1];
            let value = args[++i];
            if (isUndef(value)) printUsage();
            resc[flag] = value;
        } else {
            // Unrecognized flag
            printUsage();
        }
    } else { // source
        if (!isUndef(source)) {
            if (!isUndef(output)) printUsage();
            output = arg;
        } else {
            source = arg;
        }
    }
}

if (isUndef(source)) printUsage();

function printUsage() {
    console.log(`inline-resc <source_path> [<output_path>] --resc:<template_name> <template_file>`);
    process.exit(1);
}

function isUndef(x) {
    return typeof x === "undefined";
}

const InlineResource = require("./index.js");
const fs = require('fs');

const file = fs.readFileSync(source).toString();
const inlined = (new InlineResource(resc)).inline(file);

fs.writeFileSync(output, inlined);
