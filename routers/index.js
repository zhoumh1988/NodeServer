const fs = require('fs');
const UserService = require('../services/UserService');
const CompanyService = require('../services/CompanyService');
const { isEmpty } = require('jsmicro-is-empty');
const DataTransferObject = require('../common/DataTransferObject');

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

  /**
   * 登录
   */
  app.post('/api/login', function (req, res, next) {
    const params = req.body;
    if (isEmpty(params) || isEmpty(params.account) || isEmpty(params.password)) {
      const dto = new DataTransferObject();
      dto.setCode(400);
      dto.setMsg("请输入登录名和密码。");
      res.send(dto);
      return;
    }
    UserService.login(req, res, next);
  });

  /**
   * 登出
   */
  app.get('/api/logout', (req, res, next) => {
    req.session.user = null;
    res.send(new DataTransferObject());
  })
}
