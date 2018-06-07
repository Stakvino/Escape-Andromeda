const playerInitialPosition = new Vector(450,300);
const playerNormalSpeed     = new Vector(500,400);

const playerSprites = DOM.createImg("img/Ships/player.png");
const playerWidth  = 16;
const playerHeight = 24;
const imgZoomX = 4;
const imgZoomY = 3;
const playerSize = new Vector(playerWidth * imgZoomX, playerHeight * imgZoomY);

/******************************************************************************/
const playerDrawArgs = {
  img : playerSprites,
  sx  : playerWidth*2,
  sy  : playerHeight,
  swidth  : playerWidth,
  sheight : playerHeight,
  x : playerInitialPosition.x,
  y : playerInitialPosition.y,
  width  : playerSize.x,
  height : playerSize.y
}


const laserBoltImg = DOM.createImg("img/Ships/laser-bolts.png");

const laserTypeIndex = {
  "yellow bolt" : {x : 0, y : 0},
  "red bolt"    : {x : 1, y : 0},
  "blue laser"  : {x : 0, y : 1}
}

var playerCanFire = 0;
const laserBoltDrawArgs = {
  img : laserBoltImg,
  sx  : 0,
  sy  : 0,
  swidth  : 16,
  sheight : 16,
  x : 0,
  y : 0,
  width  : 50,
  height : 50
}

/******************************************************************************/

class Player extends MovingObject{
  constructor(position, speed, drawArgs, weapon){
    super(position, speed, drawArgs);
    this.weapon = weapon;
  }

  static create(){
    return new Player(playerInitialPosition, playerNormalSpeed, playerDrawArgs, "blue laser");
  }

}

/******************************************************************************/

//Return true if Player still inside game box
function canMoveXAxis(newPosition, size){
  return newPosition.x >= 0 && newPosition.x + size.x <= canvasWidth;
}
function canMoveYAxis(newPosition, size){
  return newPosition.y >= 0 && newPosition.y + size.y <= canvasHeight;
}

/******************************************************************************/

Player.prototype.createLaserBolt = function(){

  const position = this.position.plus( new Vector(playerSize.x/8, -playerSize.y/4) );
  const drawArgs = copyObject(laserBoltDrawArgs);
  drawArgs.x = position.x;
  drawArgs.y = position.y;

  const laserBolt = new MovingObject(position, new Vector(0, -600), drawArgs);
  drawArgs.sx = laserBolt.getSpriteX(laserTypeIndex[this.weapon].x);
  drawArgs.sy = laserBolt.getSpriteY(laserTypeIndex[this.weapon].y);

  return laserBolt;
}

/******************************************************************************/

Player.prototype.update = function(time, gameState){

  var position    = this.position;
  var newSpeed    = new Vector(0,0);
  var newDrawArgs = this.drawArgs;
  var newWeapon   = this.weapon;

  if (gameKeys["ControlLeft"] && playerCanFire%10 === 0){
    playerCanFire = 0;
    gameState.actors.push( this.createLaserBolt() );
  }
  playerCanFire++;

  if (gameKeys["ArrowUp"]) {
    newSpeed.y = -playerNormalSpeed.y;
    /*use the 5 sprites on the top rather then the 5 on bottom if player click
      arrow up to have different animation*/
    newDrawArgs.sy = this.getSpriteY(0);
  }else {
    newDrawArgs.sy = this.getSpriteY(1);
  }

  if (gameKeys["ArrowDown"]) {
    newSpeed.y = playerNormalSpeed.y;
  }

  if (gameKeys["ArrowLeft"]) {
    //use other 2 sprites on the left to animate left mouvement
    var spriteXindex = this.getSpriteIndex().x;
    if(spriteXindex > 0) newDrawArgs.sx = this.getSpriteX(--spriteXindex);
    newSpeed.x = -playerNormalSpeed.x;
  }

  if (gameKeys["ArrowRight"]) {
    //use other 2 sprites on the right to animate right mouvement
    var spriteXindex = this.getSpriteIndex().x;
    if(spriteXindex < 4) newDrawArgs.sx = this.getSpriteX(++spriteXindex);
    newSpeed.x = playerNormalSpeed.x;
  }

  /*Stop right moving and left moving animation if both ArrowRight key and
    ArrowLeft key are not pressed*/
  if (!gameKeys["ArrowRight"] && !gameKeys["ArrowLeft"])
    newDrawArgs.sx = this.getSpriteX(2);

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

  return new Player(position, newSpeed, newDrawArgs, newWeapon);
}

/******************************************************************************/
