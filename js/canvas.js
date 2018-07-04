
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
  drawArgs.x  = movingObject.position.x;
  if (movingObject.type.includes("laser") ) {
    drawArgs.y  = movingObject.position.y + ( movingObject.speed.y * time * 4 );
  }
  else {
    drawArgs.y  = movingObject.position.y;
  }

  const spriteIndex = ( Math.floor( (1 - movingObject.takingDamage)/time )%5 );
  drawArgs.sx = spriteIndex * 16;
  drawArgs.width = movingObject.drawArgs.width;
  drawArgs.height = movingObject.drawArgs.height;

  this.ctx.drawImage( ...getDrawArgs(drawArgs) );
}

/******************************************************************************/

Canvas.prototype.drawActor = function (actor, transform){

  const drawArgs = copyObject(actor.drawArgs);

  this.ctx.save();

  if (transform.flip) {
    this.ctx.scale(-1, 1);
  }

  this.ctx.globalAlpha = transform.alpha || 1;

  if (transform.rotation.angle) {
    const center = transform.rotation.center;
    drawArgs.x = -center.x;
    drawArgs.y = -center.y;

    this.ctx.translate(actor.position.x,actor.position.y);
    this.ctx.translate(center.x,center.y);

    this.ctx.rotate(transform.rotation.angle);
  }

  this.ctx.drawImage( ...getDrawArgs(drawArgs) );

  this.ctx.restore();
}

/******************************************************************************/
const drawnFirst = ["black hole", "background"];

Canvas.prototype.drawActors = function(time){

  this.gameState.actors = cleanArray(this.gameState.actors);
  var actors = [];

  for (var i = 0; i < this.gameState.actors.length; i++) {
    const actor = this.gameState.actors[i];
    if ( drawnFirst.includes(actor.type) ) {
      actors.unshift(actor);
    }else {
      actors.push(actor);
    }
  }

  for (var i = 0; i < actors.length; i++) {
    const actor = actors[i];

    if(actor.type === "background" || actor.hp > 0){

      var transform = Object.create(null);
      transform.rotation = Object.create(null);

      if(actor.type === "small enemy" ){
        transform.rotation.angle  =  angleBetween(new Vector(0,0), actor.speed) - Math.PI/2;
        transform.rotation.center =  new Vector(actor.drawArgs.width/2, actor.drawArgs.height/2);
      }
      else if (actor.type.includes("laser blast") ) {
        if (actor.type.includes("final boss") ) {
          actor.drawArgs.width = 150;
        }
      }
      else if (actor.type === "black hole") {
        transform.rotation.angle = timeSum;
        transform.rotation.center =  new Vector(actor.drawArgs.width/2, actor.drawArgs.height/2);
      }
      else if (actor.type === "final boss") {
        const phaseName = FBPhasesLoop[phaseNumber];
        transform.alpha = phaseName === "shadow" ? 0.2 : 1;
        if (actor.angle > 0) {
          transform.rotation.angle = actor.angle;
          transform.rotation.center =  new Vector(actor.drawArgs.width/2, actor.drawArgs.height/2);
        }
      }
      else if (actor.type === "player" && actor.shadowForm.isActive) {
        transform.alpha = 0.2;
      }

      this.drawActor(actor, transform);
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
  this.drawActors(time);
}
