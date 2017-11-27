var Mongoose = require('mongoose');

var Schema = Mongoose.Schema;

var entrySchema = Schema({
  name: String,
  description: String,
  link: String,
  host: String,
  email: String,
  created: { type: Date, default: Date.now }
});

var Entry = Mongoose.model('Entry', entrySchema);

module.exports = Entry;
