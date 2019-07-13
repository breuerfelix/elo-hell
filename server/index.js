var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
var url = "mongodb://localhost:27017/";
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require("mongodb").ObjectID;

app.get('/getgames', function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("elo");
    dbo.collection('games').aggregate([
   { $lookup:
      {
        from: 'users',
        localField: 'p1id',
        foreignField: '_id',
        as: 'p1details'
      }},
      { $lookup:
        {
        from: 'users',
        localField: 'p2id',
        foreignField: '_id',
        as: "p2details"
      }
    }
  ]).toArray(function(err, result) {
   if (err) throw err;
   db.close();
      res.send(result);
    });
  });

})

app.post('/addgames', function (req, res) {


  MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    if(err) throw err;
    var dbo = db.db("elo");
    dbo.collection("games").insertOne({
      p1id: new ObjectId(req.body.p1id),
      p2id: new ObjectId(req.body.p2id),
      p1score: req.body.p1score,
      p2score: req.body.p2score
    },function(err, result) {
      if (err) throw err;
      db.close();
      res.sendStatus(200);
    })
  })
})


/*
Post needs json in this format
{
"username":"{somename}"",
"elo":{someInt}
}
*/
app.post('/adduser', function ( req, res) {

  //console.log(req.body)
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    if(err) throw err;
    var dbo = db.db("elo");
    dbo.collection("users").insertOne(req.body, function(err, result) {
      if (err) throw err;
      db.close();
      res.sendStatus(200);
    })
  })
})
//If ID = 0, you get the complete List
app.get('/getusers/:id', function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if(err) throw err;
    var dbo = db.db("elo");
    var mysort = {elo: -1};
    dbo.collection("users").find().sort(mysort).toArray(function(err, result) {
      if(err) throw err;
      db.close();
      if(req.params.id==0){
        res.send(result);
      }
      else {
        var output=[];
        //falls mehr user abgefragt werden als existieren, dann wird für die fehlenden user ein leeres objekt zurückgegeben
        for(var i=0; i<req.params.id; i++) {
          output.push(result[i]);
        }
        res.send(output);
      }
    })
  })
})


app.get('/testuser', function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("elo");
    var myobj = [
      { username: 'John', elo: 1000},
      { username: 'Peter', elo: 1212},
      { username: 'Amy', elo: 963},
      { username: 'Hannah', elo: 750},
      { username: 'Michael', elo: 893},
      { username: 'Sandy', elo: 1111},
      { username: 'Betty', elo: 1034},
    ];
    dbo.collection("users").insertMany(myobj, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      console.log("break");
      console.log(res);
      db.close();
    });
  });


})

app.get('/testgames', function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("elo");
    var myobj = [
      { p1id: new ObjectId("5d29cf2507f8ab2b9787bf13"), p2id: new ObjectId("5d29cf2507f8ab2b9787bf14"), p1score: 10, p2score: 6},
      { p1id: new ObjectId("5d29cf2507f8ab2b9787bf17"), p2id: new ObjectId("5d29cf2507f8ab2b9787bf15"), p1score: 2, p2score: 10}
    ];
    dbo.collection("games").insertMany(myobj, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    });
  });
})



var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
