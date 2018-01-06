const fs = require('fs');
const InlineResource = require('../index.js');

const inline = (new InlineResource({
    TEST_CSS:               'test/test_resources/test.css',
    TEST_HTML:              'test/test_resources/test.html',
    TEST_JS:                'test/test_resources/test.js',
    TEST_JSON:              'test/test_resources/test.json',
    TEST_PRECOMPUTED_CSS:   'test/test_resources/test.precomputed.css',
    TEST_PRECOMPUTED_HTML:  'test/test_resources/test.precomputed.html',
    TEST_PRECOMPUTED_JS:    'test/test_resources/test.precomputed.js',

    NONEXISTENT:            'test/test_resources/non_existent.js',

    TEST_PRECOMPUTED_JS_BUFFER: {
        path: 'test.precomputed.hypothetical.js',
        buffer: new Buffer('var key = RESOURCE_KEY;')
    }
})).inline;

const source = fs.readFileSync('test/source.js').toString();

fs.writeFileSync('test/inlined.js', inline(source));
