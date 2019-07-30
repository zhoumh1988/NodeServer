const { execute } = require('../plugins/DB');
const { isEmpty, handleDataToCamel, handleDatatoLowerLine } = require('../plugins/Utils');

/**
 * Dao基础类
 * @description
 * - insert
 * - selectByPrimaryKey
 * - updateByPrimaryKey
 * - deleteByPrimaryKey
 * - listAll
 * @constructs {String} tableName 表名
 */
class BaseDao {

    /**
     * @param {String} tableName 表名
     */
    constructor(tableName, baseResultMap = "*") {
        this.tableName = tableName;
        this.baseResultMap = baseResultMap;
    }

    /**
     * 插入
     * @param {JSON} record 要插入的纪录
     */
    async insert(record) {
        const keys = Object.keys(record);
        const params = keys.map(key => record[key]);
        return await execute(`INSERT INTO ${this.tableName} (${keys.map(key => key).join(',')}) VALUES (${keys.map(() => '?').join(',')})`, params);
    }

    /**
     * 根据id查询纪录
     * @param {Number|String} id 唯一标识
     */
    async selectByPrimaryKey(id) {
        const rowData = await execute(`SELECT ${this.baseResultMap} FROM ${this.tableName} WHERE id = ?`, [id]);
        return rowData.length > 0 ? handleDataToCamel(rowData[0]) : false;
    }

    /**
     * 根据纪录的id更新字段
     * @param {JSON} record 需要更新的字段
     */
    async updateByPrimaryKey(record) {
        record = handleDatatoLowerLine(record);
        const keys = Object.keys(record);
        const toUpdate = keys.filter(key => key !== 'id');
        const params = toUpdate.map(key => record[key]);
        params.push(record.id);
        return await execute(`UPDATE ${this.tableName} SET ${toUpdate.map(key => `${key} = ?`).join(',')} WHERE id = ?`, params);
    }

    /**
     * 
     * @param {Number} id 唯一标识
     * @param {Boolean|String} field 是否逻辑删除 默认false，若逻辑删除，传递删除字段
     * @param {any} value 删除要设置的值
     */
    async deleteByPrimaryKey(id, field = false, value) {
        if (field === false) {
            return await execute(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
        } else {
            return await execute(`UPDATE ${this.tableName} SET ${field} = ? WHERE id = ?`, [value, id])
        }
    }

    /**
     * 查询全部列表
     */
    async listAll() {
        const list = await execute(`SELECT ${this.baseResultMap} FROM ${this.tableName}`);
        return list ? handleDataToCamel(list) : list;
    }

    /**
     * 按条件查询列表
     * @param {JSON} query 查询条件
     */
    async listByQuery(query = { 1: 1 }) {
        if (isEmpty(query)) query = { 1: 1 };
        const keys = Object.keys(query);
        const params = keys.map(key => query[key]);
        const list = await execute(`SELECT ${this.baseResultMap} FROM ${this.tableName} WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}`, params);
        return list ? handleDataToCamel(list) : list;
    }

    /**
     * 分页查询
     * @param {JSON} paginaton 分页参数
     * @param {JSON} query 查询条件
     */
    async pageByQuery({ pageNo, pageSize, sortorder, sortdesc = 'DESC' }, query = { 1: 1 }) {
        if (isEmpty(query)) query = { 1: 1 };
        query = handleDatatoLowerLine(query);
        const keys = Object.keys(query);
        const params = keys.map(key => query[key]);
        const limit = [(pageNo - 1) * pageSize, pageSize];
        const list = await execute(`SELECT ${this.baseResultMap} FROM ${this.tableName} WHERE ${keys.map(key => `${key} = ?`).join(' AND ')} ${sortorder && ` ORDER BY ${sortorder} ${sortdesc}`} LIMIT ?,?`, params.concat(limit));
        return list ? handleDataToCamel(list) : list;
    }

    /**
     * 根据条件统计数量
     * @param {JSON} query 查询条件
     */
    async countByQuery(query = { 1: 1 }) {
        if (isEmpty(query)) query = { 1: 1 };
        query = handleDatatoLowerLine(query);
        const keys = Object.keys(query);
        const res = await execute(`SELECT COUNT(1) AS total FROM ${this.tableName} WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}`, keys.map(key => query[key]));
        return res[0].total;
    }
}

module.exports = BaseDao