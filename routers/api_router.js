var express = require('express');

// include games list so we can modify it
var games = require('../app/game_list.js');

var router = express.Router();

router.post('/addbot', function(req, res) {
    console.log(req.body);
    var botId = req.body.botid;
    var gameId = req.body.gameid;
    if (gameId in games) {
        if (games[gameId].addPlayer(botId)) {
            res.send("Added " + botId + " to " + gameId);
        }
        else {
            res.send(botId + " is already in " + gameId);
        }
    }
    else {
        res.send("Invalid game id: " + gameId);
    }
});

// called on post call to create a new bot from code
// body of post call needs to include actual code
// somewhere in this call need to have the user uploading it
// probably also need a way to verify that the user is who they say they are?
// can do this with passport: https://www.ctl.io/developers/blog/post/build-user-authentication-with-node-js-express-passport-and-mongodb
// then we can have people authenticate with facebook twitter etc also!
router.post('/createbot', function(req, res) {
    var code = req.body.code;
    // TODO:
    // add database code to actually add the code
    // make sure actually sent from the user it says it was from?
    console.log("Received request");
});

module.exports = router;