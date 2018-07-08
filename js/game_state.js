class GameState {
  constructor(status, actors) {
    this.status = status;
    this.actors = actors;
  }
  getPlayer(){
    return getAllActorsWithTypes(this.actors, "player")[0];
  }

}


/******************************************************************************/

function getAllActorsWithTypes(actors, ...types){

  actors = cleanArray(actors);
  var   result = [];

  for (var i = 0; i < types.length; i++) {
    result = result.concat( actors.filter(actor => actor.type.includes(types[i]) ) );
  }

  return result;
}

/******************************************************************************/

function getAllActorsExept(actors, ...types){
  actors = cleanArray(actors);
  var   result = actors;

  for (var i = 0; i < types.length; i++) {
    result = result.filter( actor => actor.type !== types[i] );
  }

  return result;
}

/******************************************************************************/
var levelNumber = 0;
var endingTime  = 0;

GameState.prototype.update = function(time){

  var newState = this;
  this.actors = cleanArray(this.actors);
  var updatedActors  = [];

  this.actors = this.actors.filter(actor => {
    return actor.type === "background" || actor.hp > 0 || actor.takingDamage > 0;
  });

  for (var i = 0; i < this.actors.length; i++) {
    if (!updatedActors.includes(this.actors[i]) ) {
      updatedActors.push( this.actors[i].update(time, this) );
    }
  }

  updateCollisions(updatedActors);
  generateBackground(updatedActors);

  timeSum += time;
  timeSum  = Number( timeSum.toFixed(2) );

  if (levelNumber >= levels.length){
    //play pok audio
    newState.actors = updatedActors;
    const playerStopedMoving = endingCutScene(time, newState);

    if (playerStopedMoving && newState.status === "playing") {

      newState.status = "end";

      DOM.renderMessage("mission accomplished", "you survived the enemy and now you can get back home to deliver the message...",8000);
      setTimeout(() => {
        DOM.renderMessage("thx for playing", "to be continued...",1000*60);
      },1000*12);

    }

    return newState;
  }

  const wave = levels[levelNumber][waveNumber] || levels[levelNumber][0];
  const lastElement = wave[ wave.length - 1 ];

  if( ( Number.isInteger(timeSum/4) && endingTime === 0 && !pressStartScreen )
    || ( wave[0] === "T" && tutorialIsDone ) || ( wave[0] === "C" && storyIsTold ) ){

    generateLevel(levelNumber, updatedActors);

    if ( waveNumber === ( levels[levelNumber].length ) &&  waveFinished(updatedActors, wave) ) {
      waveNumber = 0;
      levelNumber++;

      if (levelNumber < levels.length) {
        var title = `level ${levelNumber+1}`;
        const message = levels[levelNumber][0];

        if(levelNumber === levels.length - 1) title = "boss";
        DOM.renderMessage(title,message , 4000);
      }

    }

  }

  if ( lastElement.includes("RM") ) {
    generateRandomMeteors( updatedActors, /\d+/.exec(lastElement)[0] );
  }


  newState.actors = updatedActors;
  const player = this.getPlayer();

  if(!player){
    newState.status = "lost";

    if(endingTime === 0)
      DOM.renderMessage("",`<span class="wasted">wasted</span>`,2000);

    endingTime+=time;
    const remainingActors = getAllActorsExept(this.actors, "background");
    if (this.actors.length ) {
      this.actors = [];
    }
  }

  if (endingTime >= 3) {
    renderState(levelNumber + 1);
    endingTime  = 0;
    waveNumber  = 0;
    phaseNumber = 0;
    boltPositionX = 0;
    const newPlayer = Player.create();
    newState.actors.push(newPlayer);
    newState.status = "playing";

    var title = `level ${levelNumber+1}`;
    const message = levels[levelNumber][0];

    if(levelNumber === levels.length - 1) title = "boss";
    DOM.renderMessage(title,message , 4000);
  }

  return newState;
}

/******************************************************************************/

function endingCutScene(time, gameState){

  isCuttScene  = true;
  const playerPosition   = gameState.getPlayer().position;
  const previousPosition = new Vector(playerPosition.x, playerPosition.y);
  const drawArgs = gameState.getPlayer().drawArgs;

  if (playerPosition.x < ( canvasWidth/2 ) - 5) {
    playerPosition.x++;
  }
  else if (playerPosition.x > ( canvasWidth/2 ) + 5) {
    playerPosition.x--;
  }

  if (playerPosition.y < ( 5*canvasHeight/6 ) - 5 ) {
    playerPosition.y++;
  }
  else if (playerPosition.y > ( 5*canvasHeight/6) + 5 )  {
    playerPosition.y--;
  }

  drawArgs.x = playerPosition.x;
  drawArgs.y = playerPosition.y;


  return previousPosition.x === playerPosition.x && previousPosition.y === playerPosition.y;
}
