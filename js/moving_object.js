const bgNormalSpeed = new Vector(0 , 200);
var   backgroundSpeed = new Vector(bgNormalSpeed.x, bgNormalSpeed.y);

class MovingObject {
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage) {
    this.position = position;
    this.speed    = speed;
    this.drawArgs = drawArgs;
    this.type     = type;
    this.damage   = damage;
    this.hp       = hp;
    if (this.drawArgs !== undefined) {
      this.size = new Vector(this.drawArgs.width, this.drawArgs.height);
    }
    this.takingDamage = takingDamage;
  }

  /*get sx of a given index : indexes depends on sprite position
    indexX = 0 & indexY = 1 => in the first sprite (X = 0) of the second line(Y = 1)*/
  getSpriteX(indexX){
    return this.drawArgs.swidth * indexX;
  }

  getSpriteY(indexY){
    return this.drawArgs.sheight * indexY;
  }
  //inverse of getSprite
  getSpriteIndex(){
    const drawArgs = this.drawArgs;
    return {x : drawArgs.sx /drawArgs.swidth,
            y : drawArgs.sy /drawArgs.sheight};
  }

}

/******************************************************************************/

MovingObject.prototype.isOutOfScreen = function(){

  return this.position.x >= canvasWidth + 50  || this.position.x <= -this.size.x - 50
      || this.position.y >= canvasHeight + 50 || this.position.y <= -this.size.y - 50;
}

/******************************************************************************/
const shift = 5;

MovingObject.prototype.collideWith = function(movingObject){

  if(this.type === "background" || movingObject.type === "background")
    return false;

  const pos  = movingObject.position;
  const size = new Vector(movingObject.drawArgs.width, movingObject.drawArgs.height);

  return  (this.position.x + this.drawArgs.width  > pos.x + shift) && (this.position.x < pos.x + size.x - shift)
       && (this.position.y + this.drawArgs.height > pos.y + shift) && (this.position.y < pos.y + size.y - shift);
}

/******************************************************************************/

MovingObject.prototype.tookDamageFrom = function(movingObject){

  if(this.hp <= 0 || movingObject.hp <= 0 || ( this.shadowForm && this.shadowForm.isActive) )
    return;
  //if its the player who took damage wait a moment before he can take damage again
  if (this.type === "player") {

    if ( !this.takingDamage ){

      var newHp = this.hp - movingObject.damage;
      if (newHp < 0) newHp = 0;
      DOM.modifyBar("health",newHp ,this.hp , "lose");
      this.hp = newHp;

      movingObject.hp -= this.damage;
      if(movingObject.hp < 0) movingObject.hp = 0;

      this.damage = 0;
    }

  }
  //if its another object just take damage without waiting
  else {
    this.hp -= movingObject.damage;
    if(this.hp < 0) this.hp = 0;

    movingObject.hp -= this.damage;
    if(movingObject.hp < 0) movingObject.hp = 0;
  }


  if (!this.takingDamage && movingObject.damage){

    if(this.type === "player"){
      this.damage = playerShipDamage;
      this.takingDamage = 1; //put some time before this can take damage again
    }else {
      this.takingDamage = 0.5;
    }

  }
  if (!movingObject.takingDamage && this.damage){

    if (movingObject.type.includes("laser") ) {
      movingObject.takingDamage = 0.1;
    }
    else {
      movingObject.takingDamage = 0.5;
    }
  }

  if(this.hp === 0){
    this.damage = 0;
  }
  if(movingObject.hp === 0){
    movingObject.damage = 0;
  }

}

/******************************************************************************/

MovingObject.prototype.update = function(time, gameState){

  var speed = this.speed;

  var takingDamage = this.takingDamage;
  if (takingDamage > 0){
    takingDamage -= time > takingDamage ? takingDamage : time;
  }

  if(this.type === "meteor"){
    speed = backgroundSpeed.plus( new Vector(0 ,200) );
  }

  if (this.type === "blue laser") {
    const type = getRandomElement(["blue laser", "blue laser2"]);
    this.drawArgs.sx = this.getSpriteX(laserTypes[type].spriteIndex.x)*2 + 5 ;
    this.drawArgs.sy = this.getSpriteY(laserTypes[type].spriteIndex.y);
  }

  var newPosition = this.position;
  if(this.type === "background" || this.hp > 0)
    newPosition = newPosition.plus( speed.times(time) );

  if ( !this.isOutOfScreen() ){
    this.drawArgs.x = newPosition.x;
    this.drawArgs.y = newPosition.y;

    return new MovingObject(newPosition, this.speed, this.drawArgs,
                            this.type, this.damage, this.hp, takingDamage);
  }
  else {
    var actors = gameState.actors;
    actors[actors.indexOf(this)] = null;
  }

}

/******************************************************************************/
