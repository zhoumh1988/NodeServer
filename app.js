const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const SessionInterceptor = require('./common/SessionInterceptor')
const DTO = require('./common/DataTransferObject');
const routers = require('./routers');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'SERVER',
  name: 'SERVER_LOGINID',
  cookie: {
    maxAge: 30 * 60 * 1000 // session过期时间为30分钟
  },
  resave: false,
  saveUninitialized: true
}));
/**
 * session拦截器
 */
app.use(SessionInterceptor);

/**
 * 请求参数转换成json
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * 自动注入路由
 */
routers(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  const dto = new DTO();
  dto.setCode(err.status);
  dto.setMsg(err.message);
  res.status(err.status || 500);
  res.json(dto);
});

module.exports = app;
