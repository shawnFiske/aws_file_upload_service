var express       = require('express');
var mongoose      = require('mongoose');
//var bodyParser    = require('body-parser');

var app           = express();
var port          = process.env.PORT || 3000;
var userRoutes    = express.Router();

app.use(bodyParser());

require('./routes/user-routes')(userRoutes);
app.use('/api', userRoutes);

//set db path
mongoose.connect(process.env.testMongoUri || 'mongodb://localhost/userFileDb');

//listen for requests on port
app.listen(port, function() {
  console.log('Server available at localhost: ' + port);
});