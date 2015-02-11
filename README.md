#sails-hook-dev


The diagnostic routes exposed by this hook will work when your app is in development mode (i.e. `NODE_ENV` != "production")

### Install

In your Sails project:

```
npm install sails-hook-dev --save
```




### Use

##### See all available routes
[http://localhost:1337/dev/routes](http://localhost:1337/dev/routes)

##### See session of currently logged-in user
[http://localhost:1337/dev/session](http://localhost:1337/dev/session)

##### See actual versions of dependencies in `node_modules`
[http://localhost:1337/dev/dependencies](http://localhost:1337/dev/dependencies)

##### See current memory usage
[http://localhost:1337/dev/memory](http://localhost:1337/dev/memory)
