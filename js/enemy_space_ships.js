const smallEnemySprites  = DOM.createImg("img/Ships/enemy-small.png");
const mediumEnemySprites = DOM.createImg("img/Ships/enemy-medium.png");
const bigEnemySprites    = DOM.createImg("img/Ships/enemy-big.png");

/******************************************************************************/

const enemyZoomX = 3.5;
const enemyZoomY = 2.5;

/******************************************************************************/

const smallDrawArgs = {
  img : smallEnemySprites,
  sx  : 0,
  sy  : 0,
  swidth  : 16,
  sheight : 16,
  x : 0,
  y : 0,
  width  : 16 * enemyZoomX,
  height : 16 * enemyZoomX
}

const smallShipDamage = 1;
const smallHp = 1;
const smallSpeed = new Vector(250, 250);
/******************************************************************************/

class SmallEnemy extends SpaceShip{
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage, weapon){
    super(position, speed, drawArgs, type, damage, hp, takingDamage, weapon);
  }

  static create(positionX, speed, charingTime, laserSpeed){

    const weapon = {
      name    : "red bolt",
      isReady : true,
      timeBeforeReady : 0,
      charingTime     : charingTime,
      laserSpeed      : laserSpeed
    }

    const drawArgs = copyObject(smallDrawArgs);
    drawArgs.x = positionX;
    drawArgs.y = -50;

    return new SmallEnemy( new Vector(positionX, -50), smallSpeed, smallDrawArgs,
                           "small enemy",smallShipDamage, smallHp, 0, weapon );

  }

}

/******************************************************************************/

SmallEnemy.prototype.update = function(time, gameState){

  const player = gameState.getPlayer();

  if (this.takingDamage > 0){
    this.takingDamage -= time > this.takingDamage ? this.takingDamage : time;
  }

  if(this.hp === 0 || player === undefined){
    return this;
  }

  const angle = angleBetween(this.position, player.position);
  const speed = getVectorCord( vectorMagnitude(this.speed), angle);
  const laserSpeed = getVectorCord( this.weapon.laserSpeed, angle);

  this.fireGun(time, gameState,  laserSpeed );
  this.chargeWeapon(time);

  var newPosition = this.position;
  if (vectorMagnitude(player.position.plus(this.position.times(-1) ) ) > 200 ) {
    newPosition = this.position.plus( speed.times(time) );
  }


  if ( !this.isOutOfScreen() ){

    const drawArgs = copyObject(this.drawArgs);
    drawArgs.x  = newPosition.x;
    drawArgs.y  = newPosition.y;
    drawArgs.sx = drawArgs.sx === 0 ? 16 : 0;

    return new SmallEnemy(newPosition, speed, drawArgs, "small enemy",smallShipDamage ,
                           this.hp ,0 , this.weapon);
  }
  else {
    var actors = gameState.actors;
    actors[actors.indexOf(this)] = null;
  }

}

/******************************************************************************/

const mediumDrawArgs = {
  img : mediumEnemySprites,
  sx  : 0,
  sy  : 0,
  swidth  : 32,
  sheight : 16,
  x : 0,
  y : 0,
  width  : 32 * enemyZoomX,
  height : 16 * enemyZoomX
}

const mediumShipDamage = 2;
const mediumHp = 5;
const mediumSpeed = new Vector(600, 50);
/******************************************************************************/

class MediumEnemy extends SpaceShip{
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage, weapon){
    super(position, speed, drawArgs, type, damage, hp, takingDamage, weapon);
  }

  static create(positionX, speed, charingTime, laserSpeed){

    const weapon = {
      name    : "yellow bolt",
      isReady : true,
      timeBeforeReady : 0,
      charingTime     : charingTime,
      laserSpeed      : laserSpeed
    }

    const drawArgs = copyObject(mediumDrawArgs);
    drawArgs.x = positionX;
    drawArgs.y = -50;

    return new MediumEnemy( new Vector(positionX, -50), mediumSpeed, drawArgs,
                            "medium enemy",mediumShipDamage, mediumHp, 0, weapon);

  }

}

/******************************************************************************/

MediumEnemy.prototype.update = function(time, gameState){

  if (this.takingDamage > 0){
    this.takingDamage -= time > this.takingDamage ? this.takingDamage : time;
  }

  const player = gameState.getPlayer();

  if(this.hp === 0 || player === undefined){
    return this;
  }

  if (player.position.y < this.position.y) {
    this.fireGun(time, gameState,  new Vector(0, -this.weapon.laserSpeed) );
  }else {
    this.fireGun(time, gameState,  new Vector(0, this.weapon.laserSpeed) );
  }
  this.chargeWeapon(time);

  if (this.position.x <= 5 || this.position.x >= canvasWidth - this.drawArgs.width) {
    this.speed = new Vector(-this.speed.x, this.speed.y);
  }


  newPosition = this.position.plus( this.speed.times(time) );

  if ( !this.isOutOfScreen() ){
    const drawArgs = copyObject(this.drawArgs);
    drawArgs.x = newPosition.x;
    drawArgs.y = newPosition.y;
    drawArgs.sx = drawArgs.sx === 0 ? 32 : 0;

    return new MediumEnemy(newPosition, this.speed, drawArgs, "medium enemy",mediumShipDamage ,
                           this.hp ,0 , this.weapon);
  }
  else {
    var actors = gameState.actors;
    actors[actors.indexOf(this)] = null;
  }

}

