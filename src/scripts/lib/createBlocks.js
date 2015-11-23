import { forEach, map, flatten, slice } from './arrayUtils'

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

export default createBlocks;
