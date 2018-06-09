class GameState {
  constructor(status, actors) {
    this.status = status;
    this.actors = actors;
  }

}

/******************************************************************************/

const planetsImgs = ["Black hole.png", "Planet1.png", "Planet2.png"];
const starsImgs   = ["Star.png", "Star2.png"];

function getRandomBgImg(type){
  var imgName = "";

  if (type === "star") {
    imgName = getRandomElement(starsImgs);
  }else if (type === "planet") {
    imgName = getRandomElement(planetsImgs);
  }

  return DOM.createImg("img/Background/" +  imgName);
}

/******************************************************************************/

const smallMteorImg = DOM.createImg("img/Meteors/Meteor2.png");
const bigMteorImg   = DOM.createImg("img/Meteors/Meteor1.png");

GameState.prototype.generateBackground = function(actors){

  const rand = getRandomNumber(0, 400);
  var randomImg  = null;
  var randomZoom = null;
  var type   = "background";
  var damage = 0;
  var speed = backgroundSpeed;

  // 50% chances of generating a star img in the background
  if (rand < 200) {
    randomImg  = getRandomBgImg("star");
    randomZoom = getRandomNumber(1/4, 1/2, true);
  }
  // 0.% chances of generating a planet img in the background
  else if (rand === 400) {
    randomImg  = getRandomBgImg("planet");
    randomZoom = getRandomNumber(1/4, 2, true);
    speed = new Vector(getRandomNumber(50,200), backgroundSpeed.y);
  }
  else if (rand > 397) {
    randomImg  = smallMteorImg;
    randomZoom = 4;
    speed  = backgroundSpeed.plus( new Vector(0,200) );
    type   = "meteor";
    damage = 1;
  }
  else {
    return ;
  }

  const randomXposition = getRandomNumber(0, canvasWidth - randomImg.width);
  const position = new Vector(randomXposition, -randomImg.height);
  const drawArgs = {
    img : randomImg,
    sx  : 0,
    sy  : 0,
    swidth  : randomImg.width,
    sheight : randomImg.height,
    x : position.x,
    y : position.y,
    width  : randomImg.width  * randomZoom,
    height : randomImg.height * randomZoom
  }

  const randomBackground = new MovingObject(position, speed, drawArgs, type);

  //add background img to the begining of actors array so that it will be drawn first
  if (randomBackground.type === "background") {
    actors.unshift(randomBackground);
  }

}

/******************************************************************************/

const smallMeteorImg = DOM.createImg("img/Meteors/Meteor2.png");
const meteorSizes    = ["small", "medium", "big"];

GameState.prototype.generateMeteors = function(actors){

  const rand   = getRandomNumber(0, 400);

  if (rand < 397) {
    return ;
  }

  const size   = getRandomElement( meteorSizes );
  const meteorImg  = smallMeteorImg;
  const speed  = backgroundSpeed.plus( new Vector(0,200) );

  const damage = meteorSizes.indexOf(size) + 1;
  const zoom   = meteorSizes.indexOf(size) + 4;
  const hp     = meteorSizes.indexOf(size) + 1;

  const randomXposition = getRandomNumber(0, canvasWidth - meteorImg.width);
  const position = new Vector(randomXposition, -meteorImg.height);
  const drawArgs = {
    img : meteorImg,
    sx  : 2,
    sy  : 2,
    swidth  : meteorImg.width  - 4,
    sheight : meteorImg.height - 4,
    x : position.x,
    y : position.y,
    width  : meteorImg.width  * zoom,
    height : meteorImg.height * zoom
  }

  const meteor = new MovingObject(position, speed, drawArgs, "meteor", damage, hp, 0);
  actors.push(meteor);

}

/******************************************************************************/

function getAllActorsWithTypes(actors, ...types){
  actors = cleanArray(actors);
  var   result = [];

  for (var i = 0; i < types.length; i++) {
    result = result.concat( actors.filter(actor => actor.type === types[i]) );
  }

  return result;
}

/******************************************************************************/

function getAllActorsExept(actors, ...types){
  actors = cleanArray(actors);
  var   result = actors;

  for (var i = 0; i < types.length; i++) {
    result = result.filter( actor => actor.type !== types[i] );
  }

  return result;
}

/******************************************************************************/

GameState.prototype.updateCollisions = function(actors){

  const player     = getAllActorsWithTypes(actors, "player")[0];
  const enemies    = getAllActorsExept(actors, "player", "background", "blue laser");

  //Update player collisions with enemies
  for (var i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];

    if (player && player.collideWith(enemy) )
      player.tookDamageFrom(enemy);
  }

  const blueLasers = getAllActorsWithTypes(actors, "blue laser");
  const killables  = getAllActorsWithTypes(actors, "enemy spaceShip", "meteor");

  //Update player's lasers collisions with enemies
  for (var i = 0; i < killables.length; i++) {
    const killable = killables[i];

    for (var j = 0; j < blueLasers.length; j++) {
      const blueLaser = blueLasers[j];

      if ( killable.collideWith(blueLaser) ){
        killable.tookDamageFrom(blueLaser);
      }
    }

  }


}

/******************************************************************************/

GameState.prototype.update = function(time){
  var newState = this;
  this.actors = cleanArray(this.actors);
  var updatedActors = [];

  this.actors = this.actors.filter(actor => {
    //if(actor.type !== "background" && actor.hp === 0) debugger;
    return actor.type === "background" || (actor.hp > 0 || actor.takingDamage > 0);
  });

  for (var i = 0; i < this.actors.length; i++) {
    const act = this.actors[i];
    //if(act.type !== "background" && act.hp === 0) debugger;
    updatedActors.push( this.actors[i].update(time, this) );
    //if(act.type !== "background" && act.hp === 0) debugger;
  }

  this.updateCollisions(updatedActors);

  this.generateBackground(updatedActors);
  this.generateMeteors(updatedActors);

  newState.actors = updatedActors;
  return newState;
}
