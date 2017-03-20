var helper = require('./helper.js');

var Player = function() {
    return {
        hand: [],
        bet: 0,
        money: 500,
    }
}

var bet = Object.freeze({
    call: 0,
    fold: -1
});

var Game = function() {
    var running = false;
    
    var handSize = 2;
    // object containing key value pairs where keys are ids and values are Player objects
    var players = {};
    
    var deck = [];
    var tableCards = [];
    var pot = 0;
    var tableBet = 0;
    
    var turnOrder = [];
    
    var currentPlayerIndex;
    
    var id = Date.now();
    
    resetGame();
    
    // attempts to add the player, returns true if successful, false if not
    // for now, false is just if the player is already in the game
    var addPlayer = function(id) {
        if (helper.objectLength(players) >= 10) {
            // table is full
            return false;
        }
        if (id in players) {
            return false;
        }
        
        players[id] = new Player();
        players[id].hand = dealHand();
        turnOrder.push(id);
        if (currentPlayerIndex === undefined) {
            currentPlayerIndex = 0;
        }
        return true;
    }
    
    // return all relevant state information needed to visualize the game
    var getState = function() {
        return {
            deck: deck,
            players: players
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
    
    // MAIN GAME UPDATE LOOP GOES HERE
    var update = function() {
        // can't have a game with no one in it
        if (helper.objectLength(players) < 2) {
            return;
        }
        
        var id = turnOrder[currentPlayerIndex];
        var player = players[id];
        var hand = player.hand;
        
        // skip the player if they've folded
        if (player.bet != bet.fold) {
        
            //if everyone else has called previously, table bet will be equal to current bet
            if (tableBet === player.bet) {
                if (tableCards.length === 0) {
                    // the flop
                    for (var i=0; i<3; i++) {
                        tableCards.push(deck.pop());
                    }
                }
                else if (tableCards.length >= 5) {
                    // betting is done, all cards are already dealt. game's over
                    endGame();
                }
                else {
                    // put another card down on the table
                    tableCards.push(deck.pop());
                }
            }

            var allBets = {};
            var index = currentPlayerIndex + 1;
            if (index >= turnOrder.length) {
                index = 0;
            }
            // loop around table through all players from player after current one to current one
            for (var i=0; i<turnOrder.length; i++) {
                allBets[turnOrder[index]] = players[turnOrder[index]].bet;
                index++;
                if (index >= turnOrder.length) {
                    index = 0;
                }
            }

            // this is where we call the user function, and pass in our hand, cards on the table, current table bet, all the bets of all players
            // format of allBets is that it goes around the table and ends with the current user
            var raise = getUserBet(id, {hand:hand, 
                                    tableCards:tableCards, 
                                    tableBet:tableBet, 
                                    allBets:allBets});

            // there should be constants defined for calling and folding, and otherwise it's assumed to be a raise
            // if it's a raise, the value is the amount by which they are raising, NOT the absolute
            if (raise === bet.call) {
                // TODO: need some weird logic for handling the all in case
                // apparently the rules say that if someone goes all in, they can stay in the hand but if they win they don't get anything they didn't match
                // remaining winnings go in a side pot. not even sure what happens to money in the side pot but someone else wins it at the end of the hand
                var betDiff = tableBet - player.bet;
                if (player.money >= betDiff) {
                    player.money -= betDiff;
                    player.bet = tableBet;
                    pot += betDiff;
                }
            }
            else if (raise === bet.fold) {
                player.bet = bet.fold;
                var nonFoldedCount = 0;
                
                for (var i=0; i<turnOrder.length; i++) {
                    if (players[turnOrder[i]].bet != bet.fold) {
                        nonFoldedCount++;
                    }
                }
                // if only one person is left, they win
                // endGame() will find that they won and even though it's not quite as efficient to do the whole process, it feels nicer
                if (nonFoldedCount === 1) {
                    endGame();
                }
            }
            else {
                if (raise > 0) {
                    // player raised. gotta make sure they actually have the money
                    if (player.money >= raise) {
                        player.money -= raise;
                        player.bet += raise;
                        tableBet += raise;
                        pot += raise;
                    }
                    else {
                        // player doesn't have enough money to do this action
                        if (player.money > 0) {
                            player.bet += player.money;
                            player.money = 0;
                            tableBet += player.money;
                            pot += player.money;
                        }
                    }
                }
            }
        }
        
        
        currentPlayerIndex++;
        if (currentPlayerIndex >= turnOrder.length) {
            currentPlayerIndex = 0;
        }
    }
    
    function dealHand() {
        var newHand = [];
        for (var i=0; i<handSize && deck.length > 0; i++) {
            newHand.push(deck.pop());
        }
        return newHand;
    }
    
    function getUserBet(id, info) {
        if (players[id].bet != bet.fold) {
            var rand = Math.random();
            if (rand < .2) {
                return Math.random()*players[id].money;
            }
            else if (rand < .8) {
                return bet.call;
            }
            else {
                return bet.fold;
            }
        }
    }
    
    function getWinningId() {
        var winner;
        for (var i=0; i<turnOrder.length; i++) {
            var id = turnOrder[i];
            if (players[id].bet != bet.fold) {
                if (winner === undefined) {
                    winner = id;
                }
                else if (helper.compareHands(players[id].hand, players[winner].hand, tableCards)) {
                    winner = id;
                }
            }
        }
        return winner;
    }
    
    function endGame() {
        var winner = getWinningId();
        players[winner].money += pot;
        resetGame();
    }
    
    function resetGame() {
        deck = [];
        tableCards = [];
        for (var i=0; i<52; i++) {
            deck.push(helper.getCardName(i));
        }
        helper.shuffle(deck);
        
        currentPlayerIndex = 0;
        
        for (var i=0; i<turnOrder.length; i++) {
            var id = turnOrder[i];
            var player = players[id];
            player.bet = 0;
            tableBet = 0;
            pot = 0;
            player.hand = dealHand();
        }
    }
    
    return {
        getState : getState,
        addPlayer : addPlayer,
        getId : getId,
        setId : setId,
        update : update
    };
}

module.exports = Game;