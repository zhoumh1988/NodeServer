const fs = require('fs');

/**
 * 自动注入路由
 */
module.exports = app => {
  const dir = fs.readdirSync(__dirname);
  dir.forEach(ele => {
    if (ele !== 'index.js') {
      const routerName = ele.split('.')[0];
      const router = require(`./${routerName}`);
      app.use(`/api/${routerName}`, router);
    }
  });
}
