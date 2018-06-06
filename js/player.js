const playerInitialPosition = new Vector(450,300);
const playerNormalSpeed     = new Vector(300,250);

const playerSprites = DOM.createImg("img/Ships/player.png");
const playerWidth  = 16;
const playerHeight = 24;
const imgZoomX = 4;
const imgZoomY = 3;
const playerSize = new Vector(playerWidth * imgZoomX, playerHeight * imgZoomY);

const laserBoltImg = DOM.createImg("img/Ships/laser-bolts.png");
/******************************************************************************/

//Return true if player still inside game box
function canMoveXAxis(newPosition){
  return newPosition.x >= 0 && newPosition.x + playerSize.x <= canvasWidth;
}
function canMoveYAxis(newPosition){
  return newPosition.y >= 0 && newPosition.y + playerSize.y <= canvasHeight;
}

/******************************************************************************/

const noMovingSx = playerWidth*2;
const noMovingSy = playerHeight;

const initialDrawArgs = {
  img : playerSprites,
  sx  : noMovingSx,
  sy  : noMovingSy,
  swidth  : playerWidth,
  sheight : playerHeight,
  x : playerInitialPosition.x,
  y : playerInitialPosition.y,
  width  : playerSize.x,
  height : playerSize.y
}

/******************************************************************************/

class Player extends MovingObject{
  constructor(position,speed,drawArgs){
    super(position,speed,drawArgs)
  }

  static create(){
    return new Player(playerInitialPosition, playerNormalSpeed, initialDrawArgs);
  }

}

/******************************************************************************/

Player.prototype.fireLaserBolt = function(){

  const laserBolt = new MovingObject();
  
}

Player.prototype.update = function(time){

  var position    = this.position;
  var newSpeed    = new Vector(0,0);
  var newDrawArgs = this.drawArgs;

  if (gameKeys["ControlLeft"]){

  }

  if (gameKeys["ArrowUp"]) {
    newSpeed.y = -playerNormalSpeed.y;
    /*use the 5 sprites on the top rather then the 5 on bottom if player click
     arrow up to have different animation*/
    newDrawArgs.sy = 0;
  }else {
    newDrawArgs.sy = noMovingSy;
  }

  if (gameKeys["ArrowDown"]) {
    newSpeed.y = playerNormalSpeed.y;
  }

  if (gameKeys["ArrowLeft"]) {
    //use other 2 sprites on the left to animate left mouvement
    if(this.drawArgs.sx > 0) newDrawArgs.sx -= playerWidth;
    newSpeed.x = -playerNormalSpeed.x;
  }

  if (gameKeys["ArrowRight"]) {
    //use other 2 sprites on the right to animate right mouvement
    if(this.drawArgs.sx < playerWidth * 4) newDrawArgs.sx += playerWidth;
    newSpeed.x = playerNormalSpeed.x;
  }

  /*Stop right moving and left moving animation if both ArrowRight key and
    ArrowLeft key are not pressed*/
  if (!gameKeys["ArrowRight"] && !gameKeys["ArrowLeft"])
    newDrawArgs.sx = noMovingSx;

  var movedX = position.plus( new Vector(newSpeed.x * time, 0) );
  //Upgrade position only if player didnt reach end of game border
  if ( canMoveXAxis(movedX) ){
    position = movedX;
    newDrawArgs.x = position.x;
  }
  var movedY = position.plus( new Vector(0, newSpeed.y * time) );
  if ( canMoveYAxis(movedY) ){
    position = movedY;
    newDrawArgs.y = position.y;
  }

  return new Player(position, newSpeed, newDrawArgs);
}

/******************************************************************************/
