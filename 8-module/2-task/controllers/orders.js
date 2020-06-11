const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  const {user: {_id: user, email}, request: {body}} = ctx;

  const {_id: id, product} = await Order.create({...body, user})
      .then((res) => Order.findById(res._id).populate('product'));

  await sendMail({
    template: 'order-confirmation',
    locals: {id, product},
    to: email,
    subject: 'Заказ оформлен',
  });

  ctx.body = {order: id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  ctx.body = {orders: await Order.find({user: ctx.user._id}).populate('product')};
};
