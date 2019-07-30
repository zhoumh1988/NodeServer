const parseurl = require('parseurl');
const DTO = require('../common/DataTransferObject');
const { isEmpty } = require('../plugins/Utils');

/**
 * 封装get请求参数
 */
const handleQuery = (req, query) => {
    if (typeof query == 'string' && query.length != 0 && query !== '?') {
        let body = req.body || {};
        query = query.indexOf('?') == -1 ? query : query.substring(1);
        query.split('&').forEach(it => {
            let p = it.split('=');
            body[p[0]] = p[1] || null;
        });
        req.body = body;
    }
}

const interceptors = {
    /* 排除 */
    excludes: [
        '/api/login',
        '/api/logout',
    ]
}
const SessionInterceptor = (req, res, next) => {
    const request = parseurl(req);
    console.info(`[${req.method}]请求接口：${request.pathname}`);
    req.session.lastPage = request.pathname;
    if (interceptors.excludes.indexOf(request.pathname) === -1 && isEmpty(req.session.user)) {
        // 未登录判断
        if(request.pathname.startsWith('/api')) {
            res.json(DTO.NOT_LOGIN_ERR);
        } else {
            res.redirect("/")
        }
    } else {
        // 刷新session过期时间
        req.session._garbage = Date();
        req.session.touch();
        // 统一封装请求参数
        if (req.method === 'GET') {
            handleQuery(req, request.query);
        }
        next();
    }
}

module.exports = SessionInterceptor;