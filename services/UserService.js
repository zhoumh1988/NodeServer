const moment = require('moment');
const userDao = require('../dao/UserDao');
const DTO = require('../common/DataTransferObject');
const Pagination = require('../common/Pagination');
const { validate } = require('../plugins/Utils');
const User = require('../models/User');
const { validPagination } = validate;

/**
 * 校验参数
 * @param {Response} res 响应
 * @param {JSON} record 数据
 * @param {JSON} validators 额外校验规则
 */
const validateUser = (res, record, validators = {}) => {
    const valid = validate(record, Object.assign({
        account: [
            { mode: 'required', message: '账户名称不能为空' },
            { mode: 'type', target: 'string', message: "账户名称格式不正确" },
            { mode: 'len', target: [4, 20], message: "账户名称长度限制[4,20]" }
        ],
        email: [
            { mode: 'required', message: '邮箱不能为空' },
            { mode: 'match', target: /(.*)@(.*)/, message: "邮箱格式不正确" }
        ],
        password: [
            { mode: 'type', target: 'string', message: "密码格式不正确" },
        ]
    }, validators));
    if (valid !== true) {
        res.send(DTO.PARAMS_ERR);
        console.warn(valid);
        return false;
    } else {
        return true;
    }
}

class UserService {
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserService();
        }
        return this.instance;
    }

    async create(req, res) {
        const record = req.body;
        if (validateUser(res, record)) {
            const dto = new DTO();
            const { account, email, password } = record;
            const isExisted = await userDao.countByQuery({ account, status: 1 });
            if (isExisted !== 0) {
                dto.setCode(400);
                dto.setMsg(`账号${account}已存在`);
            } else {
                const result = await userDao.insert({
                    account,
                    email,
                    password
                });
                if (result.affectedRows > 0) {
                    dto.setData(new User({ id: result.insertId, account, email }));
                } else {
                    dto.setCode(400);
                    dto.setMsg(message || `创建账户失败`);
                }
            }
            res.send(dto);
        }
    }

    async update(req, res) {
        const record = req.body;
        if (validateUser(res, record, {
            id: [
                { mode: 'required', message: 'id不能为空' },
                { mode: 'type', target: 'number', message: "id格式不正确" },
                { mode: 'min', target: 1, message: "id格式不正确" }
            ]
        })) {
            const { account } = record;
            const isExisted = await userDao.countByQuery({ account, status: 1 });
            if (isExisted !== 0) {
                dto.setCode(400);
                dto.setMsg(`账号${account}已存在`);
            } else {
                const dto = new DTO();
                const toUpdate = new User(record).toSqlJson();
                const result = await userDao.updateByPrimaryKey(toUpdate);
                dto.setData(result.changedRows);
                res.send(dto);
            }
        }
    }

    async remove(req, res) {
        let { id } = req.params;
        id = parseInt(id);
        const valid = validate({ id }, {
            id: [
                { mode: 'required', message: 'id不能为空' },
                { mode: 'type', target: 'number', message: "id格式不正确" },
            ]
        })
        if (isNaN(id) || valid !== true) {
            res.send(DTO.PARAMS_ERR);
        } else {
            const result = await userDao.deleteByPrimaryKey(id, 'status', 0);
            const dto = new DTO(result.changedRows);
            res.send(dto);
        }
    }

    async modifyPassword(req, res) {
        const record = req.body;
        const session = req.session.user;
        const valid = validate(record, {
            oldPassword: [
                { mode: 'required', message: '密码不正确' },
                { mode: 'type', target: 'string', message: "密码不正确" },
            ],
            newPassword: [
                { mode: 'required', message: '请输入新密码' },
                { mode: 'type', target: 'string', message: "请输入新密码" },
            ]
        });
        const dto = new DTO();
        if (valid !== true) {
            dto.setCode(400);
            dto.setMsg(valid);
        } else {
            let result = await userDao.selectByPrimaryKey(session.id);
            if (!result || result.status === 0) {
                dto.setCode(400);
                dto.setMsg("用户不存在");
            } else {
                const user = new User(result);
                const { oldPassword, newPassword } = record;
                if (oldPassword !== user.get('password')) {
                    dto.setCode(400);
                    dto.setMsg("密码不正确");
                } else {
                    result = await userDao.updateByPrimaryKey({ id: user.id, password: newPassword });
                    dto.setData(result.changedRows);
                    dto.setMsg(result.changedRows > 0 ? '更新成功' : '更新失败');
                }
            }
        }
        res.send(dto);
    }

    async details(req, res) {
        let { id } = req.params;
        id = parseInt(id);
        const valid = validate({ id }, {
            id: [
                { mode: 'required', message: 'id不能为空' },
                { mode: 'type', target: 'number', message: "id格式不正确" },
            ]
        })
        if (isNaN(id) || valid !== true) {
            res.send(DTO.PARAMS_ERR);
        } else {
            const result = await userDao.selectByPrimaryKey(Number(id));
            if (result) {
                const dto = new DTO(new User(result));
                res.send(dto);
            } else {
                res.send(DTO.NOT_FOUND);
            }
        }
    }

    async page(req, res) {
        const { pageNo, pageSize, sortorder, sortdesc, ...query } = req.body;
        const pagination = new Pagination({ pageNo, pageSize, sortorder, sortdesc });
        if (validPagination(res, pagination)) {
            const dto = new DTO();
            const total = await userDao.countByQuery(query);
            if (total > 0) {
                const res = await userDao.pageByQuery(pagination, query);
                const list = res.map(it => new User(it));
                pagination.setList(list);
            }
            pagination.setTotal(total);
            dto.setData(pagination);
            res.send(dto);
        }
    }

    async login(req, res) {
        const dto = new DTO();
        const params = req.body;
        const rowData = await userDao.login(params);
        if (rowData.length === 0) {
            dto.setCode("400");
            dto.setMsg("用户不存在！");
            res.send(dto);
            return;
        } else {
            const user = rowData[0];
            if (user.password !== params.password) {
                dto.setCode("400");
                dto.setMsg("用户名/密码错误。");
                res.send(dto);
                return;
            }
            if (user.status === 0) {
                dto.setCode("400");
                dto.setMsg("账户已锁定。");
                res.send(dto);
                return;
            }
            user.last_login = moment().format('YYYY-MM-DD HH:mm:ss');
            const loginUser = new User(user);
            // 更新登录时间
            await userDao.updateByPrimaryKey({ id: user.id, last_login: user.last_login });
            req.session.user = loginUser;
            dto.setData(user);
            res.json(dto);
        }
    }
}

module.exports = UserService.getInstance();