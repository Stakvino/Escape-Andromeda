class GameState {
  constructor(status, actors) {
    this.status = status;
    this.actors = actors;
  }
}

/******************************************************************************/

GameState.prototype.update = function(time, gameState){

  var newState = this;

  var actors = [];

  this.actors = this.actors.filter(function(actor){
    return actor !== undefined;
  });

  for (var i = 0; i < this.actors.length; i++) {
    actors.push( this.actors[i].update(time, gameState) );
  }

  newState.actors = actors;
  return newState;
}
