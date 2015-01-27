/**
 * Module dependencies
 */

var Path = require('path');
var fsx = require('fs-extra');
var _ = require('lodash');




/**
 * sails-hook-dev hook
 *
 * Backend helpers that're only for development.
 *
 * This hook only runs when NODE_ENV is !== "production"
 *
 * @param  {App} sails
 * @return {Object}
 * @hook
 */

module.exports = function (sails) {
  return {

    // Run when sails loads-- be sure and call `next()`.
    // (before `config/boostrap.js`)
    initialize: function (done) {
      if (process.env.NODE_ENV==='production') {
        return done();
      }
      return done();
    },

    routes: {
      before: {
        // Show the available dev hook things
        'get /dev': function (req, res){
          if (process.env.NODE_ENV==='production') { return res.notFound(); }
          return res.send(''+
            '<h1>Runtime reference info</h1>'+'<br/>'+
            '<em>development only</em>'+'<br/>'+
            '<br/>'+'<br/>'+
            '<a href="/dev/routes">See all routes</a>'+'<br/>'+
            '<a href="/dev/session">See current user session</a>'+'<br/>'+
            '<a href="/dev/memory">See current memory usage</a>'+'<br/>'+
            '<a href="/dev/dependencies">See actual versions of node_module dependencies</a>'+'<br/>'+
          '');
        },

        // block access to the other shadow routes in below
        // (i.e. /dev/*)
        '/dev/*': function (req, res, next) {
          if (process.env.NODE_ENV==='production') {
            return res.notFound();
          }
          return next();
        },
        /////////////////////////////////////////////////////////////////////

        // In development, a quick convenience endpoint to view all routes
        'get /dev/routes': function (req, res) {
          return res.ok(sails.config.routes);
        },

        // In development, a quick convenience endpoint to view your session
        'get /dev/session': function (req, res) {
          return res.ok(req.session);
        },

        // Run garbage collector (but only if node was started up with the `--expose-gc` flag)
        'put /dev/gc': function(req, res) {
          if (!process.gc) {
            return res.send('gc() not exposed.  Try lifting your app with the --expose-gc flag enabled next time.');
          }
          var before = process.memoryUsage();
          global.gc();
          var after = process.memoryUsage();
          var diff = {
            rss: before.rss - after.rss,
            heapTotal: before.heapTotal - after.heapTotal,
            heapUsed: before.heapUsed - after.heapUsed
          };
          return res.json({Before: before, After: after, Diff: diff});
        },

        // Get current memory usage
        'get /dev/memory': function(req, res) {
          return res.json(process.memoryUsage());
        },

        // Get actual version of dependencies in the node_modules folder
        'get /dev/dependencies': function (req, res) {
          var dependencies = fsx.readJsonSync(path.resolve(sails.config.appPath, 'package.json')).dependencies;
          return res.json(_.reduce(dependencies, function (memo, semverRange, depName){
            var actualDependencyVersion = fsx.readJsonSync(path.resolve(sails.config.appPath, depName)).version;
            memo[depName] = actualDependencyVersion;
            return memo;
          }, {}));

        }
      }
    }

  };
};

