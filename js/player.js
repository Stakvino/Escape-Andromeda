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
  sy  : playerHeight ,
  swidth  : playerWidth,
  sheight : playerHeight - 1,
  x : playerInitialPosition.x,
  y : playerInitialPosition.y,
  width  : playerSize.x,
  height : playerSize.y
}

var playerCanFire = 0;
const playerShipDamage = 3;
const playerHp = 3;
/******************************************************************************/

class Player extends SpaceShip{
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage, weapon){
    super(position, speed, drawArgs, type, damage, hp, takingDamage, weapon);
  }

  static create(){
    const weapon = {
      name    : "blue laser",
      heat    : 20,
      isReady : true
    }
    return new Player(playerInitialPosition, playerNormalSpeed, playerDrawArgs,
                      "player", playerShipDamage, playerHp, 0, weapon);
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
const weaponNormalHeat = 20;
const weaponMaxHeat    = 30;

Player.prototype.update = function(time, gameState){

  var position     = this.position;
  var newSpeed     = new Vector(0,0);
  var newDrawArgs  = this.drawArgs;
  var newHp        = this.hp;
  var takingDamage = this.takingDamage;

  const weapon = {
    name    : this.weapon,
    heat    : this.weaponHeat,
    isReady : this.weaponReady
  }

  if (takingDamage > 0){
    takingDamage -= time > takingDamage ? takingDamage : time;
  }

  if (gameKeys["ControlLeft"] && weapon.isReady){
    weapon.heat  = weaponMaxHeat;
    weapon.isReady = false;
    gameState.actors.push( this.createLaserBolt() );
  }

  if(weapon.heat > weaponNormalHeat){
    //decrease weapon heat with time untill it reaches the normal tempreture
    weapon.heat -= weapon.heat >= weaponNormalHeat + 1 ? 1 : weapon.heat - weaponNormalHeat;
  }else {
    weapon.isReady = true;
  }


  if (gameKeys["ArrowUp"]) {
    newSpeed.y = -playerNormalSpeed.y;
    /*use the 5 sprites on the top rather then the 5 on bottom if player click
      arrow up to have different animation*/
    newDrawArgs.sy = this.getSpriteY(0);
    backgroundSpeed.y = 400;
  }else {
    newDrawArgs.sy = this.getSpriteY(1);
    backgroundSpeed.y = 200;
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


  return new Player(position, newSpeed, newDrawArgs, this.type, this.damage,
                    newHp, takingDamage, weapon);
}

/******************************************************************************/