/******************************************************************************/

const bigDrawArgs = {
  img : bigEnemySprites,
  sx  : 0,
  sy  : 0,
  swidth  : 32,
  sheight : 32,
  x : 0,
  y : 0,
  width  : 32 * enemyZoomX,
  height : 32 * enemyZoomX
}

const bigShipDamage = 3;
const bigHp = 15;
const bigSpeed = 200;
/******************************************************************************/

class BigEnemy extends SpaceShip{
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage, weapon){
    super(position, speed, drawArgs, type, damage, hp, takingDamage, weapon);
  }

  static create(positionX, speed, charingTime, laserSpeed){

    const weapon = {
      name    : "yellow blast",
      isReady : false,
      timeBeforeReady : 0,
      charingTime     : charingTime,
      laserSpeed      : laserSpeed
    }

    const drawArgs = copyObject(bigDrawArgs);
    drawArgs.x = positionX;
    drawArgs.y = -150;

    return new BigEnemy( new Vector(positionX, -150), new Vector(0, 0), drawArgs,
                         "big enemy",bigShipDamage, bigHp, 0, weapon );

  }

}

/******************************************************************************/

BigEnemy.prototype.update = function(time, gameState){


  if (this.takingDamage > 0){
    this.takingDamage -= time > this.takingDamage ? this.takingDamage : time;
  }

  const player = gameState.getPlayer();

  if(this.hp === 0 || player === undefined){
    return this;
  }

  var newPosition = this.position;
  var newSpeed    = new Vector(0, 0);

  //folow player
  if (this.position.x < player.position.x - 2) {
    newSpeed = newSpeed.plus( new Vector(bigSpeed, 0) );
  }
  if (this.position.x > player.position.x + 2) {
    newSpeed = newSpeed.plus( new Vector(-bigSpeed, 0) );
  }

  if (this.position.y > 5) {
    newSpeed = newSpeed.plus( new Vector(0, -bigSpeed) );
  }
  else if (this.position.y < 0) {
    newSpeed = newSpeed.plus( new Vector(0, bigSpeed) );
  }

  newPosition = newPosition.plus( newSpeed.times(time) );

  this.chargingBlust(time, gameState);
  this.fireBlust(time, gameState);

  if ( !this.isOutOfScreen() ){

    const drawArgs = copyObject(this.drawArgs);
    drawArgs.x = this.position.x
    drawArgs.y = this.position.y;
    drawArgs.sx = drawArgs.sx === 0 ? 32 : 0;

    return new BigEnemy(newPosition, newSpeed, drawArgs, "big enemy",mediumShipDamage ,
                           this.hp ,0 , this.weapon);

  }
  else {array[i]
    var actors = gameState.actors;
    actors[actors.indexOf(this)] = null;
  }

}

/******************************************************************************/

BigEnemy.prototype.chargingBlust = function(time, gameState){

  if(this.weapon.isReady)
    return ;

  const position = this.position.plus( new Vector(this.drawArgs.width/3.8, this.drawArgs.height/1.4) );

  const drawArgs = copyObject(laserBoltDrawArgs);
  drawArgs.x = position.x;
  drawArgs.y = position.y;
  drawArgs.width  += 20;
  drawArgs.height += 20;
  //draw yellow and red bolt to make charging laser naimation
  var redOrYellowBolt = null;
  if (this.weapon.charingTime < 0.8) {
    redOrYellowBolt = getRandomElement( ["red bolt", "yellow bolt"] );
  }else {
    redOrYellowBolt = "red bolt";
  }

  const chargingBlast = new MovingObject(position, new Vector(0, 0), drawArgs, "charging blast", 0, 1);
  drawArgs.sx = chargingBlast.getSpriteX(laserTypes[redOrYellowBolt].spriteIndex.x)*2 + 5 ;
  drawArgs.sy = chargingBlast.getSpriteY(laserTypes[redOrYellowBolt].spriteIndex.y);

  gameState.actors.push(chargingBlast);

  this.weapon.charingTime -= time;

  if(this.weapon.charingTime <= 0){
    this.weapon.charingTime = 0;
    this.weapon.isReady = true;
  }

}

/******************************************************************************/
const yellowBlastImg = DOM.createImg("img/Ships/yellow-blast.png");
const redBlastImg    = DOM.createImg("img/Ships/red-blast.png");

BigEnemy.prototype.fireBlust = function(time, gameState){

  if(!this.weapon.isReady)
    return ;

  const position = this.position.plus( new Vector(13, this.drawArgs.height - 2) );

  const redOrYellowImg = getRandomElement( [redBlastImg, yellowBlastImg] );

  const drawArgs = copyObject(laserBoltDrawArgs);
  drawArgs.img = redOrYellowImg;
  drawArgs.x = position.x;
  drawArgs.y = position.y;
  drawArgs.swidth  = 36;
  drawArgs.sheight = 47;
  drawArgs.width  = 100;
  drawArgs.height = 600;
  //draw yellow and red bolt to make charging laser naimation
  const laserBlast = new MovingObject(position, new Vector(0, 0), drawArgs, "laser blast", 3, 1);

  gameState.actors.push(laserBlast);

  this.weapon.charingTime += time;

  if(this.weapon.charingTime >= 2){
    this.weapon.charingTime = 2;
    this.weapon.isReady = false;
  }


}
