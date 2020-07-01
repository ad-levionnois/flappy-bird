const cvs = document.getElementById('bird');
const ctx = cvs.getContext('2d');

// LOAD SPRITE IMG
const sprite = new Image();
  sprite.src="img/sprite.png";

const degree = Math.PI/180

let frames = 0;

// GAME STATE
const state = {
  current : 0,
  getReady : 0,
  game : 1,
  gameOver : 2
}

// CONTROL GAME
cvs.addEventListener("click", function(evt){
  switch (state.current) {
    case state.getReady:
      state.current = state.game;
      break;
    case state.game:
      bird.flap();
      break;
    case state.gameOver:
      state.current = state.getReady;
      break;
    default:

  }

});

// BACKGROUND
const bg = {
  sX : 0,
  sY : 0,
  w : 275,
  h : 227,
  x : 0,
  y : cvs.height -227,

  draw : function(){
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  }
}

const fg = {
  sX : 276,
  sY : 0,
  w : 224,
  h : 112,
  x : 0,
  y : cvs.height -112,

  draw : function(){
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  }
}

// STATE

const getReady = {
  sX : 0,
  sY : 229,
  w : 173,
  h : 165,
  x : cvs.width -173,
  y : cvs.height -165,

  draw : function(){
    if (state.current == state.getReady){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x/2, this.y/2, this.w, this.h);
    }
  }
}

const gameOver={
  sX : 173,
  sY : 229,
  w : 228,
  h : 201,
  x : cvs.width -228,
  y  : cvs.height -201,

  draw : function(){
    if (state.current == state.gameOver){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x/2, this.y/2, this.w, this.h);
    }
  }
}


// BIRD
const bird = {
  animation : [
  {sX : 277 , sY : 112 },
  {sX : 277 , sY : 139 },
  {sX : 277 , sY : 164 },
  {sX : 277 , sY : 139 }
  ],

  w :33,
  h :27,
  x :50,
  y :150,

  frame :0,

  gravity : 0.25,
  speed: 0,
  rotation:0,
  jump: 4.6,

  draw : function(){
    let bird = this.animation[this.frame];

    ctx.save();
    ctx.translate(this.x, this.y); //deplacer l'origine du canvas
    ctx.rotate(this.rotate);
    ctx.restore();


    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, this.x - this.w/2, this.y -this.h/2, this.w, this.h);
  },

  flap : function(){
      this.speed = -this.jump;
  },

  update: function(){
         // si le jeu est en mode getReady l'oiseau bat doucement des ailes
        this.period = state.current == state.getReady ? 10 : 5;
        // on incrémente la frames de 1 à chaque période
        this.frame += frames%this.period == 0 ? 1 : 0;
        // quand on arrive a 4 l'animation retourne a 0
        this.frame = this.frame%this.animation.length;

        if(state.current == state.getReady){
          this.y = 150; // reset position
          this.rotation = 0 * degree ;
        } else{
            this.speed += this.gravity;
            this.y += this.speed

            if(this.y + this.h/2 >= cvs.height - fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                if(state.current == state.game){
                    state.current = state.gameOver;
                }
            }
            // si l'oiseau jump

          }
  }

}

// DRAW
function draw(){
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, cvs.width, cvs.height);

  bg.draw();
  fg.draw();
 bird.draw();
  getReady.draw();
  gameOver.draw();

}
// UPDATE
function update(){
    bird.update();

}

function loop () {
  update();
  draw();
  requestAnimationFrame(loop);
  frames++;
}

loop();
