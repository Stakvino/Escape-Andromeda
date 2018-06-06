const player = Player.create();
const gameState = new GameState("playing",[player]);
const canvas = new Canvas(document.querySelector("div.game-window"), gameState);

runAnimation(function(timeStep){
  canvas.gameState = canvas.gameState.update(timeStep);
  canvas.update();
},60);
