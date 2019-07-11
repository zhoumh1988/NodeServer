# NodeServer服务

## 依赖

Express + PM2 + Mysql + Redis

## 项目介绍

1. 实现基础的Dao层，增删改查方法。[BaseDao](./common/BaseDao.js)
2. 实现路由自动注入的功能。[Routers](~/routers/index.js)
3. 响应dto的封装。[DataTransferObject](./common/DataTransferObject.js)
4. 分页的封装。[Pagination](./common/Pagination.js)
5. 实现validate校验工具。[Utils](./plugins/Utils.js)
6. 数据库连接的封装。[DB](./plugins/DB.js)
7. 实现Redis的封装。LRedis (TODO)
8. 实现Model的基础封装。[Base](./common/Base.js)

## 目录结构

```
.
├── _bin
├── └── www                     // 主进程入口
├── _common                     // 基础类
├── └── Base.js                 // 模型基础类
├── └── BaseDao.js              // Dao基础类
├── └── DataTransferObject.js   // 响应数据封装类
├── └── Pagination.js           // 分页数据封装类
├── └── SessionInterceptor.js   // Session登录拦截器
├── _dao                        // 数据库交互类
├── _logs                       // 日志
├── _models                     // 模型类
├── _plugins                    // 工具
├── └── DB.js                   // mysql数据库封装
├── └── Utils.js                // 工具类
├── _routes                     // 路由层
├── └── index.js                // 自动注入路由配置
├── _services                   // 服务层
├── .gitignore                  // git忽略
├── app.js                      // app
├── config.js                   // 服务配置
├── ecosystem.config.js         // pm2配置
├── package.json                // Node依赖
└── README.md                   // 项目介绍
```

## 启动项目
```ssh
npm install

npm run pm2
```