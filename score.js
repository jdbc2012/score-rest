
var mongo = require('mongodb');

var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('scoredb', server);

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to 'scoredb' database");
		db.collection('scores', {strict:true}, function(err, collection) {
		if (err) {
			console.log("The 'scores' collection doesn't exist. Creating it with sample data...");
			populateDB();
		}
		});
	}
});

exports.findAll = function(req, res) {
	
	console.log('Find scores');	

	db.collection('scores', function(err, collection) {
	collection.find().toArray(function(err, items) {
		console.log('Items: ' + items);
		res.send(items);
		});
	});
};
 
exports.findById = function(req, res) {
	var userid = req.params.userid;

	console.log('Retrieving score: ' + userid);
	db.collection('scores', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
		res.send(item);
		});
	});
};

exports.addScore = function(req, res) {
	var score = req.body;
	console.log('Adding score: ' + JSON.stringify(score));

	db.collection('scores', function(err, collection) {
		collection.insert(score, {safe:true}, function(err, result) {
		if (err) {
			res.send({'error':'An error has occurred'});
		} else {
			console.log('Success: ' + JSON.stringify(result[0]));
			res.send(result[0]);
			}
		});
	});
}


exports.updateScore = function(req, res) {
	var id = req.params.id;
	var score = req.body;
	
	console.log('Updating score: ' + id);
	console.log(JSON.stringify(score));
	db.collection('scores', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, score, {safe:true}, function(err, result) {
		if (err) {
			console.log('Error updating score: ' + err);
			res.send({'error':'An error has occurred'});
		} else {
			console.log('' + result + ' document(s) updated');
			res.send(score);
			}
		});
	});
}

exports.deleteScore = function(req, res) {
	var id = req.params.id;
	console.log('Deleting score: ' + id);
	db.collection('scores', function(err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
		if (err) {
			res.send({'error':'An error has occurred - ' + err});
		} else {
			console.log('' + result + ' document(s) deleted');
			res.send(req.body);
			}
		});
	});
}


var populateDB = function() {
 
	var scores = {userid: "test", points: [100, 120, 130]} //Testing data

	db.collection('scores', function(err, collection) {
		collection.insert(scores, {safe:true}, function(err, result) {});
	});

};

