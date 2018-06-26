const player  = Player.create();
var gameState = new GameState("playing", [player]);
const canvas  = new Canvas(document.querySelector("div.game-window"), gameState);
beginGame();

var pressStartScreen = true;
var timeSum  = 0;

/******************************************************************************/

function beginGame(){

  renderState(1);
  runAnimation(function(timeStep){
    gameState = gameState.update(timeStep);
    if (gameState.status !== "lost") {
      canvas.update(timeStep);
    }
  },60);

}

/******************************************************************************/

function renderState(laserSpeed, hp = playerHp, shadowForm = playerShadowForm.remaining/100){

  DOM.removeChildren(healthContainer);
  DOM.removeChildren(shadowContainer);
  DOM.removeChildren(laserContainer);

  DOM.addBar("health", hp);
  DOM.addBar("shadow", shadowForm);
  DOM.addBar("laser speed", laserSpeed);

}

/******************************************************************************/

addEventListener("keydown",e => {

  if(pressStartScreen && e.key === "Enter"){

    setTimeout(() => {
      pressStartScreen = false;
    },5000);
  }

});
