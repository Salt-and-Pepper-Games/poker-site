var helper = require('./helper.js');

var Game = function() {
    var running = false;
    
    var handSize = 5;
    
    var botids = [];
    var hands = [];
    var deck = [];
    
    var id = Date.now();
    
    for (var i=0; i<52; i++) {
        deck.push(helper.getCardName(i));
    }
    helper.shuffle(deck);
    
    // attempts to add the player, returns true if successful, false if not
    // for now, false is just if the player is already in the game
    var addPlayer = function(id) {
        if (id in botids) {
            return false;
        }
        botids.push(id);
        var newHand = [];
        for (var i=0; i<handSize && deck.length > 0; i++) {
            newHand.push(deck.pop());
        }
        hands.push(newHand);
        return true;
    }
    
    // return all relevant state information needed to visualize the game
    var getState = function() {
        return {
            deck : deck,
            hands : hands,
            id : id
        };
    }
    
    // return the id of this game
    var getId = function() {
        return id;
    };
    
    // set the id of this game
    var setId = function(newId) {
        id = newId;
    };
    
    
    return {
        getState : getState,
        addPlayer : addPlayer,
        getId : getId,
        setId : setId
    };
}

module.exports = Game;