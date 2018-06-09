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

GameState.prototype.update = function(time){
  var newState = this;
  this.actors = cleanArray(this.actors);
  var updatedActors = [];

  this.actors = this.actors.filter(actor => {
    return actor.type === "background" || actor.hp > 0 || actor.takingDamage > 0;
  });

  for (var i = 0; i < this.actors.length; i++) {
    updatedActors.push( this.actors[i].update(time, this) );
  }

  updateCollisions(updatedActors);

  generateBackground(updatedActors);
  generateMeteors(updatedActors);

  newState.actors = updatedActors;
  return newState;
}
