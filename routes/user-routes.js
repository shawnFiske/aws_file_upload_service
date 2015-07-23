var User        = require('../models/user-model.js');
var bodyParser  = require('body-parser');

module.exports  = function(router) {
  router.use(bodyParser.json());
  //will retrieve all Cells
  router.route('/users')
        .get(function(request, response) {
          User.find({}, function(err, user) {
            if (err){
              response.status(500).json({msg: 'server error'})
            }else{
              response.json(user);
            }
          });
        })
        .post(function(request, response) {
          //'{"name":"Shawn"}'
          var user = new User(request.body);
          user.save(function(err, user){
            if (err){
              response.status(500).json({msg: 'server error'})
            }else{
              response.json(user);
            };
          });
        });

      router.route('/users/:id')
            .get(function(request, response) {
              console.log('passed ID: ', request.params.id);
              // user.save(function(err, user){
              //   if (err){
              //     res.status(500).json({msg: 'server error'})
              //   }else{
              //     //res.json(user);
              //     res.json({msg: 'server successful'});
              //   }
              // }
              response.json({msg: 'get /users/:id route hit'});
            })
            .post(function(request, response) {
              // user.save(function(err, user){
              //   if (err){
              //     res.status(500).json({msg: 'server error'})
              //   }else{
              //     //res.json(user);
              //     res.json({msg: 'server successful'});
              //   }
              // }
              response.json({msg: 'post /users/:id route hit'});
            });

      router.route('/users/:userId/files/:file')
            .post(function(request, response) {
              console.log('passed ID: ', request.params.userId, ' file: ', request.params.file);
              //  user.save(function(err, user){
              //   if (err){
              //     res.status(500).json({msg: 'server error'})
              //   }else{
              //     //res.json(user);
              //     res.json({msg: 'server successful'});
              //   }
              // }
              response.json({msg: 'get /users/:id/files/:file route hit'});
            });
  };
