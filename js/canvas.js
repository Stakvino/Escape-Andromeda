const canvasWidth  = 900;
const canvasHeight = 600;

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

Canvas.prototype.drawBackground = function(){

}

/******************************************************************************/

Canvas.prototype.drawActors = function(){
  var actors = this.gameState.actors.filter(function(actor){
                                              return actor !== undefined;
                                            });

  for (var i = 0; i < actors.length; i++) {
    this.ctx.drawImage( ...actors[i].getDrawArgs() );
  }

}

/******************************************************************************/
Canvas.prototype.update = function(){
  this.clear();
  this.drawBackground();
  this.drawActors();
}
