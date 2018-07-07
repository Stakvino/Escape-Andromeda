const FBSprites       = DOM.createImg("img/Ships/final-boss.png");
const FBYellowSprites = DOM.createImg("img/Ships/final-boss-yellow.png");
const FBRedSprites    = DOM.createImg("img/Ships/final-boss-red.png");
const FBswidth  = 125;
const FBsheight = 170;

const FBPosition = new Vector( ( (canvasWidth / 2) - FBswidth/2 ), 0);
const FBSpeed = new Vector(900, 0);
const FBHp    = 600;
const FBSpeed = new Vector(900, 0);

const FBDrawArgs = {
  img : FBSprites,
  sx  : 0,
  sy  : 0,
  swidth  : FBswidth,
  sheight : FBsheight,
  x : FBPosition.x,
  y : -FBsheight,
  width  : FBswidth,
  height : FBsheight
}
const FBPhasesDuration = {"wait" : 2, "charge bolt" : 2, "charge blast" : 2,"shadow" : 10, "laser blast" : 6, "laser bolt" : 4};
const FBPhasesLoop = ["wait", "charge bolt", "laser bolt","wait", "charge blast", "laser blast", "wait", "charge bolt","shadow"];
const lastWave = ["M","HR","S","SR","BH","#","M","#"];

var phaseStarted = false;
var phaseTime    = 0;
var phaseNumber  = 0;

/******************************************************************************/

class FinalBoss extends SpaceShip {
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage, weapon, angle) {
    super(position, speed, drawArgs, type, damage, hp, takingDamage, weapon, angle);
    this.angle = angle;
  }

  static create(charingTime, laserSpeed){

    const weapon = {
      name    : "destruction",
      isReady : false,
      timeBeforeReady : 0,
      charingTime     : charingTime,
      laserSpeed      : laserSpeed,
      maxCharge       : 6
    }
    const initialPosition = new Vector( ( (canvasWidth / 2) - FBswidth/2 ), - FBsheight );
    const drawArgs = copyObject(FBDrawArgs);

    return new FinalBoss(initialPosition, FBSpeed, drawArgs, "final boss", 3, FBHp, 0, weapon, 0);
  }

}

/******************************************************************************/

const borrowedMedium = new MediumEnemy();
const borrowedBig    = new BigEnemy();

FinalBoss.prototype.update = function(time, gameState){

  if (this.position.y < 0) {
    if(!isCuttScene) isCuttScene = true;
    if( !canvas.canvas.classList.contains("red-warning") ){
      gameWindow.style.backgroundColor = "rgb(200,0,50)";
      canvas.canvas.classList.add("red-warning");
    }

    this.position.y += 0.68;
    this.drawArgs.y = this.position.y;
    return this;
  }

  if(isCuttScene) isCuttScene = false;
  if( canvas.canvas.classList.contains("red-warning") ){
    gameWindow.style.backgroundColor = "#62225c";
    canvas.canvas.classList.remove("red-warning");
  }
  if( !storyIsTold ) storyIsTold = true;

  if (this.takingDamage > 0){

    if (this.hp === 0) {
      this.takingDamage -= time/10 > this.takingDamage ? this.takingDamage : time/10;
      return this;
    }
    else {
      this.takingDamage -= time > this.takingDamage ? this.takingDamage : time;
    }

  }

  if (!phaseStarted) {
    phaseTime  = 0;
    phaseStarted = true;
  }
  else {
    phaseTime += time;
  }

  const phaseName  = FBPhasesLoop[phaseNumber];

  if ( !phaseName.includes("laser") ) {
    borrowedBig.chargingBlast.call(this, time);
  }

  const phaseEnded = this[phaseName](time, gameState);

  if(phaseEnded){

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

  if ( phaseTime >= FBPhasesDuration[phaseName] ){
    phaseStarted = false;

    if (phaseName === "charge bolt") {
      this.weapon.charingTime = 0.1;
    }
    else if (phaseName === "laser bolt") {
      boltPositionX = 0;
      this.weapon.timeBeforeReady = 0;
    }
    else if (phaseName === "charge blast") {
      this.angle = 1;
    }
    else if (phaseName === "laser blast") {
      this.angle = 0;
    }
    else if (phaseName === "shadow") {
      lastWaveGenerated = false;
    }

    return true;
  }

  return false;
}

/******************************************************************************/

FinalBoss.prototype["wait"] = function(time, gameState){

  this.drawArgs.img    = FBSprites;

  if (this.takingDamage > 0) {
    this.drawArgs.sx = FBswidth;
  }
  else {
    this.drawArgs.sx = 0;
  }

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
  this.drawArgs.sx  = 0;
  this.drawArgs.img = redOrYellowSprite;

  return this.phaseEnded();
}

/******************************************************************************/
const distanceBetweenBolts = 145;
var boltPositionX = 0;
const FBboltSize = new Vector(50,80);

FinalBoss.prototype["laser bolt"] = function(time, gameState){

  this.drawArgs.img   = FBSprites;
  this.drawArgs.sx    = FBswidth;

  this.weapon.name = getRandomElement(["yellow bolt", "red bolt"]);

  var boltPosition = new Vector(boltPositionX , -FBboltSize.y*2);
  if(this.weapon.isReady){
    boltPositionX += distanceBetweenBolts;
  }
  if(boltPositionX > canvasWidth)
    boltPositionX = boltPositionX%canvasWidth;

  this.fireGun(time, gameState, new Vector(0, this.weapon.laserSpeed),boltPosition, FBboltSize );
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

  this["charge blast"]();

  this.position = this.position.plus( this.speed.times(time) );
  this.drawArgs.x = this.position.x;
  this.drawArgs.y = this.position.y;

  const laserPosition = this.position.plus(new Vector(-this.drawArgs.width/8, this.drawArgs.height/1.5) );

  borrowedBig.fireBlast.call(this, time, gameState, laserPosition, this.weapon.maxCharge);
  borrowedMedium.moveRightAndLeft.call(this);

  return this.phaseEnded();
}

/******************************************************************************/
var lastWaveGenerated = false;

FinalBoss.prototype["shadow"] = function(time, gameState){

  const actors = gameState.actors;

  if ( !lastWaveGenerated ) {
    generateWave(lastWave, actors);
    lastWaveGenerated = true;
  }
  generateRandomMeteors(actors, 0.1);

  return this.phaseEnded();
}
