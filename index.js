var http = require("http"),
    app = require('./controllers').app,
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    Server = require('mongodb').Server;

var mongoHost = 'localHost'; //A
var mongoPort = 27017; 
var url = 'mongodb://localhost:27017/MyDatabase';
var collectionDriver;
 
var mongoClient = new MongoClient(new Server(mongoHost, mongoPort));
mongoClient.connect(url,function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  
  collectionDriver = new CollectionDriver(db);
  //db.close();
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});