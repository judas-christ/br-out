var forEach = Array.prototype.forEach,
  slice = Array.prototype.slice,
  map = Array.prototype.map,
  filter = Array.prototype.filter,
  reduce = Array.prototype.reduce,
  flatten = function() {
    return reduce.call(this, function(a, b) {
      return a.concat(b);
    });
  };

export { forEach, slice, map, filter, flatten };
