
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

Canvas.prototype.drawWithRotation = function (actor, degrees){

    const drawArgs = copyObject(actor.drawArgs);
    drawArgs.x = -actor.drawArgs.width/2;
    drawArgs.y = -actor.drawArgs.height/2;

    //context.clearRect(0,0,canvas.width,canvas.height);
    this.ctx.save();
    this.ctx.translate(actor.position.x,actor.position.y);
    this.ctx.translate(actor.drawArgs.width/2,actor.drawArgs.height/2);

    this.ctx.rotate(degrees);

    this.ctx.drawImage( ...getDrawArgs(drawArgs) );

    this.ctx.restore();
}

/******************************************************************************/

Canvas.prototype.drawActors = function(time){

  const actors = cleanArray(this.gameState.actors);

  for (var i = 0; i < actors.length; i++) {

    if(actors[i].type === "background" || actors[i].hp > 0){

      if(actors[i].type === "small enemy"){
        const angle =  angleBetween(new Vector(0,0), actors[i].speed) - Math.PI/2;
        debugger;
        this.drawWithRotation(actors[i], angle);
      }
      else{
        this.ctx.drawImage( ...getDrawArgs(actors[i].drawArgs) );
      }

    }

  }

  const explodingObjects = actors.filter(actor => actor.takingDamage > 0);

  for (var i = 0; i < explodingObjects.length; i++) {
    this.drawExplode(time, explodingObjects[i] );
  }

}

/******************************************************************************/

Canvas.prototype.drawActorBorder = function(actor){
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
