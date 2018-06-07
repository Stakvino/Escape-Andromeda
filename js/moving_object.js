class MovingObject {
  constructor(position,speed,drawArgs) {
    this.position = position;
    this.speed    = speed;
    this.drawArgs = drawArgs;
  }

  /*get sx of a given index : indexes depends on sprite position
    indexX = 0 & indexY = 1 => in the first sprite (X = 0) of the second line(Y = 1)*/
  getSpriteX(indexX){
    return this.drawArgs.swidth * indexX;
  }

  getSpriteY(indexY){
    return this.drawArgs.sheight * indexY;
  }
  //inverse of getSprite
  getSpriteIndex(){
    const drawArgs = this.drawArgs;
    return {x : drawArgs.sx /drawArgs.swidth,
            y : drawArgs.sy /drawArgs.sheight};
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

function objectOutOfScreen(newPosition, playerSize){

  return newPosition.x >= canvasWidth  || newPosition.x <= -playerSize.x
      || newPosition.y >= canvasHeight || newPosition.y <= -playerSize.y;
}

MovingObject.prototype.update = function(time, gameState){

  var newPosition = this.position.plus( this.speed.times(time) );

  if ( !objectOutOfScreen(newPosition, playerSize) ){
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
