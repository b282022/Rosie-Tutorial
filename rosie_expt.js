var Factory = require("rosie").Factory;

var gameFactory = Factory.define('game')
  .sequence('id')
  .attr('isOver', false)
  .attr('startDate', function () {
    return new Date();
  })
  .attr('randomSeed', () => Math.random())
  .attr('players', ['players'], function (players){
    if (!players) {
      players = [{}, {}];
    }
    return players.map(function(data) {
      return Factory.attributes('player', data)
    })
  })

var playerFactory = Factory.define('player')
  /*
  * Starts a sequence with sequence number 1 and increments the sequence
  * number each time a new object is built out of this `Factory`
  */
  .sequence('id')
  /*
  * The first argument passed to the generator function if the attribute's type
  * is sequence is the pre-incremented sequence number
  */
  .sequence('name', function(i) {
    return 'player ' + i;
  })

var player1 = Factory.build('player');
var player2 = Factory.build('player');
var player3 = Factory.build('player');

var game = Factory.build('game', {'players': [player1, player2, player3]});
var game2 = Factory.build('game');

Factory.define('mathematics')
  .sequence('id')
  .attr("a")
  .attr("b")
  .attr("addition", function () {
    /* Generator function returns a function, which will be stored in the
    * property `addition` of the object that gets built.
    * Hence, through this, we can even assign methods to the object that gets
    * built from the `Factory`
    */
    return function(a, b) {
      return a + b;
    }
  })
  .attr("subtraction", function() {
    return function(a, b) {
      return a - b;
    }
  })
  /* Generator function has dependency of a and b
  * So, if at the time the object was built from factory, if they are not
  * present, then we can produce some exceptions, which can be used in testing
  * later.
  */
  .attr("multiplication", ["a", "b"], function (a, b) {
    return function() {
      if (!a || !b) {
          throw new Error("Require object properties a and b");
      }
      return a * b;
    }
  })

var mathObject = Factory.build('mathematics')
console.log(mathObject.addition(5, 2));
console.log(mathObject.subtraction(5, 3));
try {
  console.log(mathObject.multiplication());
} catch (e)  {
  console.error(e.message);
}
mathObject.a = 2;
mathObject.b = 3;
try {
  console.log(mathObject.multiplication());
} catch (e) {
  console.error(e.message);
}

var mathObject = Factory.build('mathematics', {'a' : 2, 'b' : 3});
console.log(mathObject.multiplication());
