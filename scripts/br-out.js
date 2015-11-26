(function () { 'use strict';

  var forEach = Array.prototype.forEach;
  var slice = Array.prototype.slice;
  var reduce = Array.prototype.reduce;
  var flatten = function() {
      return reduce.call(this, function(a, b) {
        return a.concat(b);
      });
    };

  function createBlocks(element) {
    var childNodes = element.childNodes;
    // console.log(element, childNodes);
    return flatten.call(slice.call(childNodes, 0).map(handleNode));
  }

  function handleNode(node) {
    // console.log(node.nodeType, node);
    if(node.nodeType === 3) {
      // text node, do stuff
      return makeBlocks(node);
    } else if(node.nodeType === 1) {
      // element node
      // recurse
      return createBlocks(node);
    }
  }

  function makeBlocks(textNode) {
    var blocks = [];
    var frag = document.createDocumentFragment();
    var text = textNode.textContent;
    var texts = text.split(/\s+/g);
    //TODO: handle the case where there's a single word without spaces in this node
    var space = document.createTextNode(' ');
    forEach.call(texts, function(str) {
      if(/\S/.test(str)) {
        var block = document.createElement('span');
        block.textContent = str;
        block.className = 'br-out__block';
        frag.appendChild(block);
        frag.appendChild(space.cloneNode());
        blocks.push(block);
      }
    });
    textNode.parentNode.replaceChild(frag, textNode);
    return blocks;
  }

  var acceleration = 0.005;
  var v0 = 0.2;
  var vMax = v0 + acceleration * 50;

  function Ball(parent) {
    var document = parent.ownerDocument;
    var element = document.createElement('span');
    element.className = 'br-out__ball';
    this.x = parent.clientWidth / 2;
    this.y = 0;
    this.a = Math.PI / 4 * (Math.random() - Math.random());
    this.v = v0;
    this.el = element;
    parent.appendChild(element);
  }

  Ball.prototype = {
    move: function(dt) {
      var that = this;
      that.x += Math.sin(that.a) * that.v * dt;
      that.y -= Math.cos(that.a) * that.v * dt;
    },
    draw: function() {
      var el = this.el;
      el.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)';
    },
    checkCollision: function(other) {
      var myBounds = this.el.getBoundingClientRect();
      var otherBounds = other.getBoundingClientRect();
      // console.log(otherBounds);
      return !(myBounds.top > otherBounds.bottom
        || myBounds.bottom < otherBounds.top
        || myBounds.right < otherBounds.left
        || myBounds.left > otherBounds.right);
    },
    checkPadCollision: function(other) {
      var myBounds = this.el.getBoundingClientRect();
      var otherBounds = other.getBoundingClientRect();
      return (myBounds.top > otherBounds.bottom
        || myBounds.bottom < otherBounds.top
        || myBounds.right < otherBounds.left
        || myBounds.left > otherBounds.right)
        ? false
        : ((myBounds.left + myBounds.width / 2) - (otherBounds.left + otherBounds.width / 2)) / otherBounds.width / 2;
    },
    checkWallBounce: function() {
      var el = this.el;
      var parent = el.parentNode;

      var myBounds = el.getBoundingClientRect();
      var parentBounds = parent.getBoundingClientRect();

      if(myBounds.left < parentBounds.left
        || myBounds.right > parentBounds.right) {
        return 1;
      } else if(myBounds.top < parentBounds.top) {
        return 2;
      } else if(myBounds.bottom > parentBounds.bottom) {
        return 3;
      }
      return 0;
    },
    bounce: function(onWall, padAngle) {
      if(onWall) {
        this.a = -this.a;
      } else if(typeof padAngle !== 'undefined') {
        this.a = padAngle * Math.PI;
      } else {
        this.a += Math.PI - this.a*2;
      }
      this.v = Math.min(vMax, this.v + acceleration);
    },
    reset: function() {
      var parent = this.el.parentNode;
      this.x = parent.clientWidth / 2;
      this.y = 0;
      this.a = Math.PI / 4 * (Math.random() - Math.random());
      this.v = v0;
    }
  };

  function Pad(parent) {
    var document = parent.ownerDocument;
    var element = document.createElement('span');
    element.className = 'br-out__pad';
    this.x = parent.clientWidth / 2;
    this.el = element;
    parent.appendChild(element);
    document.documentElement.addEventListener('mousemove', this.move.bind(this));
  }

  Pad.prototype = {
    move: function(e) {
      var parent = this.el.parentNode;
      this.x = Math.min(parent.offsetWidth - this.el.offsetWidth, Math.max(0, e.pageX - parent.offsetLeft));
    },
    draw: function() {
      this.el.style.transform = 'translateX(' + this.x + 'px)';
    }
  };

  var container = document.querySelector('.br-out');
  var blocks = createBlocks(container);
  var ball = new Ball(container);
  var pad = new Pad(container);

  document.documentElement.addEventListener('click', function() {
    if(!playing) playing = true;
  });

  //game loop
  var t0 = 0;
  var dt;
  var playing = false;
  function frame(t) {
    dt = t - t0;
    t0 = t;
    if(playing) {
      ball.move(dt);
      ball.draw();
      pad.draw();

      // TODO: make sure ball stays inside bounds and doesn't collide with same thing many times in a row
      // TODO: use wall bounce when ball bounces on side of block
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
          playing = false;
          break;
      }

    } else {
      // waiting for player to start play
      ball.x = pad.x + pad.el.clientWidth / 2;
      ball.draw();
      pad.draw();
    }


    if(blocks.length > 0) {
      requestAnimationFrame(frame);
    } else {
      console.log('woohoo!');
    }
  }
  requestAnimationFrame(frame);

})();