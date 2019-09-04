/** 
 * mysql数据库配置 
 */
const mysql = {
    connectionLimit: 20,        // 最大连接数
    host: '192.168.10.195',          // 数据库地址
    // host: 'localhost',          // 数据库地址
    port: 3306,                 // 数据库端口
    user: 'mysql',              // 用户名
    password: 'MhxzKhl',        // 密码
    database: 'pulsar',         // 数据库名称
    charset: 'utf8mb4'          // 编码级
};

const redisConfig = {
    host: '127.0.0.1',
    port: 6379
}

module.exports = {
    mysql,
    redisConfig
};