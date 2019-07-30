const mysql = require('mysql');
const config = require('../config');
const pool = mysql.createPool(config.mysql);
const format = mysql.format;

/**
 * 连接池拿连接查询
 * @param {String} sql 执行的sql语句
 * @return {Promise} pro
 */
const _pool_connection = sql => {
  console.info(sql);
  return new Promise(resolve => {
    pool.getConnection((conn_err, connection) => {
      if (conn_err) {
        console.error(`${sql}\n${conn_err}`);
      } else {
        connection.query(sql, function (error, res, fields) {
          try {
            if (error) {
              console.error(`${sql}\n${error}`);
              resolve(false);
            } else {
              res = JSON.stringify(res);
              res = JSON.parse(res);
              resolve(res ? res : {}, ...arguments);
            }
          } catch (e) {
            console.error(e.message);
          } finally {
            connection.release();
          }
        });
      }
    });
  });
};

/**
 * 异步执行
 * @param {String} sql 执行的sql语句
 * @param {Array} params 查询参数
 */
const executeSync = async (sql, params) => {
  if (params) {
    sql = format(sql, params);
  }
  return await _pool_connection(sql);
};

/**
 * 同步执行
 * @param {String} sql 执行的sql语句
 * @param {Array} params 查询参数
 */
const execute = (sql, params) => {
  if (params) {
    sql = format(sql, params);
  }
  return _pool_connection(sql);
}

process.on('SIGINT', () => {
  pool.end(function (err) {
    if (err) {
      console.error(err);
    }
    console.info('已关闭所有数据库连接');
  });
});

module.exports = {
  execute,
  executeSync,
  format,
};