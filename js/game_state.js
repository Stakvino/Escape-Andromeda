class GameState {
  constructor(status, actors) {
    this.status = status;
    this.actors = actors;
  }
}
/******************************************************************************/
GameState.prototype.update = function(time){
  var actors = this.actors.map(function(actor){
    return actor.update(time);
  });

  var newStatus = this.status;

  return new GameState(newStatus, actors);
}
