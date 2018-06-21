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

GameState.prototype.update = function(time){

  var newState = this;
  this.actors = cleanArray(this.actors);
  var updatedActors = [];

  this.actors = this.actors.filter(actor => {
    return actor.type === "background" || actor.hp > 0 || actor.takingDamage > 0;
  });

  for (var i = 0; i < this.actors.length; i++) {
    updatedActors.push( this.actors[i].update(time, this) );
  }

  updateCollisions(updatedActors);
  generateBackground(updatedActors);

  timeSum += time;
  timeSum  = Number( timeSum.toFixed(2) );

  const wave = levels[levelNumber][waveNumber] || levels[levelNumber][0];
  const lastElement = wave[ wave.length - 1 ];

  if( Number.isInteger(timeSum/4) ){

    generateLevel(levels[levelNumber], updatedActors);

    if ( waveNumber === (levels[levelNumber].length ) &&  waveFinished(this.actors, wave) ) {
      waveNumber = -1;
      levelNumber++;
    }

  }

  if ( lastElement.includes("RM") ) {
    generateRandomMeteors( updatedActors, /\d+/.exec(lastElement)[0] );
  }


  newState.actors = updatedActors;
  return newState;
}
