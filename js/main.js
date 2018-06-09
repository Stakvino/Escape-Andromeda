const player  = Player.create();
var gameState = new GameState("playing", [player]);
const canvas  = new Canvas(document.querySelector("div.game-window"), gameState);

runAnimation(function(timeStep){
  gameState = gameState.update(timeStep);
  canvas.update(timeStep);
},60);
