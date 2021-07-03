const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let usersSchema = new Schema({
  "username"       : String,
  "email"          : String,
  "password"       : String,
  "accountStatus"  : { type : String, default : 'deactive' },
  "expiryAt"       : { type : Date },
  "otp"            : Number
}, {"versionKey"   : false});


module.exports = mongoose.model('user_info', usersSchema, 'user_info');
