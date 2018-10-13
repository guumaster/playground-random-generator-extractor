const { map, clone, uniq, reduce, sortBy, flatMap } = require('lodash')

const cleanCategory = require('../parser/clean_category')

const unwind = function (o, field) {
  return map(o[field], function (val) {
    var cloned = clone(o)
    cloned[field] = val
    return cloned
  })
}

module.exports = tables => {
  const grouped = sortBy(flatMap(tables.map(x => unwind(x, 'categories'))), 'categories')

  return reduce(grouped, (obj, { name, categories }) => {
    categories = cleanCategory(categories)
    obj[categories] = obj[categories] || []
    obj[categories] = uniq(obj[categories].concat([name]))
    return obj
  }, {})
}