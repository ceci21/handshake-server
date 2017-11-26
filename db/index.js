const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = require('./mongo');

MongoClient.connect(MONGODB_URI, (err, db) => {
  console.log(db);
  db.collection('handshake', function(err, collection) {
    if (err) throw err;
    collection.insert({firstName: 'Steve'});
    collection.find().toArray(function(err, items) {
      if (err) throw err;
      console.log(items);
    });
  })
  if (err) throw err;
});