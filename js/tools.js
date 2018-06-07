//Vector class to track position and speed
class Vector {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
  plus(vector){
    return new Vector(this.x + vector.x, this.y + vector.y);
  }
  times(number){
    return new Vector(this.x * number, this.y * number);
  }
}

/******************************************************************************/

//Helpers for DOM manipulation
const DOM = Object.create(null);

DOM.createImg = function(src){
  const img = document.createElement("img");
  img.src = src;
  return img;
}

/******************************************************************************/

//Keyboard keys handler
const keysArray = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","ControlLeft"];

function trackKeys(keysArray){
  const keys = Object.create(null);

  function callback(event){
    if ( keysArray.includes(event.code) ) {
      keys[event.code] = event.type === "keydown";
      event.preventDefault();
    }
  }

  addEventListener("keydown",callback);
  addEventListener("keyup",callback);

  return keys;
}

const gameKeys = trackKeys(keysArray);

/******************************************************************************/

//Function to control FPS and stop resume callback function in requestAnimationFrame
function runAnimation(frameFunc,FPS) {

  let lastTime = null;

  function frame(time) {

    if (lastTime != null) {
      //If timeStep becomes greater then 1/FPS correct value
      let timeStep = Math.min((time - lastTime) / 1000, 1/FPS);
      //When difference between lastTime and currentTime becomes 1/FPS run callback
      if (timeStep >= 1/FPS) {
        lastTime = time;
        //Animation stops if callback return false
        if (frameFunc(timeStep) === false) return;
      }
    }
    lastTime = time;

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

/******************************************************************************/

function copyObject(obj){
  var newObject = {};
  for(var prop in obj){
    newObject[prop] = obj[prop];
  }
  return newObject;
}

function getRandomNumber(first, last, isDecimal = false){

  if (isDecimal) {
    return Math.random() * (last - first) + first;
  }
  return Math.floor( Math.random() * (last - first + 1) ) + first;
}

function getRandomElement(array){
  return array[ Math.floor( Math.random() * array.length ) ];
}
