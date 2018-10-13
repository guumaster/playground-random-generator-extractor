const extractTables = require('./extract_tables')
const cleanCategory = require('./clean_category')

const cleanCategories = cats => cats.map(cleanCategory)

module.exports = ({ name, content = '' }) => {

  if (!content) {
    return { name }
  }
  if (content.match(/#REDIRECT/m)) {
    return { name, tables: '', redirect: true }
  }

  const match = content.match(/<sgtable>((?:(?!<\/sgtable>).*\r?\n?)*)/im)
  const categories = content.match(/\[\[Category:((?:[^\]])*)/ig)

  const tables = match ? match[1] : ''

  return {
    name,
    tables,
    size: tables.length,
    lines: (tables.match(/\n+/g) || []).length,
    categories: categories ? cleanCategories(categories) : [],
    externals: extractTables(tables)
  }
}