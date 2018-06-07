class MovingObject {
  constructor(position,speed,drawArgs) {
    this.position = position;
    this.speed    = speed;
    this.drawArgs = drawArgs;
  }

  getDrawArgs(){
    var drawArgsArray = [];

    for(var prop in this.drawArgs){
      drawArgsArray.push( this.drawArgs[prop] );
    }

    return drawArgsArray;
  }

}

/******************************************************************************/

MovingObject.prototype.update = function(time, gameState){

  var newPosition = this.position.plus( this.speed.times(time) );

  if ( canMoveXAxis(newPosition, playerSize) && canMoveYAxis(newPosition, playerSize) ){
    var newDrawArgs = this.drawArgs;
    newDrawArgs.x = newPosition.x;
    newDrawArgs.y = newPosition.y;
    return new MovingObject(newPosition, this.speed, newDrawArgs);
  }
  else {
    var actors = gameState.actors;
    actors[actors.indexOf(this)] = null;
  }

}

/******************************************************************************/

//Return true if Object still inside game box
function canMoveXAxis(newPosition, size){
  return newPosition.x >= 0 && newPosition.x + size.x <= canvasWidth;
}
function canMoveYAxis(newPosition, size){
  return newPosition.y >= 0 && newPosition.y + size.y <= canvasHeight;
}
