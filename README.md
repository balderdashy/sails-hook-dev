# sails-hook-dev

A Sails hook that provides diagnostic / debugging information during development.

Check the memory usage or environent variables of the currently-running Sails/Node.js process. Or check how it's configured, or the installed versions of its dependencies. You can also fetch session data for the currently logged in user, or force Node's garbage collector to run.


> ###### Note
>
> The diagnostic routes exposed by this hook will work when your app is in development mode (i.e. `NODE_ENV` !== "production")
>
> For security reasons, this hook should _never_ be used in production.


## Install

In your Sails project:

```
npm install sails-hook-dev --save-dev
```

## Usage

To see all available development routes, visit [http://localhost:1337/dev](http://localhost:1337/dev):

![screenshot of what the dev page looks like](https://cloud.githubusercontent.com/assets/618009/20028928/8ddac788-a30c-11e6-9ebf-44a12f71e0c4.png)

##### See all available routes
[http://localhost:1337/dev/routes](http://localhost:1337/dev/routes)

##### See session of currently logged-in user
[http://localhost:1337/dev/session](http://localhost:1337/dev/session)

##### See actual versions of dependencies in `node_modules`
[http://localhost:1337/dev/dependencies](http://localhost:1337/dev/dependencies)

##### See current memory usage
[http://localhost:1337/dev/memory](http://localhost:1337/dev/memory)


#### Debugging

##### Deliberately crash the process
[http://localhost:1337/dev/throw-uncaught](http://localhost:1337/dev/throw-uncaught)

##### Simulate endpoint that never sends a response
[http://localhost:1337/dev/dont-respond](http://localhost:1337/dev/dont-respond)

##### Simulate locking up the process by overwhelming its CPU
[http://localhost:1337/dev/peg](http://localhost:1337/dev/peg)

##### Simulate runaway recursion that overflows the call stack
[http://localhost:1337/dev/overflow-stack](http://localhost:1337/dev/overflow-stack)

##### Simulate exceeding the process's available memory
[http://localhost:1337/dev/overflow-memory](http://localhost:1337/dev/overflow-memory)

##### Simulate an endpoint that consumes memory, but does not leak
[http://localhost:1337/dev/consume-memory](http://localhost:1337/dev/consume-memory)

##### Simulate an endpoint with an **actual memory leak**
[http://localhost:1337/dev/leak-memory](http://localhost:1337/dev/leak-memory)

##### Run the garbage collector
[http://localhost:1337/dev/gc](http://localhost:1337/dev/gc)

> Note that you must lift your app with `node --expose-gc app.js` in order for the garbage collector to be accessible from userland.


## Help

If you have further questions or are having trouble, click [here](http://sailsjs.com/support).


## Bugs &nbsp; [![NPM version](https://badge.fury.io/js/sails-hook-dev.svg)](http://npmjs.com/package/sails-hook-dev)

To report a bug, [click here](http://sailsjs.com/bugs).


## Contributing

Please observe the guidelines and conventions laid out in the [Sails project contribution guide](http://sailsjs.com/contribute) when opening issues or submitting pull requests.

[![NPM info](https://nodei.co/npm/sails-hook-dev.png?downloads=true)](http://npmjs.com/package/sails-hook-dev)

## License

MIT &copy; 2015, 2016 Mike McNeil

_As for the [Sails framework](http://sailsjs.com), it's free and open-source under the [MIT License](http://sailsjs.com/license) too._
