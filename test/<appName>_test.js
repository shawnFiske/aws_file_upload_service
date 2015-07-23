var expect = require('chai').expect;
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');
 
chai.use(chaiHttp);


//process.env.MONGO_URL = 'mongodb'
 
var recordID = '';

describe('Running Game Board Rest API Tests POST', function(){

  it('Post using a string value to describe terrain in this case "Mountain"', function(done){
    chai.request('localhost:3000/api')
        .post('/cell/Mountain')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
        done();
    });
  });
});

describe('Running Game Board Rest API Tests GET all', function(){

  it('Get all records and checking if success and res.body[0].name === "Mountain"', function(done){
    chai.request('localhost:3000/api')
        .get('')
        .end(function(err, res) {
          recordID = res.body[0]._id;
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body[0].name).to.equal("Mountain");
        done();
     });
  });
});

describe('Running Game Board Rest API Test PUT:', function(){
  it('Update initial created object with a player id', function(done){
    chai.request('localhost:3000/api')
        .put('/cell')
        .send({"id":'"' + recordID + '"',"data":{"hasPlayers":"true", "players":["1234"], "hasEncounters":"true", "encounters":["1234"]}})
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
        done();
     });
  });
});

describe('Running Game Board Rest API Tests GET item by id', function(){

  it('Get record by id and checking if successfully parsed the a player with id of "1234"', function(done){
    chai.request('localhost:3000/api')
        .get('/cell/' + recordID)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body.players[0]).to.equal("1234");
        done();
     });
  });
});

describe('Running Game Board Rest API Tests Query for list of cells with players', function(){

  it('Get list of cells with players', function(done){
    chai.request('localhost:3000/api')
        .get('/players')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body[0]._id).to.equal(recordID);
          expect(res.body[0].players[0]).to.equal('1234');
        done();
     });
  });
});

describe('Running Game Board Rest API Tests Delete Records:', function(){

  it('Delete record that was created', function(done){
    chai.request('localhost:3000/api')
        .delete('/cell')
        .end(function(err, res) {
        done();
     });
  });
});

// after(function(done){
//   mongoose.connection.db.dropDatabase(function(){
//     done();
//   });
// });