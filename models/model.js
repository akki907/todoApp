var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var BlogSchema = new Schema({
  title:String,
  description:String,
  createdDate: {type : Date , default : Date.now},
  coverImage: String
});

var model = mongoose.model('Blog', BlogSchema);

module.exports = model;
