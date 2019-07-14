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
        foreignField: 'username',
        as: 'p1details'
      }},
      { $lookup:
        {
        from: 'users',
        localField: 'p2id',
        foreignField: 'username',
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
/*
Post needs json in this format
The list t1/t2 is flexible. You can add 1 or infinite players
{
  t1:[
  { pid: "{username from player 1 in team 1}"},
  {  pid: "{username from player 2 in team 2}"}],
  t2:[
  { pid: "{username from player 1 in team 2}"},
  {  pid: "{username from player 2 in team 2}"}],
  t1score: {score from team1},
  t2score: {score from team2}
}
*/
app.post('/addgames', function (req, res) {
  var op1 = false;
  var op2 = false;

var json=[];
  function buildJson(team) {
    console.log(team[0])
    console.log(Object.keys(team).length)
    for(var i = 0;i<Object.keys(team).length;i++){
      json+='{"pid":'+(team[i].pid)+'}'
      if(i<(Object.keys(team).length)-1) {
        json+=','
      }
      console.log(json)
    }
    return JSON.parse(json.toString)
  }



  MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    if(err) throw err;
    var dbo = db.db("elo");
    dbo.collection("games").insertOne({
    t1:[
      buildJson(req.body.t1)
    ],
    t2:[
    buildJson(req.body.t2)
    ],
    t1score: req.body.t1score,
    t2score: req.body.t2score,
    timestamp: Date.now()

    },function(err, result) {
      if (err) throw err;
      db.close();
      res.sendStatus(200)
    })
  })
/*  MongoClient.connect(url, {useNewUrlParser}, function(req, res) {
    if(err) throw err;
    var dbo = db.db("elo");
    dbo.collection("users").update
  })*/

})


/*
Post needs json in this format
{
  username:"{somename}"
}
*/
app.post('/adduser', function ( req, res) {

  //console.log(req.body)
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    if(err) throw err;
    var dbo = db.db("elo");
    dbo.collection("users").insertOne({
      username: req.body.username,
      elo: 1000
    }, function(err, result) {
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
    })
    db.close()
  })


})

app.get('/testgames', function (req, res) {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("elo");
    var myobj = [
      {
        t1: [
            {pid: "John"},
            {pid: "Sandy"},
        ],
        t2: [
            {pid: "Betty"},
            {pid: "Michael"}
        ],
        t1score: 3,
        t2score: 10,
        timestamp: Date.now()
    },
    {
      t1: [{
          pid: "Sandy"
      }],
      t2: [{
          pid: "Hannah"
      }],
      t1score: 10,
      t2score: 5,
      timestamp: Date.now()
  }
    ];
    dbo.collection("games").insertMany(myobj, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted: " + res.insertedCount);
      db.close();
    })
  })
})

app.get('/test', function (req, res) {
  var json = {
    t1: [{
        pid: "5d29cf2507f8ab2b9787bf18"},
        {pid: "5d29f86c03058f3cad56fc7f"},
    ],
    t2: [{
        pid: "5d29f86c03058f3cad56fc7f"},
        {pid: "5d29f86c03058f3cad56fc7f"
    }],
    p1score: 8,
    p2score: 2,
    timestamp: Date.now()
}

console.log(Object.keys(json.t1).length);
//console.log(Date.now())
console.log(json.t1[0])
console.log(json);
res.send(json.t1)
})



var server = app.listen(8080, function () {
   var host = server.address().address
   var port = server.address().port

   console.log("Example app listening at http://%s:%s", host, port)
})
