const jsmicro_is_empty = require('jsmicro-is-empty');
const moment = require('moment');
const DTO = require('../common/DataTransferObject');
const isEmpty = (val) => {
    if (typeof val === 'number') {
        return false;
    } else {
        return jsmicro_is_empty.isEmpty(val);
    }
}

const isNotEmpty = (val) => {
    if (typeof val === 'number' && !isNaN(val)) {
        return true;
    } else {
        return jsmicro_is_empty.isNotEmpty(val);
    }
}

/**
 * 格式化时间
 * @param {String|Moment|long} date 要格式化的时间
 * @param {String} formatter 格式化的结果 默认 YYYY-MM-DD HH:mm:ss
 */
const formatDate = (date, formatter = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(date).format(formatter);
};

/**
 * 驼峰式转下划线
 * @param {String} str 要转换的字符串
 */
const toLowerLine = str => {
    let temp = str.replace(/[A-Z]/g, function (match) {
        return "_" + match.toLowerCase();
    });
    if (temp.slice(0, 1) === '_') { //如果首字母是大写，执行replace时会多一个_，这里需要去掉
        temp = temp.slice(1);
    }
    return temp;
}

/**
 * 下划线转驼峰式
 * @param {String} str 要转换的字符串
 */
const toCamel = str => str.replace(/([^_])(?:_+([^_]))/g, ($0, $1, $2) => $1 + $2.toUpperCase());

/**
 * 校验工具类
 * @param {JSON} record 
 * @param {JSON} validators
 */
const validate = (record, validators) => {
    const fields = Object.keys(validators);
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const modes = validators[field];
        const value = record[field];
        for (let j = 0; j < modes.length; j++) {
            const { mode, target, message = `字段${field}校验不通过` } = modes[j];
            if (typeof mode === 'function') {
                if (!mode(value)) {
                    return message;
                }
            } else {
                switch (mode) {
                    case 'required': // 校验非空
                        if (isEmpty(value)) {
                            return message;
                        }
                        break;
                    case 'type': // 校验数据类型
                        if (isNotEmpty(value)) {
                            if (typeof value !== target) {
                                return message;
                            }
                        }
                        break;
                    case 'len': // 校验字符串长度
                        if (isNotEmpty(value) && typeof value === 'string') {
                            if (Array.isArray(target)) {
                                if (value.length < target[0] || value.length > target[1]) {
                                    return message;
                                }
                            } else {
                                if (value.length > target) {
                                    return message;
                                }
                            }
                        }
                        break;
                    case 'max': // 校验数字最大值
                        if (isNotEmpty(value) && typeof value === 'number') {
                            if (value > target) {
                                return message;
                            }
                        }
                        break;
                    case 'min': // 校验数字最小值
                        if (isNotEmpty(value) && typeof value === 'number') {
                            if (value < target) {
                                return message;
                            }
                        }
                        break;
                    case 'match': // 正则表达式校验
                        if (isNotEmpty(value)) {
                            if (target instanceof RegExp) {
                                if (!target.test(value)) {
                                    return message;
                                }
                            } else {
                                console.warn("正则表达式校验，表达式错误：", mode);
                                return false;
                            }
                        }
                        break;
                }
            }
        }
    }
    return true;
}

/**
 * 分页校验二次封装
 * @param {Response} res 响应
 * @param {Pagination} pagination 分页对象
 * @param {JSON} validators 自定义校验
 */
validate.validPagination = (res, pagination, validators = {}) => {
    const valid = validate(pagination, Object.assign({
        pageNo: [
            { mode: 'required', message: '页码不能为空' },
            { mode: 'type', target: 'number', message: "页码格式不正确" },
            { mode: 'min', target: 1, message: "页码格式不正确" },
        ],
        pageSize: [
            { mode: 'required', message: 'pageSize不能为空' },
            { mode: 'type', target: 'number', message: "pageSize格式不正确" },
            { mode: 'min', target: 10, message: "pageSize限制在[10,50]" },
            { mode: 'max', target: 50, message: "pageSize限制在[10,50]" },
        ],
        sortorder: [
            { mode: 'type', target: 'string', message: "sortorder格式不正确" },
        ],
        sortdesc: [
            { mode: value => isEmpty(value) || value === 'desc' || value === 'asc', message: '排序方式仅支持desc和asc' }
        ]
    }, validators));
    if (valid !== true) {
        const dto = new DTO();
        dto.setCode(400);
        dto.setMsg(valid);
        res.send(dto);
        return false;
    } else {
        return true;
    }
}

module.exports = {
    isEmpty,
    isNotEmpty,
    moment,
    formatDate,
    validate,
    toLowerLine,
    toCamel,
};