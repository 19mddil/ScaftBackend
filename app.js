require('express-async-errors');
const error = require("./middlewares/errors");
const express = require('express');
const app = express();

require('./middlewares')(app);
require('./middlewares/routes')(app);

app.use(error);

module.exports = app;