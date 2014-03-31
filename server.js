var express = require('express'),
			score = require('./score.js');
 
var app = express();

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.get('/scores', score.findAll);
app.get('/scores/:id', score.findById);
app.post('/scores', score.addScore);
app.put('/scores/:id', score.updateScore);
app.delete('/scores/:id', score.deleteScore);
 
app.listen(3000);
console.log('Listening on port 3000...');
