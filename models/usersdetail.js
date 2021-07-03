const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let usersSchema = new Schema({
  "userId"         : { type: mongoose.Schema.Types.ObjectId, ref: 'user_info' },
  "firstname"      : String,
  "lastname"       : String,
  "dob"            : String,
  "phone"          : String,
  "city"  		   : String,
  "state"          : String,
  "country"        : String
}, {"versionKey"   : false});


module.exports = mongoose.model('user_detail', usersSchema, 'user_detail');
