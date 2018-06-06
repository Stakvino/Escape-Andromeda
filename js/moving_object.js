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

MovingObject.prototype.update = function(time){

  var newPosition = this.position.plus( this.speed.times(time) );
  var newDrawArgs = this.drawArgs;
  newDrawArgs.x = newPosition.x;
  newDrawArgs.y = newPosition.y;

  return new MovingObject(newPosition, this.speed, newDrawArgs);
}
