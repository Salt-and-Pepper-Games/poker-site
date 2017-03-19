// copied from http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
var shuffle = function(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

var suitNames = ['clubs', 'hearts', 'spades', 'diamonds']
var faceCards = ['jack', 'queen', 'king', 'ace'];
var getCardName = function(i) {
    var cardNum = ((i % 13) + 2);
    if (cardNum > 10) {
        cardNum = faceCards[cardNum - 11];
    }
    return cardNum + " of " + suitNames[Math.floor(i/13)];
}

module.exports = {
    shuffle : shuffle,
    getCardName : getCardName
};