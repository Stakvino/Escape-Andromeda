let playerSprites = document.createElement("img");
playerSprites.src = "img/Ships/player.png";
//playerSprites.style.width = "50px";

var canvasWidth  = 900;
var canvasHeight = 600;
var playerWidth  = 16;
var playerHeight = 24;

var player = {
  position : {
    x:500,
    y:200
  },
  speed :{
    x:7,
    y:7
  }
};

var keys = Object.create(null);

const noMovingX = playerWidth*2;
const noMovingY = playerHeight;

var imageWidth  = playerWidth*4;
var imageHeight = playerHeight*3;
var initialX = noMovingX;
var initialY = noMovingY;



var canvas = document.querySelector("canvas#game-canvas");
canvas.width  = canvasWidth;
canvas.height = canvasHeight;
var ctx = canvas.getContext("2d");

playerSprites.addEventListener("load",function(){
  ctx.drawImage(playerSprites, initialX, initialY, playerWidth, playerHeight,
    player.position.x, player.position.y, imageWidth, imageHeight);
});



function canMoveXAxis(newPositionX,newPositionY){
  return newPositionX >= 0 && newPositionX + imageWidth <= canvasWidth;
}
function canMoveYAxis(newPositionX,newPositionY){
  return newPositionY >= 0 && newPositionY + imageHeight <= canvasHeight;
}

var id = requestAnimationFrame(callback);

function callback(time){
  var newPositionX = player.position.x;
  var newPositionY = player.position.y;

    if (keys["ArrowUp"]) {
      newPositionY = player.position.y - player.speed.y;
      initialY = 0;
    }
    if (keys["ArrowDown"]) {
      newPositionY = player.position.y + player.speed.y;
    }
    if (keys["ArrowLeft"]) {
      if(initialX > 0) initialX-=playerWidth;
      newPositionX = player.position.x - player.speed.x;
    }
    if (keys["ArrowRight"]) {
      if(initialX < imageWidth) initialX+=playerWidth;
      newPositionX = player.position.x + player.speed.x;
    }


   if ( canMoveXAxis(newPositionX,newPositionY) ){
     player.position.x = newPositionX;
   }
   if ( canMoveYAxis(newPositionX,newPositionY) ){
     player.position.y = newPositionY;
   }

   ctx.clearRect(0,0,canvasWidth,canvasHeight);
   ctx.drawImage(playerSprites, initialX, initialY, playerWidth, playerHeight,
   player.position.x, player.position.y, imageWidth, imageHeight);

  id = requestAnimationFrame(callback);
}

var keys = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];

addEventListener("keydown",function(e){

  if (e.key === "q") {
    cancelAnimationFrame(id);
  }
  if ( keys.includes(e.key) ) {
    e.preventDefault();
    keys[e.key] = true;
  }

});

addEventListener("keyup",function(e){

  if ( keys.includes(e.key) ) {
    keys[e.key] = false;
  }

  initialX = noMovingX;
  if (e.key === "ArrowUp") initialY = playerHeight;

  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  ctx.drawImage(playerSprites, initialX, initialY, playerWidth, playerHeight,
    player.position.x, player.position.y, imageWidth, imageHeight);
});
