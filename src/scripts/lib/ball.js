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

export default Ball;
