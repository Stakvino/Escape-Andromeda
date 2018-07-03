const FBSprites       = DOM.createImg("img/Ships/final-boss.png");
const FBYellowSprites = DOM.createImg("img/Ships/final-boss-yellow.png");
const FBRedSprites    = DOM.createImg("img/Ships/final-boss-red.png");
const FBswidth = 125;

const FBPosition = new Vector( ( (canvasWidth / 2) - 50 ), 0);
const FBHp    = 100;
const FBSpeed = new Vector(900, 0);

const FBDrawArgs = {
  img : FBSprites,
  sx  : 0,
  sy  : 0,
  swidth  : FBswidth,
  sheight : 170,
  x : FBPosition.x,
  y : FBPosition.y,
  width  : FBswidth,
  height : 170
}

const FBPhasesDuration = {"wait" : 1, "charge bolt" : 1, "charge blast" : 1,"shadow" : 1, "laser blast" : 1};
const FBPhasesLoop = ["wait", "charge bolt", "laser bolt","wait", "charge blast", "laser blast", "wait", "charge bolt","shadow", "laser blast"];
const lastWave = ["M","S","#","BH","#"];

var phaseStarted = false;
var phaseTime    = 0;
var phaseNumber  = 0;

/******************************************************************************/

class FinalBoss extends SpaceShip {
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage, weapon, angle) {
    super(position, speed, drawArgs, type, damage, hp, takingDamage, weapon, angle);
    this.angle = angle;
  }

  static create(speed, charingTime, laserSpeed){

    const weapon = {
      name    : "destruction",
      isReady : false,
      timeBeforeReady : 0,
      charingTime     : charingTime,
      laserSpeed      : laserSpeed,
      maxCharge       : 10
    }
    return new FinalBoss(FBPosition, speed, FBDrawArgs, "final boss", 3, FBHp, 0, weapon, 0);
  }

}

/******************************************************************************/

FinalBoss.prototype.update = function(time, gameState){


  if (this.takingDamage > 0){
    this.takingDamage -= time > this.takingDamage ? this.takingDamage : time;
  }

  if (!phaseStarted) {
    phaseTime  = 0;
    phaseStarted = true;
  }
  else {
    phaseTime += time;
  }

  const phaseName  = FBPhasesLoop[phaseNumber];

  const phaseEnded = this[phaseName](time, gameState);

  if(phaseEnded){

    if (phaseName === "laser bolt") {
      this.angle = 0;
    }
    else if (phaseName === "laser blast") {
      this.weapon.isReady = false;
      this.weapon.charingTime = 0;
    }

    phaseNumber++;

    if (phaseNumber === FBPhasesLoop.length) {
      phaseNumber = 0;
    }

  }

  return this;
  //return new FinalBoss(this.position, this.speed, this.drawArgs, "final boss", 3, this.hp, this.takingDamage, this.weapon, this.angle);
}

/******************************************************************************/

FinalBoss.prototype.phaseEnded = function(){

  const phaseName = FBPhasesLoop[phaseNumber];

  if (phaseTime >= FBPhasesDuration[phaseName] || this.angle >= 2 * Math.PI ) {
    phaseStarted = false;
  }

  if ( phaseName === "laser bolt" ) {
    return this.angle >= 2 * Math.PI;
  }

  return phaseTime >= FBPhasesDuration[phaseName];
}

/******************************************************************************/

FinalBoss.prototype["wait"] = function(time, gameState){

  this.angle = 0;
  this.drawArgs.img    = FBSprites;
  this.drawArgs.sx     = 0;
  this.drawArgs.swidth = FBswidth;
  this.drawArgs.width  = FBswidth

  if (this.position.x > FBPosition.x + 5) {
    this.position = this.position.plus( FBSpeed.times(-1).times(time) );
  }
  if (this.position.x < FBPosition.x ) {
    this.position = this.position.plus( FBSpeed.times(time) );
  }

  this.drawArgs.x = this.position.x;
  this.drawArgs.y = this.position.y;

  return this.phaseEnded();
}

/******************************************************************************/

FinalBoss.prototype["charge bolt"] = function(time){

  const redOrYellowSprite = getRandomElement( [FBYellowSprites, FBRedSprites] );
  this.drawArgs.img = redOrYellowSprite;

  return this.phaseEnded();
}

/******************************************************************************/

FinalBoss.prototype["laser bolt"] = function(time, gameState){

  if (this.angle > Math.PI/2) {
    this.angle -= time;
  }
  else if (this.angle < -Math.PI/2) {
    this.angle += time;
  }

  this.drawArgs.img   = FBSprites;
  this.drawArgs.sx    = FBswidth;

  this.weapon.name = getRandomElement(["yellow bolt", "red bolt"]);
  this.fireGun(time, gameState, new Vector(0, this.weapon.laserSpeed), new Vector(this.position.x, this.position.y), new Vector(50,80) );
  this.chargeWeapon(time);

  return this.phaseEnded();
}


/******************************************************************************/

FinalBoss.prototype["charge blast"] = function(time){

  const redOrYellowSprite = getRandomElement( [FBYellowSprites, FBRedSprites] );
  this.drawArgs.img    = redOrYellowSprite;
  this.drawArgs.sx     = FBswidth;
  this.drawArgs.swidth = FBswidth + 30;
  this.drawArgs.width  = FBswidth + 30;

  return this.phaseEnded();
}

/******************************************************************************/

FinalBoss.prototype["laser blast"] = function(time, gameState){

  if(!this.weapon.isReady){
    this.weapon.isReady = true;
    this.angle = 1;
  }

  this["charge blast"]();

  this.position = this.position.plus( this.speed.times(time) );
  this.drawArgs.x = this.position.x;
  this.drawArgs.y = this.position.y;

  const laserPosition = this.position.plus(new Vector(-this.drawArgs.width/10, this.drawArgs.height/1.5) );

  new BigEnemy().fireBlast.call(this, time, gameState, laserPosition, this.weapon.maxCharge);
  new MediumEnemy().moveRightAndLeft.call(this);

  return this.phaseEnded();
}

/******************************************************************************/

FinalBoss.prototype["shadow"] = function(time, gameState){

  const actors = gameState.actors;

  if ( waveFinished(actors, lastWave) ) {
    generateWave(lastWave, actors);
  }
  generateRandomMeteors(actors, 0.1);

  return this.phaseEnded();
}
