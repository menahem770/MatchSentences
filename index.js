var http = require("http"),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    Server = require('mongodb').Server,
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    CollectionDriver = require('./collectionDriver').CollectionDriver,
    MatchSentences = require('./matchSentences').matchSentences;

var app = express();
app.set('port', process.env.PORT || 8081);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());

var url = 'mongodb://localhost:27017/MyDatabase';
//var url = process.env.DB;
var collectionDriver;
 
MongoClient.connect(url,function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  
  collectionDriver = new CollectionDriver(db);
  //db.close();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/:collection', function(req, res) { //A
   var params = req.params; //B
   collectionDriver.findAll(req.params.collection, function(error, objs) { //C
          if (error) { res.status(400).send(error); } //D
	      else { 
	          if (req.accepts('html')) { //E
    	          res.render('data',{objects: objs, collection: req.params.collection}); //F
              } else {
	          res.set('Content-Type','application/json'); //G
                  res.status(200).send(objs); //H
              }
         }
   	});
});
 
app.get('/:collection/:entity', function(req, res) { //I
   var params = req.params;
   var entity = params.entity;
   var collection = params.collection;
   if (entity) {
       collectionDriver.get(collection, entity, function(error, objs) { //J
          if (error) { res.status(400).send(error); }
          else { res.status(200).send(objs); } //K
       });
   } else {
      res.status(400).send({error: 'bad url', url: req.url});
   }
});

app.post('/:collection', function(req, res) {
    var object = req.body;
    var collection = req.params.collection;
    collectionDriver.save(collection, object, function(err,docs) {
          if (err) { res.status(400).send(err); } 
          else { res.status(201).send(docs); }
     });
});

app.get('/matchSentence/:collectionName/:sentance', function(req, res) {
    var sentence = req.params.sentance;
    var collectionName = req.params.collectionName;
    collectionDriver.findAll(collectionName, function(error, collection) {
        if (error) { res.status(400).send(error); }
        else { 
            var result = MatchSentences(sentence,collection)
            collectionDriver.get(collectionName,result.index, function(error, match){
                if (error) { res.status(400).send(error); }
                else {
                    match.distance = result.dist;
                    res.status(200).send(match);
                }
            });
        }
   	});
});

app.use(function (req,res) { //1
    res.render('404', {url:req.url}); //2
});


app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});