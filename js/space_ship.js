class SpaceShip extends MovingObject {
  constructor(position, speed, drawArgs, damage, type, hp, takingDamage, weapon) {
    super(position, speed, drawArgs, damage, type, hp, takingDamage, weapon);
    this.weapon = weapon;
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

SpaceShip.prototype.createLaserBolt = function(){

  const position = this.position.plus( new Vector(playerSize.x/8, -playerSize.y/4) );
  const drawArgs = copyObject(laserBoltDrawArgs);
  drawArgs.x = position.x;
  drawArgs.y = position.y;
  var damage = 0;

  if (this.weapon === "red bolt") {
    damage = 3;
  }else {
    damage = 1;
  }

  const laserBolt = new MovingObject(position, new Vector(0, -600), drawArgs, damage, this.weapon);
  drawArgs.sx = laserBolt.getSpriteX(laserTypes[this.weapon].spriteIndex.x);
  drawArgs.sy = laserBolt.getSpriteY(laserTypes[this.weapon].spriteIndex.y);

  return laserBolt;
}
