const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  if (typeof ctx.query.query !== 'string') ctx.throw(400);
  const products = await Product
      .find(
          {$text: {$search: ctx.query.query}},
          {score: {$meta: 'textScore'}}
      )
      .sort({score: {$meta: 'textScore'}});
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
