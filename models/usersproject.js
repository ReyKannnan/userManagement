const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let usersSchema = new Schema({
  "userId"         : { type: mongoose.Schema.Types.ObjectId, ref: 'user_info' },
  "title"          : String,
  "startDate"      : String,
  "endDate"        : String,
  "description"    : String,
  "teamcount"      : Number,
  "stack"  		   : String,
  "status"         : { type : String, default : 'active' }
}, {"versionKey"   : false});


module.exports = mongoose.model('user_project', usersSchema, 'user_project');
