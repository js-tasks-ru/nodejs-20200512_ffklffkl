const User = require('../../models/User');

module.exports = async function authenticate(_, email, displayName, done) {
  try {
    if (!email) {
      done(null, false, 'Не указан email');
    } else {
      done(null, await User.findOne({email}) || await User.create({email, displayName}));
    }
  } catch (err) {
    done(err);
  }
};
