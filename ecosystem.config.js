module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      "name": "server", // 服务名称
      "cwd": "./",
      "script": "bin/www",// 启动脚本
      "error_file": "./logs/app-err.log",// 错误日志输出文件
      "out_file": "./logs/app-out.log",// 日志输出文件
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z",// 日志时间格式
      "pid_file": "./pids/node-geo-api.pid",// 进程id存储
      "min_uptime": "200s",// 重启最大时间200s
      "max_restarts": 10,// 重启最大次数10次
      "max_memory_restart": "1G",// 服务最大缓存150M
      "cron_restart": "0 3 * * * *",// 每天3点重启服务，解决需要重启才能恢复的问题。
      "watch": [ // 动态监听服务变化重启项目
        "bin",
        "common",
        "dao",
        "plugins",
        "routers",
        "services",
      ],
      "ignore_watch": [ // 忽略目录变化导致重启项目
        "node_modules",
        "logs",
        "pids",
      ],
      "merge_logs": true,
      "exec_interpreter": "node",
      "exec_mode": "cluster",
      "autorestart": false,
      "vizion": false,
      "env": {
        COMMON_VARIABLE: 'true',
        PORT: 3000 // 服务端口号
      },
    }
  ]
};
