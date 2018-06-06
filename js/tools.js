//Vector class to track position and speed
class Vector {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
  plus(vector){
    return new Vector(this.x + vector.x, this.y + vector.y);
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
const keysArray = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];

function trackKeys(keysArray){
  const keys = Object.create(null);

  function callback(event){
    if ( keysArray.includes(event.key) ) {
      keys[event.key] = event.type === "keydown";
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
