var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var Game = require('./app/game.js');
// games is the object containing all currently running games
var games = require('./app/game_list.js');

var port = 8080;

var app = express();

// using middleware to parse POST bodies into js objects
app.use(bodyParser.urlencoded({
  extended: true
}));

// router handles all api calls
// kept in external file
var apiRouter = require('./routers/api_router.js');
var loginRouter = require('./routers/login_router.js');

// send all api calls to api router
app.use('/api', apiRouter);

// send all login calls to login router
app.use('/login', loginRouter);

var gameCount = 0;

// but for now 
var pokerGame = createPokerGame();

function createPokerGame() {
    var newGame = new Game();
    newGame.setId(gameCount++);
    games[newGame.getId()] = newGame;
    return newGame;
}

app.get('/', function(req, res) {
    res.send(pokerGame.getState());
});

app.listen(port, function(event) {
    console.log("Server running");
    
});