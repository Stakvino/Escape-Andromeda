const smallEnemySprites  = DOM.createImg("img/Ships/enemy-small.png");
const mediumEnemySprites = DOM.createImg("img/Ships/enemy-medium.png");
const bigEnemySprites    = DOM.createImg("img/Ships/enemy-big.png");

/******************************************************************************/

const enemyZoomX = 3.5;
const enemyZoomY = 2.5;

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

    return new MediumEnemy(position, mediumSpeed, mediumDrawArgs, "enemy spaceship",
                            mediumShipDamage, mediumHp, 0, weapon);

  }

}

/******************************************************************************/

MediumEnemy.prototype.update = function(time, gameState){

  if (gameState.getPlayer().position.y < this.position.y) {
    this.fireGun(time, gameState,  new Vector(this.weapon.laserSpeed.x, -this.weapon.laserSpeed.y) );
  }else {
    this.fireGun(time, gameState,  this.weapon.laserSpeed );
  }


  if (this.takingDamage > 0){
    this.takingDamage -= time > this.takingDamage ? this.takingDamage : time;
  }

  if(this.hp === 0){
    return this;
  }

  if (this.position.x <= 5 || this.position.x >= canvasWidth - this.drawArgs.width) {
    this.speed = new Vector(-this.speed.x, this.speed.y);
  }


  newPosition = this.position.plus( this.speed.times(time) );

  if ( !this.isOutOfScreen() ){
    const drawArgs = copyObject(mediumDrawArgs);
    drawArgs.x = newPosition.x;
    drawArgs.y = newPosition.y;

    return new MediumEnemy(newPosition, this.speed, drawArgs, "enemy spaceship",mediumShipDamage ,
                           this.hp ,0 , this.weapon);
  }
  else {
    var actors = gameState.actors;
    actors[actors.indexOf(this)] = null;
  }

}

/******************************************************************************/
