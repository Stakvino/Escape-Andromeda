class SpaceShip extends MovingObject {
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage, weapon) {
    super(position, speed, drawArgs, type, damage, hp, takingDamage, weapon);
    this.weapon      = weapon;
  }
}

/******************************************************************************/

const laserBoltImg = DOM.createImg("img/Ships/laser-bolts.png");

const laserTypes = {
  "yellow bolt" : {spriteIndex : {x : 0, y : 0}, damage : 1},
  "red bolt"    : {spriteIndex : {x : 1, y : 0}, damage : 3},
  "blue laser"  : {spriteIndex : {x : 0, y : 1}, damage : 1}
}

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

SpaceShip.prototype.createLaserBolt = function(direction){

  const position = this.position.plus( new Vector(playerSize.x/8, -playerSize.y/2) );
  const speed    = direction === "up" ? new Vector(0, -600) : new Vector(0, 600);

  const drawArgs = copyObject(laserBoltDrawArgs);
  drawArgs.x = position.x + drawArgs.width/2;
  drawArgs.y = direction === "up" ? position.y - drawArgs.height/2 : position.y + drawArgs.height/2;
  var damage = 0;

  if (this.weapon.name === "red bolt") {
    damage = 3;
  }else {
    damage = 1;
  }

  const laserBolt = new MovingObject(position, speed, drawArgs, this.weapon.name, damage, 1);
  drawArgs.sx = laserBolt.getSpriteX(laserTypes[this.weapon.name].spriteIndex.x);
  drawArgs.sy = laserBolt.getSpriteY(laserTypes[this.weapon.name].spriteIndex.y);

  return laserBolt;
}

/******************************************************************************/

SpaceShip.prototype.fireGun = function(time, gameState, direction){

  const weapon = this.weapon;

  if (weapon.isReady){
    weapon.timeBeforeReady  = weapon.charingTime;
    weapon.isReady = false;
    gameState.actors.push( this.createLaserBolt(direction) );
  }

  if(weapon.timeBeforeReady > 0){
    weapon.timeBeforeReady -= time;
  }else {
    weapon.isReady = true;
    weapon.timeBeforeReady = 0;
  }

}
