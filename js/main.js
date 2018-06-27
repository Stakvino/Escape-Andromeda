const player  = Player.create();
var gameState = new GameState("playing", [player]);
const canvas  = new Canvas(document.querySelector("div.game-window"), gameState);
setTimeout(() => beginGame(),200);

var pressStartScreen = true;
var tutorialIsDone   = false;
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
    removeTitleScreen();
    const delay = 4000;
    setTimeout( () => DOM.renderMessage(`level ${levelNumber+1}`, levels[levelNumber][0], delay), delay);
    setTimeout(() => {
      pressStartScreen = false;
      const tutorialMessage = `use arrow keys to move around <br> press <span class="important-message">"Q"</span> to fire laser`;
      setTimeout( () => DOM.renderMessage(``, tutorialMessage, 8000), 4000);
    },8000);
  }

});

/******************************************************************************/

function removeTitleScreen(){
  screenMessage.classList.remove("slow-flashes");
  screenMessage.classList.add("fast-flashes");
  setTimeout( () => {
    screenMessage.classList.remove("fast-flashes");
    screenTitle.style.opacity   = "0";
    screenMessage.style.opacity = "0";
  },500 );
}
