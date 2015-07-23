var mongoose      = require('mongoose');
var userSchema    = mongoose.Schema({
  name:String,
  files: []
});


module.exports = mongoose.model('User', userSchema);