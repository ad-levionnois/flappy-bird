const cvs = document.getElementById('bird');
const ctx = cvs.getContext('2d');

// LOAD SPRITE IMG
const sprite = new Image();
  sprite.src="sprite.png";

let frame = 0;

// GAME STATE
const state = {
  current : 0,
  getReady : 0,
  game : 1,
  gameOver : 2
}

// CONTROL GAME
cvs.addEventListener("click",function(evt){
  switch (state.current) {
    case state.getReady:
      state.current = state.game;
      break;
    case state.game:
      state.current = state.gameOver;
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

const getReady ={
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

  draw : function(){
    let bird = this.animation [this.frame];

    ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, this.x - this.w/2, this.y -this.h/2, this.w, this.h);
  }
}

// DRAW
function draw(){
  bg.draw();
  fg.draw();
  getReady.draw();
  gameOver.draw();
  bird.draw();
}


function loop () {
  draw();
  requestAnimationFrame(loop);
  frame++;
}

loop();
