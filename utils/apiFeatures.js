class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {

        const filter = this.queryStr.filter;
        if (!filter) {
            this.query = this.query.find().sort({ createdAt: -1 });
        }
        else {
            this.query = this.query.find().sort({ votes: -1 });
        }
        return this;

    }

    pagination() {
        const resPerPage = 10;
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }

}

module.exports = APIFeatures;