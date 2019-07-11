const express = require('express');
const router = express.Router();
const userService = require('../services/UserService');

/**
 * 用户管理分页接口
 */
router.post('/page', (req, res, next) => {
  userService.page(req, res, next);
});

/**
 * 获取用户信息
 */
router.get('/get/:id', (req, res, next) => {
  userService.details(req, res, next);
});

/**
 * 创建用户
 */
router.post('/create', (req, res, next) => {
  userService.create(req, res, next);
});

/**
 * 创建用户
 */
router.post('/update', (req, res, next) => {
  userService.update(req, res, next);
});

/**
 * 创建用户
 */
router.post('/modifyPwd', (req, res, next) => {
  userService.modifyPassword(req, res, next);
});

router.get('/remove/:id', (req, res, next) => {
  userService.remove(req, res, next);
})

module.exports = router;
