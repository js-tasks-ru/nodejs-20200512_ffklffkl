const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find().limit(20);
  ctx.body = {categories: categories.map(mapCategory)};
};

function mapCategory({_id, title, subcategories}) {
  return {
    title,
    id: _id,
    subcategories: subcategories.map(({_id, title}) => ({title, id: _id})),
  };
}
