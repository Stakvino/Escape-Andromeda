const player  = Player.create();
var gameState = new GameState("playing", [player]);
const canvas  = new Canvas(document.querySelector("div.game-window"), gameState);

/******************************************************************************/
var timeSum = 0;
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
