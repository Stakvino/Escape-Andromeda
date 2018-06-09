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

/******************************************************************************/

class MediumEnemy extends SpaceShip{
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage, weapon){
    super(position, speed, drawArgs, type, damage, hp, takingDamage, weapon);
  }

  static create(position){

    const weapon = {
      name    : "yellow bolt",
      isReady : true,
      timeBeforeReady : 0,
      charingTime     : 0.5
    }

    return new MediumEnemy(position, new Vector(400,50), mediumDrawArgs,
                      "enemy spaceship", mediumShipDamage, mediumHp, 0, weapon);

  }

}

/******************************************************************************/

MediumEnemy.prototype.update = function(time, gameState){

  this.fireGun(time, gameState, "down" );

  if (this.takingDamage > 0){
    this.takingDamage -= time > this.takingDamage ? this.takingDamage : time;
  }

  if(this.hp === 0){
    return this;
  }

  if (this.position.x <= 5) {
    this.speed.x = 400;
  }
  else if (this.position.x >= canvasWidth - this.drawArgs.width) {
    this.speed.x = -400;
  }

  newPosition = this.position.plus( this.speed.times(time) );

  if ( !this.isOutOfScreen() ){
    const drawArgs = copyObject(mediumDrawArgs);
    drawArgs.x = newPosition.x;
    drawArgs.y = newPosition.y;

    return new MediumEnemy(newPosition,this.speed,drawArgs,"enemy spaceship",2,this.hp,0,this.weapon);
  }
  else {
    var actors = gameState.actors;
    actors[actors.indexOf(this)] = null;
  }

}

/******************************************************************************/
