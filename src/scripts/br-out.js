import createBlocks from './lib/createBlocks'
import Ball from './lib/ball'
import Pad from './lib/pad'

var container = document.querySelector('.br-out');
var blocks = createBlocks(container);
var ball = new Ball(container);
var pad = new Pad(container);

//game loop
var t0 = 0, dt;
function frame(t) {
  dt = t - t0;
  t0 = t;
  ball.move(dt);
  ball.draw();
  pad.draw();

  var padCollision = ball.checkPadCollision(pad.el);
  if(padCollision !== false) {
    ball.bounce(false, padCollision);
    console.log(padCollision, ball.a);
  } else {
    for(var l=blocks.length-1, block;l>=0;l--) {
      block = blocks[l];
      if(!block.classList.contains('br-out__block--broken') && ball.checkCollision(block)) {
        block.classList.add('br-out__block--broken');
        blocks.splice(l, 1);
        // console.log('blocks:', blocks.length);
        ball.bounce();
        break;
      }
    }
  }

  var wallBounce = ball.checkWallBounce();
  switch(wallBounce) {
    case 1:
      ball.bounce(true);
      break;
    case 2:
      ball.bounce();
      break;
    case 3:
      // out of bounds
      ball.reset();
      break;
  }


  if(blocks.length > 0) {
    requestAnimationFrame(frame);
  } else {
    console.log('woohoo!');
  }
}
requestAnimationFrame(frame);
