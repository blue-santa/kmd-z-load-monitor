const path = require('path');
const express = require('express');
const app = express();
const router = express.Router();

const appConfig = require(path.join(__dirname + './config/main-config.js'));
const routeConfig = require(path.join(__dirname + './config/route-config.js'));

appConfig.init(app, express);
routeConfig.init(app);

module.exports = app;
