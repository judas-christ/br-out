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

export default Pad;
