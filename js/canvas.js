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
const planetsImgs = ["Black hole.png", "Planet1.png", "Planet2.png"];
const starsImgs   = ["Star.png", "Star2.png"];

function getRandomBgImg(type){
  var imgName = "";

  if (type === "star") {
    imgName = getRandomElement(starsImgs);
  }else {
    imgName = getRandomElement(planetsImgs);
  }

  return DOM.createImg("img/Background/" +  imgName);
}

/******************************************************************************/

Canvas.prototype.drawBackground = function(){
  const rand = getRandomNumber(0, 400);
  var randomImg  = null;
  var randomZoom = null;

  if (rand < 200) {
    randomImg  = getRandomBgImg("star");
    randomZoom = getRandomNumber(1/4, 1/2, true);
  }
  else if (rand > 395) {
    randomImg  = getRandomBgImg("planet");
    randomZoom = getRandomNumber(1/4, 2, true);
  }
  else {
    return ;
  }

  const randomXposition = getRandomNumber(0, canvasWidth - randomImg.width);
  const drawArgs = {
    img : randomImg,
    sx  : 0,
    sy  : 0,
    swidth  : randomImg.width,
    sheight : randomImg.height,
    x : randomXposition,
    y : -randomImg.height,
    width  : randomImg.width  * randomZoom,
    height : randomImg.height * randomZoom
  }

  const randomBackground = new MovingObject(new Vector(randomXposition, -randomImg.height), new Vector(0, 400), drawArgs);
  this.gameState.actors.unshift(randomBackground);

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
