function updateCollisions(actors){

    const player     = getAllActorsWithTypes(actors, "player")[0];
    const enemies    = getAllActorsExept(actors, "player", "background", "blue laser");

    //Update player collisions with enemies
    for (var i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (player && player.collideWith(enemy) )
        player.tookDamageFrom(enemy);
    }

    const blueLasers = getAllActorsWithTypes(actors, "blue laser");
    const killables  = getAllActorsWithTypes(actors, "small enemy", "medium enemy", "big enemy", "meteor");

    //Update player's lasers collisions with enemies
    for (var i = 0; i < killables.length; i++) {
      const killable = killables[i];
      for (var j = 0; j < blueLasers.length; j++) {
        const blueLaser = blueLasers[j];
        if ( killable.collideWith(blueLaser) )
          killable.tookDamageFrom(blueLaser);
      }
    }

    const ressources = getAllActorsWithTypes(actors, "ressource");

    for (var i = 0; i < ressources.length; i++) {
      const ressource = ressources[i];
      if (player && player.collideWith(ressource) ){
        player.tookRessource(ressource.type);
        actors[actors.indexOf(ressource)] = null;
      }
    }
}

/******************************************************************************/

const planetsImgsNames = ["Black hole.png", "Planet1.png", "Planet2.png"];
const starsImgsNames   = ["Star.png", "Star2.png"];

const planetsImgs = [];
const starsImgs   = [];

for (var planetsImgsName  of planetsImgsNames) {
  planetsImgs.push( DOM.createImg("img/Background/" +  planetsImgsName) );
}

for (var starsImgsName  of starsImgsNames) {
  starsImgs.push( DOM.createImg("img/Background/" +  starsImgsName) );
}

function getRandomBgImg(type){

  if (type === "star") {
    return getRandomElement(starsImgs);
  }else if (type === "planet") {
    return getRandomElement(planetsImgs);
  }

}

/******************************************************************************/

function generateBackground(actors){

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
    };


  const randomBackground = new MovingObject(position, speed, drawArgs, type);
  //add background img to the begining of actors array so that it will be drawn first
  actors.unshift(randomBackground);

}

/******************************************************************************/

const smallMeteorImg = DOM.createImg("img/Meteors/Meteor1.png");
const meteorSizes    = ["small", "medium", "big"];

function generateRandomMeteors(actors, prob){

  const rand   = getRandomNumber(0, 100);

  if (rand > prob) {
    return ;
  }

  const size   = getRandomElement( meteorSizes );
  const meteorImg  = smallMeteorImg;
  const speed  = backgroundSpeed.plus( new Vector(0,200) );

  const damage = meteorSizes.indexOf(size) + 1;
  const zoom   = meteorSizes.indexOf(size) + 2;
  const hp     = meteorSizes.indexOf(size) + 2;

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
const ressourcesSprites  = DOM.createImg("img/Ships/power-up.png");
const ressourcesDrawArgs = {
  img : ressourcesSprites,
  sx  : 0,
  sy  : 0,
  swidth  : 16,
  sheight : 16,
  x : 0,
  y : -32,
  width  : 50,
  height : 50
};

function generateRessource(type, positionX){

  const drawArgs = copyObject(ressourcesDrawArgs);

  if (type === "health") {
    drawArgs.sx = 16;
    drawArgs.sy = 16;
  }
  else if (type === "shadow") {
    drawArgs.sy = 16;
  }

  drawArgs.x = positionX;
  const position = new Vector(positionX, drawArgs.y);
  const newType = type + " ressource";

  const ressource = new MovingObject(position, backgroundSpeed, drawArgs, newType, 0, 1);

  return ressource;

}

/******************************************************************************/

function generateWave(waveArray, actors){

  for (var i = 0; i < waveArray.length; i++) {
    const positionX = (i + 1) * ( canvasWidth / (waveArray.length + 1) );
    var actor = null;

    if (waveArray[i] === "S") {
      actor = SmallEnemy.create(positionX, smallSpeed, 0.6, 600);
    }
    else if (waveArray[i] === "M") {
      actor = MediumEnemy.create(positionX, mediumSpeed, 0.6, 600);
    }
    else if (waveArray[i] === "B") {
      actor = BigEnemy.create(positionX, bigSpeed, 2, 600);
    }
    else if (waveArray[i] === "HR") {
      actor = generateRessource("health", positionX);
    }
    else if (waveArray[i] === "SR") {
      actor = generateRessource("shadow", positionX);
    }
    else if (waveArray[i] === "LR") {
      actor = generateRessource("laser speed", positionX);
    }

    actors.push(actor);
  }

}

/******************************************************************************/
var waveNumber = -1;

function generateLevel(level, actors){

  if(waveNumber >= level.length)
    return ;

  if ( waveNumber === -1 || waveFinished(actors, level[waveNumber]) ) {

    waveNumber++;
    if(waveNumber >= level.length)
      return ;
    else
      generateWave(level[waveNumber], actors);

  }

}

/******************************************************************************/

function waveFinished(actors, wave){

  actors = cleanArray(actors);

  const actorTypes = waveToTypes(wave);
  const remaining  = actors.filter(function(actor){
                      for (var i = 0; i < actorTypes.length; i++) {
                        if(actorTypes[i] === actor.type)
                          return true;
                      }
                      return false;
                    });

   return !remaining.length;
}

/******************************************************************************/

function waveToTypes(wave){

  return wave.map(function(actorSymbol){

    switch (actorSymbol) {

      case "S":
        return "small enemy";
        break;

      case "M":
        return "medium enemy";
        break;

      case "B":
        return "big enemy";
        break;

      case "HR":
        return "health ressource";
        break;

      case "SR":
        return "shadow ressource";
        break;

      case "LR":
        return "laser speed ressource";
        break;

      default:
        return "space";
        break;

    }

  });

}
