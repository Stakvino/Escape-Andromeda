const player  = Player.create();
const enemy   = SmallEnemy.create(new Vector(300,-50), mediumSpeed, 0.6, 600);
var gameState = new GameState("playing", [player,enemy]);
const canvas  = new Canvas(document.querySelector("div.game-window"), gameState);

setTimeout(function(){

  runAnimation(function(timeStep){
    gameState = gameState.update(timeStep);
    canvas.update(timeStep);
  },60);

},500);
