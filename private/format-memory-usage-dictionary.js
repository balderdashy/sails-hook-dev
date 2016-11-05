/**
 * Module dependencies
 */

var prettyBytes = require('pretty-bytes');


/**
 * formatMemoryUsageDictionary()
 *
 * Prettify the provided memory usage dictionary.
 *
 *
 * @param  {Dictionary} memoryUsage
 *         @property {String} rss
 *         @property {String} heapTotal
 *         @property {String} heapUsed
 *
 * @return {Dictionary}
 *         @property {String} residentSetSize
 *         @property {String} heapTotal
 *         @property {String} heapUsed
 *
 */
module.exports = function formatMemoryUsageDictionary(memoryUsage) {
  memoryUsage.residentSetSize = memoryUsage.rss + ' B (' + prettyBytes(memoryUsage.rss) + ')';
  delete memoryUsage.rss;
  memoryUsage.heapTotal = memoryUsage.heapTotal + ' B (' + prettyBytes(memoryUsage.heapTotal) + ')';
  memoryUsage.heapUsed = memoryUsage.heapUsed + ' B (' + prettyBytes(memoryUsage.heapUsed) + ')';
  return memoryUsage;
};
