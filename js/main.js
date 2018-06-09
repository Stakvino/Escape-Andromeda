const player  = Player.create();
const enemy   = MediumEnemy.create(new Vector(300,-100) );
var gameState = new GameState("playing", [player,enemy]);
const canvas  = new Canvas(document.querySelector("div.game-window"), gameState);

runAnimation(function(timeStep){
  gameState = gameState.update(timeStep);
  canvas.update(timeStep);
},60);
