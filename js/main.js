const gameWindow = document.querySelector("div.game-window");
const player  = Player.create();

var gameState = new GameState("playing", [player]);
const canvas  = new Canvas(gameWindow, gameState);

setTimeout(() => {
  document.querySelector(".game-window").style.display = "block";
  beginGame();
},500);

var pressStartScreen = true;
var tutorialIsDone   = false;
var storyIsTold  = false;
var isCuttScene  = false;
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
  playerWeapon.charingTime = 0.25 - ( 0.05 * levelNumber );
}

/******************************************************************************/

addEventListener("keydown",e => {

  if(pressStartScreen && e.key === "Enter"){
    pressStartScreen = false;
    removeTitleScreen();
    const delay = 4000;
    const levelName = levels[levelNumber][0]
    setTimeout( () => DOM.renderMessage(`level 1`, levelName, 4000), 6000);
    setTimeout(() => {
      const tutorialMessage = `use <span class="important-message">arrow keys</span> to <span class="important-message">move</span> around <br> press <span class="important-message">"Q"</span> to <span class="important-message">fire</span> laser`;
      setTimeout( () => DOM.renderMessage(``, tutorialMessage, delay*2), delay);
    },delay*2);
  }

});

/******************************************************************************/

function removeTitleScreen(){
  screenMessage.classList.remove("slow-flashes");
  screenMessage.classList.add("fast-flashes");
  setTimeout( () => {
    screenMessage.classList.remove("fast-flashes");
    setTimeout( () => {
      screenTitle.style.opacity   = "0";
      screenMessage.style.opacity = "0";
    },500);
  },500 );
}
