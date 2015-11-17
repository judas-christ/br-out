(function () { 'use strict';

  var forEach = Array.prototype.forEach;

  function test() {
    forEach.call('testing testing'.split(' '), console.log.bind(console));
  }

  function createBlocks(element) {
    forEach.call(element.childNodes, handleNode);
  }

  function handleNode(node) {
    if(node.nodeType === 3) {
      // text node, do stuff
      makeBlocks(node);
    } else if(node.nodeType === 1) {
      // element node
      // recurse
      createBlocks(node);
    }
  }

  function makeBlocks(textNode) {
    var frag = document.createDocumentFragment();
    var text = textNode.textContent;
    var texts = text.split(/\s+/g);
    //TODO: handle the case where there's a single word without spaces in this node
    var space = document.createTextNode(' ');
    forEach.call(texts, function(str) {
      var block = document.createElement('span');
      block.textContent = str;
      block.className = 'br-out__block';
      frag.appendChild(block);
      frag.appendChild(space.cloneNode());
    });
    textNode.parentNode.replaceChild(frag, textNode);
  }

  test();

  createBlocks(document.querySelector('.br-out'));

})();