import createBlocks from './lib/createBlocks'
import Ball from './lib/ball'

var blocks = createBlocks(document.querySelector('.br-out'));
var ball = new Ball(document, document.querySelector('.br-out'));

//game loop
var t0 = 0, dt;
function frame(t) {
  dt = t - t0;
  t0 = t;
  ball.move(dt);
  ball.draw();
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
