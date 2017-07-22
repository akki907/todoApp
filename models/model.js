var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TodoSchema = new Schema({
  title:String,
  createdDate: {type : Date , default : Date.now}
});
var model = mongoose.model('Todo', TodoSchema);
module.exports = model;
