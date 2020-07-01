const cvs = document.getElementById('bird');
const ctx = cvs.getContext('2d');

// LOAD SPRITE IMG
const sprite = new Image();
  sprite.src="img/sprite.png";

const degree = Math.PI/180;

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

    dx: 2,

  draw : function(){
    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);

    ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
  },

  update: function(){
    if(state.current == state.game){
      this.x = (this.x-this.dx)%(this.w/2); //décrémente de 2 la position de x du sol
    }
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

  radius: 12,

  frame :0,

  gravity : 0.25,
  speed: 0,
  rotation: 0,
  jump: 4.6,



  draw : function(){
    let bird = this.animation[this.frame];

    ctx.save();
    ctx.translate(this.x, this.y); //deplacer l'origine du canvas
    ctx.rotate(this.rotation);
    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h,- this.w/2,-this.h/2, this.w, this.h);
    ctx.restore();
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
            this.y += this.speed ;

            if(this.y + this.h/2 >= cvs.height - fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                if(state.current == state.game){
                    state.current = state.gameOver;
                }
            }
            // direction de l'oiseau celon la vitesse et son degrès de rotation
            if (this.speed >= this.jump){
                this.rotation = 90 * degree; //= loiseau tombe
                this.frame = 1; // ses aile se bloque a la frame 1
              }
            else {
                this.rotation = -25 * degree;  //= l'oiseau monte
              }

            }
        }
  }

// PIPES
const pipes = {
    position: [],

    top : {
          sX : 553,
          sY : 0,
    },
    bottom: {
          sX: 502,
          sY: 0,
    },

    w: 53,
    h: 400,
    gap: 85,
    maxYPos: -150, //la hauteur maximum du pipes top
    dx: 2,

    draw: function(){
      for(let i = 0; i < this.position.length; i++){ //incrémenter la position dans le tableau
          let p = this.position[i]; //position dans le tableau

          let topYPos = p.y;
          let bottomYPos = p.y + this.h + this.gap;

          //top pipe
          ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

          //bottom pipe
          ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
      }
    },

    update: function(){
      if (state.current !== state.game) return;

      if (frames%100 == 0){
          this.position.push({  //génère aléatoirement la position y
          x: cvs.width,
          y: this.maxYPos * ( Math.random() + 1)
        });
      }
      for (let i = 0;i < this.position.length; i++){
          let p = this.position[i];


          let bottomPipeYPos = p.y + this.h + this.gap;

          //COLLISION DETECTION
          //TOP PIPE
          if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
              state.current = state.gameOver;
          }
          // BOTTOM PIPE
          if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
              state.current = state.gameOver;
          }

          //mouvement des pipes
          p.x -= this.dx;
          //quand le tuyau quitte le canvas on le supprime du tableau
          if(p.x + this.w <= 0){
            this.position.shift();

            score.value += 1;
            score.best = Math.max(score.value, score.best);
            localStorage.setItem("best", score.best);
          }
      }
    }
}

// SCORE
const score= {
  best : parseInt(localStorage.getItem("best")) || 0,
  value : 0,

  draw : function(){
    ctx.fillStyle = "#FFF";
    ctx.stokeStyle = "#000";

    if(state.current == state.game){

      ctx.font = "35px Teko";
      ctx.fillText (this.value, cvs.width/2, 50);
      ctx.strokeText(this.value, cvs.width/2, 50);

    }else if(state.current == state.gameOver){
      //SCORE
      ctx.font = "25px Teko";
      ctx.fillText(this.value, 225, 236);
      ctx.strokeText(this.value, 225, 236);
      //BEST
      ctx.fillText (this.best, 225, 278);
      ctx.strokeText(this.best, 225, 278);
    }
  }
}
// DRAW
function draw(){
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, cvs.width, cvs.height);

  bg.draw();
  pipes.draw();
  fg.draw();
  bird.draw();
  getReady.draw();
  gameOver.draw();
  score.draw();

}
// UPDATE
function update(){
    bird.update();
    fg.update();
    pipes.update();
}

function loop () {
  update();
  draw();
  frames++;

    requestAnimationFrame(loop);
}

loop();
