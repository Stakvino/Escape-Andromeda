function updateCollisions(actors){

    const player     = getAllActorsWithTypes(actors, "player")[0];
    const enemies    = getAllActorsExept(actors, "player", "background", "blue laser", "black hole");

    //Update player collisions with enemies
    for (var i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (player && player.collideWith(enemy) )
        player.tookDamageFrom(enemy);
    }

    const blueLasers = getAllActorsWithTypes(actors, "blue laser");
    const killables  = getAllActorsWithTypes(actors, "small enemy", "medium enemy", "big enemy", "meteor", "final boss");

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

    const blackHole = getAllActorsWithTypes(gameState.actors, "black hole")[0];

    if (blackHole) {
      const center  = new Vector(blackHole.position.x + blackHole.drawArgs.width /2,
                                         blackHole.position.y + blackHole.drawArgs.height/2 );

      const position = center.plus( new Vector(-50, -50) );
      const drawArgs = {
        width  : 100,
        height : 100
      }

      const blackHoleCenter = new MovingObject(position, 0, drawArgs, "", 3);
      if (player && player.collideWith(blackHoleCenter) )
        player.tookDamageFrom(blackHoleCenter);

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

const meteorImg      = DOM.createImg("img/Meteors/Meteor1.png");
const meteorSizes    = ["small", "medium", "big"];

function generateRandomMeteors(actors, prob){

  const rand   = getRandomNumber(0, 100);

  if (rand > prob) {
    return ;
  }

  const size   = getRandomElement( meteorSizes );
  const speed  = backgroundSpeed.plus( new Vector(0,200) );

  const damage = meteorSizes.indexOf(size) + 1;
  const zoom   = meteorSizes.indexOf(size) + 2;
  const hp     = meteorSizes.indexOf(size) + 2;

  const randomXposition = getRandomNumber(0, canvasWidth - meteorImg.width);
  const position = new Vector(randomXposition, -meteorImg.height * zoom);
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

  if (levelNumber === 0 && waveNumber === 6 && !tutorialIsDone) {
    const tutorialMessage = `press <span class="important-message">"S"</span> to enter <span class="important-message">shadow form</span> <br>you will <span class="important-message">not take damage</span> while in shadow form`;
    DOM.renderMessage(``, tutorialMessage, 8000);
  }
  if (levelNumber === 0 && waveNumber === 9 && !tutorialIsDone) {
    const tutorialMessage = `<span class="important-message">red ressources</span> will restore your <span class="important-message">health</span> bar`;
    DOM.renderMessage(``, tutorialMessage, 4000);
  }
  if (levelNumber === 0 && waveNumber === 11 && !tutorialIsDone) {
    const tutorialMessage = `<span class="important-message">yellow ressources</span> will restore your <span class="important-message">shadow form</span> bar`;
    DOM.renderMessage(``, tutorialMessage, 4000);
  }
  if (levelNumber === 0 && waveNumber === 13 && !tutorialIsDone) {
    const tutorialMessage = `<span class="important-message">blue ressources</span> will make your weapon <span class="important-message">fire faster</span>`;
    DOM.renderMessage(``, tutorialMessage, 4000);
    tutorialIsDone = true;
  }

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
    else if ( waveArray[i].includes("BH") ) {
      actor = BlackHole.create(positionX);
    }
    else if ( waveArray[i].includes("FB") ) {
      actor = FinalBoss.create(positionX, new Vector(0, 0), 6, 600);
    }

    if (actor) {
      if (actor.type === "black hole") {
        actors.unshift(actor);
      } else {
        actors.push(actor);
      }
    }

  }

}

/******************************************************************************/
var waveNumber = 0;

function generateLevel(level, actors){

  if ( waveNumber === 0 || waveFinished(actors, level[waveNumber]) ) {
    waveNumber++;
    if (waveNumber >= level.length) return ;
    else generateWave(level[waveNumber], actors);
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

      case "BH":
        return "black hole";
        break;

      default:
        return "space";
        break;

    }

  });

}
