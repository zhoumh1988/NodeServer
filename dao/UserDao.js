const { execute } = require('../plugins/DB');
const BaseDao = require('../common/BaseDao');

class UserDao extends BaseDao {

    constructor() {
        super('user', 'id, account, email, last_login, status, updated, created');
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new UserDao();
        }
        return this.instance;
    }

    async login(user) {
        const params = [user.account, user.account];
        return execute(`SELECT id, account, email, password, last_login AS lastLogin, status FROM user WHERE account = ? OR email = ?`, params);
    }
}

module.exports = UserDao.getInstance();