var acceleration = 0.005;
var v0 = 0.2;

function Ball(document, parent) {
  var element = document.createElement('span');
  element.className = 'br-out__ball';
  parent.appendChild(element);
  this.x = parent.offsetLeft + parent.clientWidth / 2;
  this.y = -10;
  this.a = Math.PI / 4 * (Math.random() - Math.random());
  this.v = v0;
  this.el = element;
  //get middle of parent
}

Ball.prototype = {
  move: function(dt) {
    var that = this;
    that.x += Math.sin(that.a) * that.v * dt;
    that.y -= Math.cos(that.a) * that.v * dt;
  },
  draw: function(ctx) {
    // console.log('Ball', this.x, this.y, this.a, this.v);
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
  bounce: function(onWall) {
    if(onWall) {
      this.a = -this.a;
    } else {
      this.a += Math.PI - this.a*2;
      // console.log('new angle',this.a);
    }
    this.v += acceleration;
  },
  reset: function() {
    // console.log('reset!');
    var parent = this.el.parentNode;
    this.x = parent.clientWidth / 2;
    this.y = -10;
    this.a = Math.PI / 4 * (Math.random() - Math.random());
    this.v = v0;
  }
};

export default Ball;
