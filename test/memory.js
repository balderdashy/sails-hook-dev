var assert = require('assert');
var formatBytes = require('../private/format-bytes');
var formatMemory = require('../private/format-memory-usage-dictionary');
var makeHook = require('../');

// Golden outputs from pretty-bytes 1.0.4, including its decimal units and rounding.
var cases = [
  [0, '0 B'], [-0, '0 B'], [0.5, '0.5 B'], [-0.5, '-0.5 B'],
  [1, '1 B'], [1.234, '1.23 B'], [-1.234, '-1.23 B'],
  [999, '999 B'], [999.999, '1000 B'], [1000, '1 kB'],
  [1001, '1 kB'], [1337, '1.34 kB'], [-1337, '-1.34 kB'],
  [999999, '1000 kB'], [1000000, '1 MB'], [1234567890, '1.23 GB'],
  [1e12, '1 TB'], [1e15, '1 PB'], [1e18, '1 EB'],
  [1e21, '1 ZB'], [1e24, '1 YB'], [1e27, '1000 YB'],
  [Infinity, 'Infinity YB'], [-Infinity, '-Infinity YB']
];
cases.forEach(function (item) {
  assert.strictEqual(formatBytes(item[0]), item[1]);
});
[undefined, null, false, '1337', {}, [], NaN].forEach(function (value) {
  assert.throws(function () { formatBytes(value); }, function (err) {
    return err instanceof TypeError && err.message === 'Expected a number';
  });
});

var raw = {rss: 1337, heapTotal: 1000000, heapUsed: 999, external: 17, arrayBuffers: 9};
var expected = {
  residentSetSize: '1337 B (1.34 kB)',
  heapTotal: '1000000 B (1 MB)', heapUsed: '999 B (999 B)',
  external: 17, arrayBuffers: 9
};
var dictionary = Object.assign({}, raw);
assert.strictEqual(formatMemory(dictionary), dictionary);
assert.deepEqual(dictionary, expected);
assert.throws(function () { formatMemory({rss: '1337'}); }, function (err) {
  return err instanceof TypeError && err.message === 'Expected a number';
});

var sails = {config: {dev: {enableInProduction: false}}};
var hook = makeHook(sails);
assert.strictEqual(hook.defaults.dev.enableInProduction, false);
var route = hook.routes.before['get /dev/memory'];
var previousEnv = process.env.NODE_ENV;
var originalMemoryUsage = process.memoryUsage;
var calls = 0;
var jsonCalls = 0;
var notFoundCalls = 0;
process.memoryUsage = function () {
  calls++;
  return Object.assign({}, raw);
};
var response = {
  json: function (body) { jsonCalls++; assert.deepEqual(body, expected); return 'json'; },
  notFound: function () { notFoundCalls++; return 'not found'; }
};
try {
  process.env.NODE_ENV = 'development';
  assert.strictEqual(route({}, response), 'json');
  assert.strictEqual(calls, 1);
  process.env.NODE_ENV = 'production';
  assert.strictEqual(route({}, response), 'not found');
  assert.strictEqual(calls, 1, 'production guard must run before reading memory');
  assert.strictEqual(jsonCalls, 1);
  assert.strictEqual(notFoundCalls, 1);
  sails.config.dev.enableInProduction = true;
  assert.strictEqual(route({}, response), 'json');
  assert.strictEqual(calls, 2);
} finally {
  process.memoryUsage = originalMemoryUsage;
  if (previousEnv === undefined) { delete process.env.NODE_ENV; }
  else { process.env.NODE_ENV = previousEnv; }
}

console.log('Formatter outputs/errors, memory dictionary and /dev/memory production guard passed.');
