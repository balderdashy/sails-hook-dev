/**
 * Module dependencies
 */

// N/A



/**
 * allocForNoReason()
 *
 * Waste a bunch of memory by building up a huge dictionary.
 * Then return the result: an enormous sack of filth, along
 * with a diff describing the change in this process's memory
 * usage.
 *
 * @param  {Number} smallerNumber
 * @param  {Number} biggerNumber
 *
 * @return {Dictionary}
 *         @property {Dictionary} data   [the huge, wasteful dictionary]
 *         @property {Dictionary} memoryDiff   [the memory usage diff]
 *             @property {Number} rss
 *             @property {Number} heapTotal
 *             @property {Number} heapUsed
 */

module.exports = function allocForNoReason(smallerNumber, biggerNumber) {

  // Track memory usage before we start deliberately wasting it.
  var before = process.memoryUsage();


  // Now build a big variable that wastes tons of memory.
  var bigWasteOfMemory = {};
  var randX;
  var randY;
  var randZ;
  for (i=0; i<biggerNumber; i++) {
    randX = Math.floor(Math.random()*biggerNumber);
    bigWasteOfMemory[randX] = [{},{},{}].concat(_.range(smallerNumber));

    for (j=0; i<biggerNumber; i++) {
      randY = Math.floor(Math.random()*biggerNumber);
      bigWasteOfMemory[randX][randY] = [{},{},{}].concat(_.range(smallerNumber));

      for (k=0; i<biggerNumber; i++) {
        randZ = Math.floor(Math.random()*biggerNumber);
        bigWasteOfMemory[randX][randY][randZ] = [{},{},{}].concat(_.range(smallerNumber));
      }
    }
  }

  // Track memory usage AFTER building that huge thing.
  var after = process.memoryUsage();


  // Compute diff of memory usage.
  var diff = {
    rss: after.rss - before.rss,
    heapTotal: after.heapTotal - before.heapTotal,
    heapUsed: after.heapUsed - before.heapUsed
  };

  // Send back our big wasteful object, along with our diff.
  return {
    data: bigWasteOfMemory,
    memoryDiff: diff
  };

};
