const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  ctx.body = {
    messages: await Message
        .find({chat: ctx.user._id})
        .limit(20)
        .then((m) => m.map(mapMessage)),
  };
};

function mapMessage({_id, text, date, user}) {
  return {text, date, user, id: _id};
}
