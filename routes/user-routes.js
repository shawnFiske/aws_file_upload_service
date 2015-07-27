var User        = require('../models/user-model.js');
var bodyParser  = require('body-parser');
var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3(); 
var BASE_BUCKET_NAME = 'fisketemp';
var ASW_KEY = process.env.AWS_KEY || AWS.config.secretAccessKey;

module.exports  = function(router) {
  router.use(bodyParser.json());
  //will retrieve all Users
  router.route('/users') // List all users
        .get(function(request, response) {
          User.find({}, function(err, user) {
            if (err){
              response.status(500).json({msg: 'server error'})
            }else{
              response.json(user);
            }
          });
        })//Add a user
        .post(function(request, response) {
          //'{"name":"Shawn"}'
          var user = new User(request.body);
          user.save(function(err, user){
            if (err){
              response.status(500).json({msg: 'server error'});
            }else{
              response.json(user);
            };
          });
        })
          //Temperay Delete just to clear database while testing would not be used in production
         .delete(function(request, response) {
          console.log('Deleteing entire collection');
          User.remove({}, function(err, item) {
            if(err){
              response.status(404);
              response.json({msg: 'failed'});
            }else{
              response.status(200);
              response.json({msg: 'success'});
            }
          });
        });

      router.route('/users/:name') // get user by naame
            .get(function(request, response) {
              console.log('passed Name: ', request.params.name);

              User.find({name: request.params.name}, function(err, user){
                if (err){
                  response.status(500).json({msg: 'server error'});
                }else{
                  //res.json(user);
                  response.json(user);
                }
              });

            })
            .put(function(request, response) {
              console.log(request.params.name);
               //'{"name":"Shawn"}' // 
              User.find({name: request.params.name}, function(err, user){
                if (err){
                  response.status(500).json({msg: 'server error'});
                }else{
                  //res.json(user);
                  response.json(user);
                }
              });
            })
            .delete(function(request, response) {
              
              getFileList(request.params.name , function (fileList) {

                var params = {Bucket: BASE_BUCKET_NAME, Delete: { Objects: fileList }};
                
                s3.deleteObjects(params, function(err, data) {
                  if (err){      
                    console.log(err, data);
                    response.status(500).json({msg: 'server error'});  
                  }else{       
                    console.log("Successfully Deleted", data); 
                    User.remove({name: request.params.name }, function(err, user){
                      if (err){
                        response.status(500).json({msg: 'server error'})
                      }else{
                        response.status(200);
                        response.json({msg: 'success'});  
                      }
                    });
                  }
                });
              });
            });

      router.route('/users/:name/files')
            .get(function(request, response) {
              User.findOne({name: request.params.name}, function(err, user){
                if (err){
                  response.status(500).json({msg: 'server error'});
                }else{
                  response.status(200).json({files: user.files})
                }
              });
            })

      router.route('/users/:name/files/:file')
            // /users/:userId/files/:file
            .post(function(request, response) {
              console.log('passed ID: ', request.params.name, ' file: ', request.params.file);
            
              fs.readFile(request.params.file, function(err, buffer){
                var params = {Bucket: BASE_BUCKET_NAME + "/" + request.params.name, Key: request.params.file.toString(), Body: buffer};
                s3.putObject(params, function(err, data) {
                  if (err){      
                    console.log(err);
                    response.status(500).json({msg: 'server error'}); 
                  }else{      
                    console.log("Successfully Added File"); 
                    //response.status(200);
                    //response.json({msg: 'success'});  
                    
                    genSignedUrl('getObject', request.params.name + "/" + request.params.file, function(url) {
                      User.findOne({name: request.params.name}, function(err, user){
                        if (err){
                          response.status(500).json({msg: 'server error'})
                        }else{
                          //response.status(200);
                          //response.json({msg: 'success'});  
                          user.files.push(url)
                          user.save(function(err) {
                            if(err){
                              response.status(500).json({msg: 'failed'});
                            }else{
                              response.status(200).json({msg: 'success'});
                            };
                          });
                        }
                      });
                    });
                  }
                });
              });
            });



    function getFileList(user, callback) {
      console.log("User: ", user);
      var params = {Bucket: BASE_BUCKET_NAME, Prefix: user };
      s3.listObjects(params, function(err, data) {
        if (err){      
          console.log(err, data);
        }else{      
          var parsedObjectArray = [];
          for(var i = 0; i <  data.Contents.length; i++){
            parsedObjectArray[i] = {Key: data.Contents[i].Key};
          }
          callback(parsedObjectArray);
        }
      });
    };


    function genSignedUrl(method, key, callback){
      console.log(method, key);
      var params = {Bucket: BASE_BUCKET_NAME, Key: key, Expires:  315360000};
      s3.getSignedUrl(method, params, function (err, url) {
        if(err){
          response.status(500).json({msg: err});
        }else{
          //console.log("The URL is", url);
          callback(url);
        }
      });
    }
  };
