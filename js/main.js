const player  = Player.create();
const enemy   = MediumEnemy.create(new Vector(300,-50), mediumSpeed, 0.6, new Vector(0,600) );
var gameState = new GameState("playing", [player,enemy]);
const canvas  = new Canvas(document.querySelector("div.game-window"), gameState);

runAnimation(function(timeStep){
  gameState = gameState.update(timeStep);
  canvas.update(timeStep);
},60);
