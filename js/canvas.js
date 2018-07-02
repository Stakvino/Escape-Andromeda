
class Canvas {
  constructor(parent, gameState) {
    this.canvas = document.createElement("canvas");
    this.canvas.width  = canvasWidth;
    this.canvas.height = canvasHeight;
    this.ctx = this.canvas.getContext("2d");
    parent.appendChild(this.canvas);

    this.gameState = gameState;
  }

  clear(){
    this.ctx.clearRect(0,0,canvasWidth,canvasHeight);
  }

}

/******************************************************************************/
const explosionSprites = DOM.createImg("img/Ships/explosion.png");
const explosionDrawArgs = {
  img : explosionSprites,
  sx  : 0,
  sy  : 0,
  swidth  : 16,
  sheight : 16,
  x : 0,
  y : 0,
  width  : 0,
  height : 0
}

Canvas.prototype.drawExplode = function(time, movingObject){

  const drawArgs = copyObject(explosionDrawArgs);
  drawArgs.x  = movingObject.position.x ;
  drawArgs.y  = movingObject.position.y ;
  const spriteIndex = ( Math.floor( (1 - movingObject.takingDamage)/time )%5 );
  drawArgs.sx = spriteIndex * 16;
  drawArgs.width = movingObject.drawArgs.width/1.5;
  drawArgs.height = movingObject.drawArgs.height/1.5;

  this.ctx.drawImage( ...getDrawArgs(drawArgs) );
}

/******************************************************************************/

Canvas.prototype.drawActor = function (actor, transform){

  const drawArgs = copyObject(actor.drawArgs);

    if (transform !== null) {

      this.ctx.save();

      if (transform.flip) {
        this.ctx.scale(-1, 1);
      }

      this.ctx.globalAlpha = transform.alpha || 1;

      if (transform.rotation !== null) {

        const center = transform.rotation.center;
        drawArgs.x = -center.x;
        drawArgs.y = -center.y;

        this.ctx.translate(actor.position.x,actor.position.y);
        this.ctx.translate(center.x,center.y);

        this.ctx.rotate(transform.rotation.angle);
      }

    }

    this.ctx.drawImage( ...getDrawArgs(drawArgs) );

    this.ctx.restore();
}

/******************************************************************************/

Canvas.prototype.drawActors = function(time){

  const actors = cleanArray(this.gameState.actors);

  for (var i = 0; i < actors.length; i++) {
    const actor = actors[i];

    if(actor.type === "background" || actor.hp > 0){

      const transorm = {
          rotation : {angle : 0, center : new Vector(0, 0) },
          alpha    : 1,
          flip     : false
        };

      if(actor.type === "small enemy" ){
        transorm.rotation.angle  =  angleBetween(new Vector(0,0), actor.speed) - Math.PI/2;
        transorm.rotation.center =  new Vector(actor.drawArgs.width/2, actor.drawArgs.height/2);
      }
      else if (actor.type.includes("laser blast") ) {
        if (actor.type.includes("final boss") ) {
          actor.drawArgs.width = 150;
        }
      }
      else if (actor.type === "black hole") {
        transorm.rotation.angle = timeSum;
      }
      else if (actor.type === "final boss") {
        const phaseName = FBPhasesLoop[phaseNumber];
        transorm.alpha = phaseName === "shadow" ? 0.2 : 1;
        transorm.rotation.angle = actor.angle;
        transorm.rotation.center =  new Vector(actor.drawArgs.width/2, actor.drawArgs.height/2);
      }
      else if (actor.type === "player" && actor.shadowForm.isActive) {
        transorm.alpha = 0.2;
      }

      this.drawActor(actor, transorm);
    }
  }


  this.gameState.actors = this.gameState.actors.map(actor => {
                            if (actor && (actor.type === "charging blast" || actor.type.includes("laser blast") ) ) {
                              return null;
                            } else {
                              return actor;
                            }
                          });

  const explodingObjects = actors.filter(actor => actor.takingDamage > 0);

  for (var i = 0; i < explodingObjects.length; i++) {
    this.drawExplode(time, explodingObjects[i] );
  }

}

/******************************************************************************/

Canvas.prototype.drawActorBorder = function(actor, angle, style){
  if (actor) {
    this.ctx.rect(actor.position.x, actor.position.y, actor.drawArgs.width, actor.drawArgs.height);
    this.ctx.stroke();
  }
}

/******************************************************************************/
Canvas.prototype.update = function(time){
  this.clear();

  /*this.ctx.save();
  drawArgs.x = -drawArgs.width/2;
  drawArgs.y = -0;

  this.ctx.translate(position.x,position.y);
  this.ctx.translate(drawArgs.width/2,0);

  this.ctx.rotate(timeSum);

  this.ctx.drawImage( ...getDrawArgs(drawArgs) );

  this.ctx.restore();*/

  this.drawActors(time);
}
