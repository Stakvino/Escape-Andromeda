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
    const killables  = getAllActorsWithTypes(actors, "enemy spaceship", "meteor");

    //Update player's lasers collisions with enemies
    for (var i = 0; i < killables.length; i++) {
      const killable = killables[i];
      for (var j = 0; j < blueLasers.length; j++) {
        const blueLaser = blueLasers[j];
        if ( killable.collideWith(blueLaser) )
          killable.tookDamageFrom(blueLaser);
      }
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
  }

  const randomBackground = new MovingObject(position, speed, drawArgs, type);
  //add background img to the begining of actors array so that it will be drawn first
  actors.unshift(randomBackground);

}

/******************************************************************************/

const smallMeteorImg = DOM.createImg("img/Meteors/Meteor1.png");
const meteorSizes    = ["small", "medium", "big"];

function generateMeteors(actors){

  const rand   = getRandomNumber(0, 400);

  if (rand < 397) {
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
