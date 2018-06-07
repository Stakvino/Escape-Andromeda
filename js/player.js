const playerInitialPosition = new Vector(450,300);
const playerNormalSpeed     = new Vector(300,250);

const playerSprites = DOM.createImg("img/Ships/player.png");
const playerWidth  = 16;
const playerHeight = 24;
const imgZoomX = 4;
const imgZoomY = 3;
const playerSize = new Vector(playerWidth * imgZoomX, playerHeight * imgZoomY);

const laserBoltImg = DOM.createImg("img/Ships/laser-bolts.png");
var playerCanFire = 0;
/******************************************************************************/

const noMovingSx = playerWidth*2;
const noMovingSy = playerHeight;

const playerDrawArgs = {
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

const laserBoltDrawArgs = {
  img : laserBoltImg,
  sx  : 0,
  sy  : 16,
  swidth  : 16,
  sheight : 16,
  x : 0,
  y : 0,
  width  : 50,
  height : 50
}

/******************************************************************************/

class Player extends MovingObject{
  constructor(position, speed, drawArgs){
    super(position, speed, drawArgs);
    this.position = position;
    this.speed    = speed;
    this.drawArgs = drawArgs;
  }

  static create(){
    return new Player(playerInitialPosition, playerNormalSpeed, playerDrawArgs);
  }

}

/******************************************************************************/

Player.prototype.createLaserBolt = function(){

  const position = this.position.plus( new Vector(playerSize.x/8, -playerSize.y/4) );
  const drawArgs = copyObject(laserBoltDrawArgs);
  drawArgs.x = this.position.x;
  drawArgs.y = this.position.y;

  return new MovingObject(position, new Vector(0, -600), drawArgs);
}

Player.prototype.update = function(time, gameState){

  var position    = this.position;
  var newSpeed    = new Vector(0,0);
  var newDrawArgs = this.drawArgs;

  if (gameKeys["ControlLeft"] && playerCanFire%10 === 0){
    playerCanFire = 0;
    gameState.actors.push( this.createLaserBolt() );
  }
  playerCanFire++;

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
  if ( canMoveXAxis(movedX, playerSize) ){
    position = movedX;
    newDrawArgs.x = position.x;
  }
  var movedY = position.plus( new Vector(0, newSpeed.y * time) );
  if ( canMoveYAxis(movedY, playerSize) ){
    position = movedY;
    newDrawArgs.y = position.y;
  }

  return new Player(position, newSpeed, newDrawArgs);
}

/******************************************************************************/
