var User        = require('../models/user-model.js');
var bodyParser  = require('body-parser');

module.exports  = function(router) {
  router.use(bodyParser.json());
  //will retrieve all Cells
  router.route('/users')
        .get(function(request, response) {
          if (err){
            res.status(500).json({msg: 'server error'})
          }else{
            res.json(user)
          }
        })
        .post(function(request, response) {
          if (err){
            res.status(500).json({msg: 'server error'})
          }else{
            res.json(user)
          }
        })

      router.route('/user/:id')
            .get(function(request, response) {
              if (err){
                res.status(500).json({msg: 'server error'})
              }else{
                res.json(user)
              }
            })
            .post(function(request, response) {
              if (err){
                res.status(500).json({msg: 'server error'})
              }else{
                res.json(user)
              }
            })

      router.route('/user/:id/files/:file')
            .post(function(request, response) {
              if (err){
                res.status(500).json({msg: 'server error'})
              }else{
                res.json(user)
              }
            })
  });
