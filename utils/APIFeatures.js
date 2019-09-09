class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    // 1. filter out functional strings
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(element => {
      delete queryObject[element];
    });

    // 2. filter and replace comparison operators
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(/\b(gte|gte|gt|lt)\b/g, match => {
      return `$${match}`;
    });
    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    // 3. sort by url param passed in
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // 4. field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    // 5. pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    // example: page 3, limit 10 >>>> 21 - 30 >>>> skip 20
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
