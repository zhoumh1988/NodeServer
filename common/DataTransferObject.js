
/**
 * 返回结果统一封装类
 * @class DataTransferObject
 * @author LittleStrong
 */
class DataTransferObject {
    /**
     * 返回结果统一封装类
     * @method constructor
     * 
     * @augments 1个参数时
     * @param {Object} data 返回的结果 
     * @example new DTO({id: 1});
     * 
     * @augments 2个参数时
     * @param {Number} code 状态码
     * @param {String} msg 返回消息 
     * @example new DTO(200, 'success');
     * 
     * @augments 3个参数时
     * @param {Number} code 状态码
     * @param {String} msg 返回消息
     * @param {Object} data 返回的结果
     * @example new DTO(200, 'success', {id: 1});
     */
    constructor() {
        if (arguments.length == 1) {
            this.code = 0;
            this.msg = '';
            this.data = arguments[0];
        } else if (arguments.length == 2) {
            this.code = arguments[0];
            this.msg = arguments[1];
            this.data = null;
        } else if (arguments.length == 3) {
            this.code = arguments[0];
            this.msg = arguments[1];
            this.data = arguments[2];
        } else {
            this.code = 0;
            this.msg = '';
            this.data = null;
        }
    }

    /**
     * 设置状态码
     * @method setCode
     * @param {Number} code 
     */
    setCode(code) {
        this.code = code;
    }

    /**
     * 设置消息
     * @method setMsg
     * @param {String} msg 
     */
    setMsg(msg) {
        this.msg = msg;
    }

    /**
     * 返回结果
     * @method setData
     * @param {Object} data 
     */
    setData(data) {
        this.data = data;
    }

    toString() {
        return `{code: ${this.code}, msg: "${this.msg}", data: ${JSON.stringify(this.data)}}`;
    }
}

/**
 * @constant 参数错误！
 */
DataTransferObject.PARAMS_ERR = { code: 400, msg: '参数错误！', data: {} };
/**
 * @constant 请登录后操作！
 */
DataTransferObject.NOT_LOGIN_ERR = { code: 401, msg: '请登录后操作！', data: {} };
/**
 * @constant 您的账户无此操作权限！
 */
DataTransferObject.FORBIDDEN_ERR = { code: 403, msg: '您的账户无此操作权限！', data: {} };
/**
 * @constant 未查找到纪录
 */
DataTransferObject.NOT_FOUND = { code: 404, msg: '未查找到纪录', data: {} };
/**
 * @constant 请求超时，请重试！
 */
DataTransferObject.TIMEOUT_ERR = { code: 500, msg: '请求超时，请重试！', data: {} };

module.exports = DataTransferObject;