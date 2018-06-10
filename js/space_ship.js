class SpaceShip extends MovingObject {
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage, weapon) {
    super(position, speed, drawArgs, type, damage, hp, takingDamage, weapon);
    this.weapon      = weapon;
  }
}

/******************************************************************************/

const laserBoltImg = DOM.createImg("img/Ships/laser-bolts.png");

const laserTypes = {
  "yellow bolt" : {spriteIndex : {x : 0, y : 0}, damage : 2},
  "red bolt"    : {spriteIndex : {x : 1, y : 0}, damage : 1},
  "blue laser"  : {spriteIndex : {x : 0, y : 1}, damage : 1}
}

const laserBoltDrawArgs = {
  img : laserBoltImg,
  sx  : 0,
  sy  : 0,
  swidth  : 7,
  sheight : 14,
  x : 0,
  y : 0,
  width  : 30,
  height : 50
}

/******************************************************************************/

SpaceShip.prototype.createLaserBolt = function(speed){

  const position = this.position.plus( new Vector(this.drawArgs.width/4, 0) );
  //fire from bottom of sprite if spaceship going to the bottom "vice v".
  position.y += speed.y > 0 ? this.drawArgs.height/1.5 : -this.drawArgs.height/1.5;

  const drawArgs = copyObject(laserBoltDrawArgs);
  drawArgs.x = position.x;
  drawArgs.y = position.y;
  var damage = 0;

  damage = laserTypes[this.weapon.name].damage;

  const laserBolt = new MovingObject(position, speed, drawArgs, this.weapon.name, damage, 1);
  drawArgs.sx = laserBolt.getSpriteX(laserTypes[this.weapon.name].spriteIndex.x)*2 + 5 ;
  drawArgs.sy = laserBolt.getSpriteY(laserTypes[this.weapon.name].spriteIndex.y);

  return laserBolt;
}

/******************************************************************************/

SpaceShip.prototype.fireGun = function(time, gameState, speed){

  const weapon = this.weapon;

  if (weapon.isReady){
    weapon.timeBeforeReady  = weapon.charingTime;
    weapon.isReady = false;
    gameState.actors.push( this.createLaserBolt(speed) );
  }

  if(weapon.timeBeforeReady > 0){
    weapon.timeBeforeReady -= time;
  }else {
    weapon.isReady = true;
    weapon.timeBeforeReady = 0;
  }

}
