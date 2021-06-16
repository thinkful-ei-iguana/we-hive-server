require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { NODE_ENV } = require('./config');

const authRouter = require('./auth/auth-router');
const actsRouter = require('./activity/acts-router');
const hivesRouter = require('./hives/hives-router');
const usersRouter = require('./users/users-router');

const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/hives', hivesRouter);
app.use('/api/activity', actsRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error, please fix environment' } };
  } else {
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
