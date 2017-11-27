var Mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = Mongoose.Schema;

var userSchema = Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  entries: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Entry' }]
});

var User = Mongoose.model('User', userSchema);

// user method for generating a hashed password
User.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.validatePassword = async function(password, hash) {
  return new Promise((res, rej) =>
    bcrypt.compare(password, hash, (err, result) => {
      if (err) return rej(err);
      res(result);
    })
  );
};

module.exports = User;
