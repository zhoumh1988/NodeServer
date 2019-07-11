const { toCamel, toLowerLine, isNotEmpty } = require('../plugins/Utils')
class Base {
    constructor(props) {
        Object.keys(props).map(key => this[toCamel(key)] = props[key]);
    }

    set(key, value) {
        this[key] = value;
    }

    get(key) {
        return this[key];
    }

    /**
     * 转换成字符串
     */
    toString() {
        return JSON.stringify(this);
    }

    /**
     * 转换成mysql格式数据
     * @param {Array} fields 需要遍历的字段
     */
    toSqlJson(fields = Object.keys(this)) {
        const jsonObj = {};
        fields.map(field => {
            if (this.hasOwnProperty(field) && isNotEmpty(this[field])) {
                jsonObj[toLowerLine(field)] = this[field];
            }
        })
        return jsonObj;
    }
}

module.exports = Base;