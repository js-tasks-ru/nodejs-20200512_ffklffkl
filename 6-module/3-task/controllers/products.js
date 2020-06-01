const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query;
  if (!query) ctx.throw(400);

  const products = await Product
      .find({$text: {$search: query}}, {score: {$meta: 'textScore'}})
      .sort({score: {$meta: 'textScore'}})
      .limit(20);
  ctx.body = {products: products.map(mapProduct)};
};

function mapProduct({_id, title, images, category, subcategory, price, description}) {
  return {
    title,
    images,
    category,
    subcategory,
    price,
    description,
    id: _id,
  };
}
