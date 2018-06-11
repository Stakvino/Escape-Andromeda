const player  = Player.create();
/*
const enemy1   = SmallEnemy.create(new Vector(300,-50), smallSpeed, 0.6, 600);
const enemy2   = SmallEnemy.create(new Vector(50,-50), smallSpeed, 0.6, 600);
const enemy3   = SmallEnemy.create(new Vector(600,-50), smallSpeed, 0.6, 600);
const enemy4   = MediumEnemy.create(new Vector(450,-50), mediumSpeed, 0.6, 600);
*/
const bigEnemy = BigEnemy.create(new Vector(-150, 0), bigSpeed, 2, 600);

var gameState = new GameState("playing", [player,bigEnemy]);
const canvas  = new Canvas(document.querySelector("div.game-window"), gameState);

setTimeout(function(){

  runAnimation(function(timeStep){
    gameState = gameState.update(timeStep);
    canvas.update(timeStep);
  },60);

},500);
