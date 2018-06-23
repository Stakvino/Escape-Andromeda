const blackHoleImg  = DOM.createImg("img/Background/Black hole.png");

class BlackHole extends MovingObject {
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage, gravity) {
    super(position, speed, drawArgs, type, damage, hp, takingDamage, gravity);
    this.gravity = gravity;
  }

  static create(positionX){
          const speed = backgroundSpeed.times(0.5);
          var zoom    = 4;
          var gravity = 300;


          const drawWidth  = blackHoleImg.width  * zoom;
          const drawHeight = blackHoleImg.height  * zoom;
          const position   = new Vector(positionX, -drawHeight);

          const drawArgs = {
              img : blackHoleImg,
              sx  : 0,
              sy  : 0,
              swidth  : blackHoleImg.width,
              sheight : blackHoleImg.height,
              x : position.x,
              y : position.y,
              width  : drawWidth,
              height : drawHeight
            };


          return new BlackHole(position, speed, drawArgs, "black hole",
                                0, 1, 0, gravity);

  }

}

/******************************************************************************/

BlackHole.prototype.update = function(time, gameState){

  const newPosition = this.position.plus( this.speed.times(time) );

  if ( !this.isOutOfScreen() ){

    this.drawArgs.x = newPosition.x;
    this.drawArgs.y = newPosition.y;

    return new BlackHole(newPosition, this.speed, this.drawArgs,
                            "black hole", 0, 1, 0, this.gravity);
  }
  else {
    var actors = gameState.actors;
    actors[actors.indexOf(this)] = null;
  }

}
