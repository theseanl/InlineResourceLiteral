/**
 * @fileoverview It is a gulp task's obligation to provide a list of resources
 * to insert as a value of `global.options['RESOURCES']`.
 */

const fs         = require('fs');
const esprima    = require('esprima');
const estraverse = require('estraverse');
const minifyHtml = require('html-minifier').minify;
const CleanCSS   = require('clean-css');

const DEFAULT_PREFIX = "RESOURCE_";

const esprimaParseOption = { range: true };

class InlineResource {
    constructor(options) {
        // Options can be provided as a global property `global.options.RESOURCES`.
        if (isUndef(options) && !isUndef(global.options)) {
            options = global.options['RESOURCES'];
        }
        if (isUndef(options)) {
            throw new Error("InlineResource: an options object hasn't been provided")
        }
        this.prefix        = options.__prefix || DEFAULT_PREFIX;
        this.reResourceVar = new RegExp('^' + this.prefix + '(.*)$');
        this.rescCache     = new ResourceCache(options, this.prefix);
        this.inline        = this.inline.bind(this);
    }
    inline(code) {
        if (code.indexOf(this.prefix) === -1) { return code; } // Quick path
        const ast = esprima.parseScript(code, esprimaParseOption);
        let taskBuffer = [];
        const option = new ESTraverseOption(taskBuffer, code, this.rescCache, this.reResourceVar);
        estraverse.traverse(ast, option);
        let l = taskBuffer.length;
        while (l--) {
            let task = taskBuffer[l];
            code = code.slice(0, task.start) + task.resc + code.slice(task.end);
        }
        return code;
    }
}

const htmlMinifyOption = {
    collapseWhitespace: true,
    minifyCSS: true,
    removeAttributeQuotes: false,
    removeComments: false,
    removeOptionalTags: true
};
const reNeedsEscape = /[\b\f\n\r\t\v\0"\\]/g;

class ResourceCache {
    constructor(rescMap, prefix) {
        this.rescMap = rescMap;
        this.prefix  = prefix;
        this.cache   = new Map();
    }
    getResource(name, options) {
        let resourcePath = this.rescMap[name];
        if (isUndef(resourcePath)) { return null; }
        let processed = this.cache.get(resourcePath);
        const ext = ResourceCache.getFileExtension(resourcePath);
        if (isUndef(processed)) {
            const raw = fs.readFileSync(resourcePath).toString();
            processed = this.preprocess(raw, ext);
            this.cache.set(resourcePath, processed);
        }
        let intermediate = this.applyOption(processed, ext, options);
        let final = this.ensureQuotes(intermediate, ext, options);
        return final;
    }
    static getFileExtension(name) {
        let i = name.lastIndexOf('.');
        return name.slice(i + 1);
    }
    preprocess(raw, type) {
        switch (type) {
            case 'html':
                return minifyHtml(raw, htmlMinifyOption);
            case 'css':
                return (new CleanCSS()).minify(raw).styles;
            case 'json':
                return JSON.stringify(JSON.parse(raw));
            default:
                return raw;
        }
    }
    applyOption(resc, type, options) {
        if (type === 'json' || isUndef(options)) { return [resc]; }
        let keys = Object.getOwnPropertyNames(options);
        const regexSrc = `${this.prefix}(${keys.join('|')})`;
        const regex = new RegExp(regexSrc);
        return resc.split(regex);
    }
    ensureQuotes(intermediate, type, options) {
        const quoteIsNotNeeded = type === 'json' || (type === 'js' && isUndef(options));
        if (quoteIsNotNeeded) { return intermediate[0]; }
        return intermediate.map((str, index) => {
            if ((index & 1) === 0) {
                return ResourceCache.quotize(str);
            } else {
                return options[str];
            }
        }).join("+");
    }
    static escape(match) {
        return '\\' + match;
    }
    static quotize(resc) {
        return `"${resc.replace(reNeedsEscape, ResourceCache.escape)}"`
    }
}

class ESTraverseOption {
    constructor(buffer, code, rescCache, reResourceVar) {
        this.buffer        = buffer;
        this.code          = code;
        this.rescCache     = rescCache;
        this.reResourceVar = reResourceVar;
        this.enter         = this.enter.bind(this);
    }
    enter(node, parentNode) {
        const type = node.type;
        if (type === 'Identifier') {
            const name = node.name;
            const match = this.reResourceVar.exec(name);
            if (match === null) { return; }
            let rescName = match[1], options, range;
            // Matches `RESOURCE_ARGS(RESOURCE_SCRIPT, "SOME_CONSTANT", const_value)`.
            if (rescName === "ARGS" && parentNode.type === "CallExpression") {
                ({ rescName, options } = this.processArgs(parentNode));
                range = parentNode.range;
            } else {
                range = node.range;
            }
            let resc = this.rescCache.getResource(rescName, options);
            if (!resc) { return; } // skip if no resource is provided.
            this.buffer.push({
                start: range[0],
                end: range[1],
                resc
            });
        }
    }
    processArgs(rescArgNode) {
        const args = rescArgNode.arguments;
        const rescName = args[0].value;
        const options = Object.create(null);
        for (let i = 1, l = args.length; i < l; i++) {
            let marker = args[i].value;
            let cptdNode = args[++i];
            let range = cptdNode.range;
            options[marker] = this.code.slice(range[0], range[1]);
        }
        return { rescName, options };
    }
}

function isUndef(x) {
    return typeof x === 'undefined';
}

module.exports = InlineResource;
