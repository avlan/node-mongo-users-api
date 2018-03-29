# Users API

## Description

Simple RESTful API to `get/create/update/delete` users from a persistence database. 

### Tech stack

- Node.js and Express.
- MongoDB.


### User Model

```
{
  "_id": "xxx",                  // user ID (ObjectID provided by database, unique)
  "name": "test",               // user name
  "username": "test",           // username for managing authentication
  "name": "test",               // user's name
  "dateOfBirth": "",            // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": ""               // user created date
  "updatedAt": ""               // user updated date
}
```

### Documentation and deployment
[Swagger](https://swagger.io/) is used for documenting endpoints. This documentatation can be found at `/docs` of the base path (e.g. `http://localhost:3000/docs`). This API uses and requires a few env variables (that can be stored in a `.env` file) listed bellow:
- `NODE_ENV`: (*default: development*) this is the usual environment variable, this API is thought to use 3; `development`, `production` and `test`
- `BASE_PATH`: (*default: /*) this is the main route for the API, it should end always with `/`
- `PORT`: (*default: 3000*) port in which the API would run
- `MONGO_HOST`: (*REQUIRED*) MongoDB host url
- `MONGO_DB_NAME`: (*default: default, REQUIERED when using docker*) Database name

For deploying this project just `npm install` and `npm start` with the required env variables, it is adviced to store them in a `.env` file for simplicity.

### Unit tests
A BDD approach is used in order for creating tests, [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/) help with that. Just `npm run test`, usually done with a different database in order to avoid any inconsistencies with the data.

### Logging strategy
When env is set to development this API (with the help of [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)) logs everything happening in the request, from the method used to the status code, body, headers and even response time.