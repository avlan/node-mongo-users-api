const methodOverride = require("method-override");
const expressWinston = require("express-winston");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const winston = require("winston");
const logger = require("morgan");
const cors = require("cors");

const middlewares = require("./helpers/middlewares");
const config = require("./config");
const routes = require("./routes");

const app = express();

const winstonInstance = winston.createLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
  ],
});

if (config.env === "development") {
  app.use(logger("dev"));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride());
app.use(cors());

if (config.env === "development") {
  expressWinston.requestWhitelist.push("body");
  expressWinston.responseWhitelist.push("body");
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true,
      msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
      colorStatus: true,
    })
  );
}

app.use(config.basePath, routes);

app.use(middlewares.convertToApiError);
app.use(middlewares.notFound);
if (config.env !== "test") {
  app.use(
    expressWinston.errorLogger({
      winstonInstance,
    })
  );
}
app.use(middlewares.addTrace);

const querystring = `${config.mongo.host}${config.mongo.name}`;

mongoose.connect(querystring);

if (!module.parent) {
  app.listen(config.port, () => {
    console.info(`API started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

module.exports = app;
