// Import mongo client
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

// Set up DB connection event handler
MongoClient.connect(url, {
  useNewUrlParser: true
}, function(err, db) {

  // connect to the right DB and create object
  var dbo = db.db("Blogs");
  var blog = {
    Title: "Test",
    Content: "Testing."
  };

  // insert the object as a document.
  dbo.collection("blogs").insertOne(blog, function(err, res) {
    console.log("Added blog to the DB");
    db.close;
  });
});