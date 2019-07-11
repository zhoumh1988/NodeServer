const Base = require('../common/Base');
const { isNotEmpty, formatDate, toLowerLine } = require('../plugins/Utils')

class User extends Base {
    constructor(props) {
        super(props);
        let { id, account, email, last_login: lastLogin, status, created, updated } = props;
        const copy = {
            account,
            email
        };
        if (isNotEmpty(id) && !isNaN(id)) {
            copy['id'] = Number(id);
        }
        if (isNotEmpty(lastLogin)) {
            copy['lastLogin'] = formatDate(lastLogin);
        }
        if (isNotEmpty(status) && !isNaN(status)) {
            copy['status'] = Number(status);
        }
        if (isNotEmpty(created)) {
            copy['created'] = formatDate(created);
        }
        if (isNotEmpty(updated)) {
            copy['updated'] = formatDate(updated);
        }
        Object.assign(this, copy);
    }

    toSqlJson() {
        return super.toSqlJson(['id', 'account', 'email', 'lastLogin', 'status']);
    }
}

module.exports = User;