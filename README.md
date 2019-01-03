# Tag My Doc

> Before I meet TMD, managing my documents was a nightmare. Today thanks to TMD, I feel joy in my heart and peace in my soul. TMD saved my life
> 
> *(anonymous)*

## Quick Start

Get started developing...

```shell
# install deps
npm install

# run in development mode
npm run dev

# run tests
npm run test
```

`.env`file :
```
APP_ID=api-ts
PORT=3000
LOG_LEVEL=debug
REQUEST_LIMIT=100kb
SESSION_SECRET=mySecret

#Swagger
SWAGGER_API_SPEC=/spec
```

---

## Install Dependencies

Install all package dependencies (one time operation)

```shell
npm install
```

## Run It
#### Run in *development* mode:
Runs the application is development mode. Should not be used in production

```shell
npm run dev
```

or debug it

```shell
npm run dev:debug
```

#### Run in *production* mode:

Compiles the application and starts it in production production mode.

```shell
npm run compile
npm start
```

## Test It

Run the Mocha unit tests

```shell
npm test
```

or debug them

```shell
npm run test:debug
```

## Try It
* Open you're browser to [http://localhost:3000](http://localhost:3000)
* Invoke the `/examples` endpoint 
  ```shell
  curl http://localhost:3000/api/v1/examples
  ```


## Debug It

#### Debug the server:

```
npm run dev:debug
```

#### Debug Tests

```
npm run test:debug
```

#### Debug with VSCode

Add these [contents](https://github.com/cdimascio/generator-express-no-stress/blob/next/assets/.vscode/launch.json) to your `.vscode/launch.json` file

# References

- [Project Generator : generator-express-no-stress-typescript](https://github.com/cdimascio/generator-express-no-stress-typescript)
- [OAS 2.0](https://swagger.io/specification/v2/)
  - [File Upload](https://swagger.io/docs/specification/2-0/file-upload/)
- [swagger-express-middleware](https://www.npmjs.com/package/swagger-express-middleware/v/2.0.0)
