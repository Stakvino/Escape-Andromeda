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

  static create(position, speed, charingTime, laserSpeed){

    const weapon = {
      name    : "red bolt",
      isReady : true,
      timeBeforeReady : 0,
      charingTime     : charingTime,
      laserSpeed      : laserSpeed
    }

    return new SmallEnemy(position, smallSpeed, smallDrawArgs, "small enemy",
                            smallShipDamage, smallHp, 0, weapon);

  }

}

/******************************************************************************/

SmallEnemy.prototype.update = function(time, gameState){

  const playerPosition = gameState.getPlayer().position;

  const angle = angleBetween(this.position, playerPosition);
  const speed = getVectorCord( vectorMagnitude(this.speed), angle);
  const laserSpeed = getVectorCord( this.weapon.laserSpeed, angle);

  if (this.takingDamage > 0){
    this.takingDamage -= time > this.takingDamage ? this.takingDamage : time;
  }

  if(this.hp === 0){
    return this;
  }


  this.fireGun(time, gameState,  laserSpeed );

  var newPosition = this.position;
  if (vectorMagnitude(playerPosition.plus(this.position.times(-1) ) ) > 100 ) {
    newPosition = this.position.plus( speed.times(time) );
  }


  if ( !this.isOutOfScreen() ){

    const drawArgs = copyObject(smallDrawArgs);
    drawArgs.x = newPosition.x;
    drawArgs.y = newPosition.y;

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

  static create(position, speed, charingTime, laserSpeed){

    const weapon = {
      name    : "yellow bolt",
      isReady : true,
      timeBeforeReady : 0,
      charingTime     : charingTime,
      laserSpeed      : laserSpeed
    }

    return new MediumEnemy(position, mediumSpeed, mediumDrawArgs, "medium enemy",
                            mediumShipDamage, mediumHp, 0, weapon);

  }

}

/******************************************************************************/

MediumEnemy.prototype.update = function(time, gameState){

  if (this.takingDamage > 0){
    this.takingDamage -= time > this.takingDamage ? this.takingDamage : time;
  }

  if(this.hp === 0){
    return this;
  }

  if (gameState.getPlayer().position.y < this.position.y) {
    this.fireGun(time, gameState,  new Vector(0, -this.weapon.laserSpeed) );
  }else {
    this.fireGun(time, gameState,  new Vector(0, this.weapon.laserSpeed) );
  }

  if (this.position.x <= 5 || this.position.x >= canvasWidth - this.drawArgs.width) {
    this.speed = new Vector(-this.speed.x, this.speed.y);
  }


  newPosition = this.position.plus( this.speed.times(time) );

  if ( !this.isOutOfScreen() ){
    const drawArgs = copyObject(mediumDrawArgs);
    drawArgs.x = newPosition.x;
    drawArgs.y = newPosition.y;

    return new MediumEnemy(newPosition, this.speed, drawArgs, "medium enemy",mediumShipDamage ,
                           this.hp ,0 , this.weapon);
  }
  else {
    var actors = gameState.actors;
    actors[actors.indexOf(this)] = null;
  }

}

/******************************************************************************/
