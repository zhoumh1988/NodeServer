const path = require('path');
const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SessionInterceptor = require('./common/SessionInterceptor')
const DTO = require('./common/DataTransferObject');
const routers = require('./routers');
const parseurl = require('parseurl');
const log4js = require('log4js');

const app = express();

const log = log4js.getLogger("app");

app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
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
 * 静态资源
 */
app.use(express.static(path.join(__dirname, 'html')))
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
  const request = parseurl(req);
  if (request.pathname.startsWith('/api')) {
    next(createError(404));
  } else {
    res.sendFile(path.join(__dirname, "html/index.html"));
  }
});

// error handler
app.use(function (err, req, res, next) {
  log.error("Something went wrong:", err);
  const dto = new DTO();
  dto.setCode(err.status);
  dto.setMsg(err.message);
  res.status(err.status || 500);
  res.json(dto);
});

console.info("服务已启动");

module.exports = app;
