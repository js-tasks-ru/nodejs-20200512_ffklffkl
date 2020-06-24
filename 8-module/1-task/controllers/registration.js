const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;
  const verificationToken = uuid();
  const user = new User({email, displayName, password, verificationToken});

  await user.setPassword(password);
  await user.save();

  await sendMail({
    template: 'confirmation',
    locals: {token: verificationToken},
    to: email,
    subject: 'Подтвердите почту',
  });

  ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
  const verificationToken = ctx.request.body.verificationToken;
  const user = await User.findOneAndUpdate(
      {verificationToken},
      {$unset: {verificationToken: 1}},
      {new: true}
  );

  if (!user) ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');

  const token = await ctx.login(user);
  ctx.body = {token};
};
