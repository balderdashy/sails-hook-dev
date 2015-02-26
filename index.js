/**
 * Module dependencies
 */

var path = require('path');
var fsx = require('fs-extra');
var isObject = require('lodash/lang/isObject');
var reduce = require('lodash/collection/reduce');
var prettyBytes = require('pretty-bytes')


function prettifyObject(memoryUsage) {
  memoryUsage.residentSetSize = memoryUsage.rss + ' B (' + prettyBytes(memoryUsage.rss) + ')';
  delete memoryUsage.rss;
  memoryUsage.heapTotal = memoryUsage.heapTotal + ' B (' + prettyBytes(memoryUsage.heapTotal) + ')';
  memoryUsage.heapUsed = memoryUsage.heapUsed + ' B (' + prettyBytes(memoryUsage.heapUsed) + ')';
  return memoryUsage;
};


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
      return done();
    },

    defaults:{
      dev: {
        // If set, `enabled` will force the secret page for this hook to be live, even in production.
        // Warning: Do not set this to true if this is **ACTUAL** production!  It can reveals system information
        // that may make your app vulnerable to attacks or give away sensitive user information.
        enabled: false,

        requestLogger: {
          // If set, `logRequests` will log the beginning of every reqeust  (even in production!)
          // If set to 'never', it will not log regardless of the environment
          onBegin: false,
          // If set, `logRequests` will log the end of every reqeust (even in production!)
          // If set to 'never', it will not log regardless of the environment
          onEnd: true
        }
      }
    },

    routes: {
      before: {

        // Log every request
        // set `sails.config.dev.requestLogger.onEnd` and/or `sails.config.dev.requestLogger.onBegin` to true
        // for default captains logging (in verbose mode) or set them to functions to implement your own custom
        // logger.  If a function is provided, it will be treated as a machine with no exits- like:
        //
        // function myCustomLogger(inputs, unused, env){
        //   // => env.req;
        //   // => env.res;
        //   // => env.req._sails;
        //
        //   // => inputs.method
        //   // => inputs.path
        //   // => inputs.responseTime  (this one is only available onEnd)
        //}
        '/*': function (req, res, next) {
          // Skip in production, unless logger onBegin is forcibly enabled
          if (!isObject(sails.config.dev) || !isObject(sails.config.dev.requestLogger)) {
            sails.config.dev.requestLogger = {
              onBegin: false,
              onBeginDev: true,
              onEnd: true,
              onEndDev: true
            }
          }

          if ((process.env.NODE_ENV !== 'production' && sails.config.dev.requestLogger.onBegin !== 'never') ||
            sails.config.dev.requestLogger.onBegin !== 'never') {
            // Custom logger
              if (_.isFunction(sails.config.dev.requestLogger.onBegin)) {
                sails.config.dev.requestLogger.onBegin({
                  path: req.path,
                  method: req.method
                }, undefined, {
                  req: req,
                  res: res
                });
              }
              // Default logger
              else {
                sails.log.verbose(' -> '+req.method.toUpperCase()+' '+req.path+'');
              }
          }

          // Skip in production, unless logger onEnd is forcibly enabled
          if ((process.env.NODE_ENV !== 'production' && sails.config.dev.requestLogger.onBegin !== 'never') ||
            sails.config.dev.requestLogger.onEnd !== 'never') {
            // When the request is finished...
            res.once('finish', function () {

              var metadata = {
                method: req.method,
                path: req.path,
                responseTime: _getMilisecondsElapsedSince( req._startTime )
              };

              // Custom logger
              if (_.isFunction(sails.config.dev.requestLogger.onEnd)) {
                sails.config.dev.requesetLogger.onEnd(metadata, undefined, {
                  req: req,
                  res: res
                });
              }
              // Default logger
              else {
                if (typeof res._headers['content-length'] === 'undefined') {
                  res._headers['content-length'] = 0;
                }

                var color = 32; // green
                var status = res.statusCode;

                if (status >= 500) color = 31; // red
                else if (status >= 400) color = 33; // yellow
                else if (status >= 300) color = 36; // cyan

                sails.log.verbose(' -> '+metadata.method.toUpperCase()+' '+metadata.path+ ' \x1b[' +color+ 'm' +res.statusCode+ '\x1b[0m   ( -> '+metadata.responseTime+'ms, '+prettyBytes(parseInt(res._headers['content-length'], 10))+')');
              }
            });
          }


          // Onwards to our app code!
          next();
        },

        // Show the available dev hook things
        'get /dev': function (req, res){
          if (process.env.NODE_ENV === 'production' && (!isObject(sails.config.dev) || !sails.config.dev.enabled)) {
            return res.notFound();
          }
          return res.send(''+
            ''+
            '<a href="http://sailsjs.org" target="_blank"><img width="300" src="data:image/png;base64,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" alt="Sails logo" title="Sails"/></a>'+
            '<br/>'+
            '<h1>Runtime reference info</h1>'+'<br/>'+
            '<em>development only</em>'+'<br/>'+
            '<br/>'+'<br/>'+
            '<a href="/dev/routes">See all routes</a>'+'<br/>'+
            '<a href="/dev/session">See current user session</a>'+'<br/>'+
            '<a href="/dev/memory">See current memory usage</a>'+'<br/>'+
            '<a href="/dev/dependencies">See actual versions of node_module dependencies</a>'+'<br/>'+
            '<a href="/dev/config">See whole Sails configuration</a>'+'<br/>'+
            '<a href="/dev/env">See loaded Evnironment variables</a>'+'<br/>'+
          '');
        },

        // block access to the other shadow routes in below
        // (i.e. /dev/*)
        '/dev/*': function (req, res, next) {
          if (process.env.NODE_ENV==='production' && (!isObject(sails.config.dev) || !sails.config.dev.enabled)) {
            return res.notFound();
          }
          return next();
        },
        /////////////////////////////////////////////////////////////////////

        // In development, a quick convenience endpoint to view all routes
        'get /dev/routes': function (req, res) {
          return res.json(sails.config.routes);
        },

        // In development, a quick convenience endpoint to view your session
        'get /dev/session': function (req, res) {
          return res.json(req.session);
        },

        // Run garbage collector (but only if node was started up with the `--expose-gc` flag)
        'put /dev/gc': function(req, res) {
          if (!global.gc) {
            return res.send('gc() not exposed.  Try lifting your app via \'node --expose-gc app.js\'.');
          }
          var before = process.memoryUsage();
          global.gc();
          var after = process.memoryUsage();
          var diff = {
            rss: before.rss - after.rss,
            heapTotal: before.heapTotal - after.heapTotal,
            heapUsed: before.heapUsed - after.heapUsed
          };
          return res.json({ Before: prettifyObject(before), After: prettifyObject(after), Diff: prettifyObject(diff) });
        },

        // Get enviroment variables
        'get /dev/env': function(req, res) {
          return res.json(process.env);
        },

        // Get sails.config
        'get /dev/config': function(req, res) {
          return res.json(req._sails.config);
        },

        // Get current memory usage
        'get /dev/memory': function(req, res) {
          return res.json(prettifyObject(process.memoryUsage()));
        },

        // Get actual version of dependencies in the node_modules folder
        'get /dev/dependencies': function (req, res) {
          var dependencies = fsx.readJsonSync(path.resolve(sails.config.appPath, 'package.json')).dependencies;
          return res.json(reduce(dependencies, function (memo, semverRange, depName){
            var actualDependencyVersion = fsx.readJsonSync(path.resolve(sails.config.appPath, path.join('node_modules',depName,'package.json'))).version;
            memo[depName] = actualDependencyVersion;
            return memo;
          }, {}));

        }
      }
    }

  };

};




function _getMilisecondsElapsedSince (startTime) {
  return new Date() - startTime;
}
