const blackHoleImg  = DOM.createImg("img/Background/Black hole.png");

class BlackHole extends MovingObject {
  constructor(position, speed, drawArgs, type, damage, hp, takingDamage, gravity) {
    super(position, speed, drawArgs, type, damage, hp, takingDamage, gravity);
    this.gravity = gravity;
  }

  create(size){

    var zoom    = null;
    var gravity = null;

    if (size === "small") {
      zoom    = 1/2;
      gravity = ;
    }else if (size === "medium") {
      zoom    = 1;
      gravity = ;
    }else if (size === "big") {
      zoom    = 2;
      gravity = ;
    }


    const drawWidth  = blackHoleImg.width  * zoom;
    const randomXposition = getRandomNumber(0, canvasWidth - drawWidth);
    const drawHeight = blackHoleImg.height  * zoom;
    const position   = new Vector(randomXposition, -drawHeight);

    const drawArgs = {
        img : blackHoleImg,
        sx  : 0,
        sy  : 0,
        swidth  : blackHoleImg.width,
        sheight : blackHoleImg.height,
        x : position.x,
        y : position.y,
        width  : drawWidth,
        height : drawHeight
      };


    return new BlackHole(position, backgroundSpeed, drawArgs, "black hole",
                          0, 1, 0, gravity);
  }

}
