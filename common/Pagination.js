/**
 * 分页类
 * @class Pagination
 * @author LittleStrong
 */
class Pagination {
    /**
     * 分页
     * @method constructor
     */
    constructor(props) {
        this.pageNo = props.pageNo || 0;
        this.pageSize = props.pageSize || 0;
        this.total = 0;
        this.list = [];
        this.sortorder = props.sortorder;
        this.sortdesc = props.sortdesc;
    }

    setTotal(total = 0) {
        this.total = Number(total);
    }

    setPageNo(pageNo = 0) {
        this.pageNo = Number(pageNo);
    }

    setPagesize(pageSize = 10) {
        this.pageSize = Number(pageSize);
    }

    setList(list = []) {
        this.list = list;
    }
}

module.exports = Pagination;