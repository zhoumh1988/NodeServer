const express = require('express');
const router = express.Router();
const { DataTransferObject: DTO, Pagination } = require('../plugins');

/* GET users listing. */
router.get('/', function (req, res, next) {
  const dto = new DTO();
  dto.setCode(500);
  dto.setMsg("错了");
  res.send(dto);
});

/* GET users listing. */
router.get('/list', function (req, res, next) {
  const dto = new DTO();
  dto.setData([{ id: 1, name: '1' }]);
  res.send(dto);
});

/**
 * 分页接口
 */
router.post('/page', (req, res, next) => {
  const { pageno, pagesize } = req.params;
  const page = new Pagination();
  const dto = new DTO(page);
  res.send(dto);
});

/**
 * path params 请求方式
 */
router.get('/get/:id', (req, res, nect) => {
  const { id } = req.params;
  const dto = new DTO(Number(id));
  res.send(dto);
});

module.exports = router;
