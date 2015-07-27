var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var fileSchema  = Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  file: String
});

module.exports = mongoose.model('File', fileSchema);