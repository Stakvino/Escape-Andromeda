const player  = Player.create();

const enemy1   = SmallEnemy.create(new Vector(300,-50), smallSpeed, 0.6, 600);
const enemy2   = SmallEnemy.create(new Vector(50,-50), smallSpeed, 0.6, 600);
const enemy3   = SmallEnemy.create(new Vector(600,-50), smallSpeed, 0.6, 600);
const enemy4   = MediumEnemy.create(new Vector(450,-50), mediumSpeed, 0.6, 600);

const bigEnemy = BigEnemy.create(new Vector(-150, 0), bigSpeed, 2, 600);
/******************************************************************************/

var gameState = new GameState("playing", [player,enemy1,enemy2,enemy3,enemy4,bigEnemy]);
const canvas  = new Canvas(document.querySelector("div.game-window"), gameState);
generateRessource("shadow", gameState.actors);
/******************************************************************************/

setTimeout(function(){
  renderState(playerHp, playerShadowForm.remaining/100, 1);
  runAnimation(function(timeStep){
    gameState = gameState.update(timeStep);
    canvas.update(timeStep);
  },60);

},500);

/******************************************************************************/

function renderState(hp, shadowForm, laserSpeed){

  DOM.removeChildren(healthContainer);
  DOM.removeChildren(shadowContainer);
  DOM.removeChildren(laserContainer);

  DOM.addBar("health", hp);
  DOM.addBar("shadow", shadowForm);
  DOM.addBar("laser speed", laserSpeed);

}
