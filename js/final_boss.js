const FBSprites       = DOM.createImg("img/Ships/final-boss.png");
const FBYellowSprites = DOM.createImg("img/Ships/final-boss-yellow.png");
const FBRedSprites    = DOM.createImg("img/Ships/final-boss-red.png");
const FBswidth = 125;

const FBPosition = new Vector( ( (canvasWidth / 2) - 50 ), 0);
const FBHp = 100;

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

const FBPhasesDuration = {"wait" : 1, "charge" : 1, "shadow" : 2.5};
const FBPhasesLoop = ["laser blast", "wait", "charge", "laser bolt","wait", "charge", "laser blast","wait", "charge", "shadow"];
const lastWave = ["B", "M", "M", "HR", "S", "BH", "S", "SR", "M", "M", "B", `RM${0.1}`];

var phaseStarted = false;
var phaseTime    = 0;
var phaseNumber  = 0;

/******************************************************************************/

class FinalBoss extends SpaceShip {
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage, weapon, angle) {
    super(position, speed, drawArgs, type, damage, hp, takingDamage, weapon, angle);
    this.angle = angle;
  }

  static create(positionX, speed, charingTime, laserSpeed){

    const weapon = {
      name    : "destruction",
      isReady : true,
      timeBeforeReady : 0,
      charingTime     : 0,
      laserSpeed      : 600,
      maxCharge       : 10
    }
    const position = positionX || FBPosition;

    return new FinalBoss(position, speed, FBDrawArgs, "final boss", 3, FBHp, 0, weapon, 0, 0);
  }

}

/******************************************************************************/

FinalBoss.prototype.update = function(time, gameState){


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
    if (phaseName.includes("laser")) {
      this.angle = 0;
    }
    phaseNumber++;
  }
  if (phaseNumber === FBPhasesLoop.length) {
    phaseNumber = 0;
  }

  return this;
}

/******************************************************************************/

FinalBoss.prototype.phaseEnded = function(){

  const phaseName = FBPhasesLoop[phaseNumber];

  if (phaseTime >= FBPhasesDuration[phaseName] || this.angle >= 2 * Math.PI ) {
    phaseStarted = false;
  }

  if ( phaseName.includes("laser") ) {
    return this.angle >= (2 * Math.PI);
  }

  return phaseTime >= FBPhasesDuration[phaseName];
}

/******************************************************************************/

FinalBoss.prototype["wait"] = function(time){

  this.angle = 0;
  this.drawArgs.img    = FBSprites;
  this.drawArgs.sx     = 0;
  this.drawArgs.swidth = FBswidth;
  this.drawArgs.width  = FBswidth

  return this.phaseEnded();
}

/******************************************************************************/

FinalBoss.prototype["charge"] = function(time){

  this.angle = 0;
  const redOrYellowSprite = getRandomElement( [FBYellowSprites, FBRedSprites] );
  this.drawArgs.img = redOrYellowSprite;

  return this.phaseEnded();
}

/******************************************************************************/

FinalBoss.prototype["laser bolt"] = function(time){

  this.angle += time;
  this.drawArgs.img   = FBSprites;
  this.drawArgs.sx    = FBswidth;

  return this.phaseEnded();
}

/******************************************************************************/

FinalBoss.prototype["laser blast"] = function(time, gameState){

  this.angle += time;

  const redOrYellowSprite = getRandomElement( [FBYellowSprites, FBRedSprites] );
  this.drawArgs.img    = redOrYellowSprite;
  this.drawArgs.sx     = FBswidth;
  this.drawArgs.swidth = FBswidth + 30;
  this.drawArgs.width  = FBswidth + 30;

  const laserPosition = this.position.plus(new Vector(this.drawArgs.width/2, this.drawArgs.height/2) );
  const laserSpeed = getVectorCord(this.weapon.laserSpeed, this.angle);

  new BigEnemy().fireBlast.call(this, time, gameState, laserPosition, this.weapon.maxCharge, laserSpeed);

  return this.phaseEnded();
}

/******************************************************************************/

FinalBoss.prototype["shadow"] = function(time){


  return this.phaseEnded();
}
