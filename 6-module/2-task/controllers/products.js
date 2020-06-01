const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if (ctx.query.subcategory) {
    const products = await Product.find({subcategory: ctx.query.subcategory}).limit(20);
    ctx.body = {products: products.map(mapProduct)};
  } else {
    return next();
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find().limit(20);
  ctx.body = {products: products.map(mapProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  const product = await Product.findById(ctx.params.id);
  if (!product) ctx.throw(404, 'Product not found');
  ctx.body = {product: mapProduct(product)};
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
