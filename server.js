var express       = require('express');
var mongoose      = require('mongoose');
//var bodyParser    = require('body-parser');

var app           = express();
var port          = process.env.PORT || 3000;
var userRoutes    = express.Router();

require('./routes/user-routes')(userRoutes);
app.use('/api', userRoutes);

//set db path
mongoose.connect(process.env.testMongoUri || 'mongodb://localhost/userFileDb');

//listen for requests on port
app.listen(port, function() {
  console.log('Server available at localhost: ' + port);
});

// info ////////////////////////////////////////////////////////////////
// http://kalapun.com/posts/node-js-open-source-and-secret-keys/
// http://aws.amazon.com/sdk-for-node-js/
// https://github.com/CADBOT/student-status
// https://console.aws.amazon.com/s3/home?region=us-west-2#&bucket=fisketemp&prefix=
// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html