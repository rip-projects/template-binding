const SLOT_SUPPORTED = 'HTMLUnknownElement' in window && !(document.createElement('slot') instanceof window.HTMLUnknownElement);

function slotName (element) {
  return SLOT_SUPPORTED ? element.name : element.getAttribute('name');
}

function slotAppend (slot, node, root) {
  if (!slot.__slotHasChildren) {
    slot.__slotHasChildren = true;
    slot.__slotFallbackContent = slot.innerHTML;
    slot.innerHTML = '';
  }

  if (node instanceof window.Node) {
    slot.appendChild(node);
  } else {
    node.forEach(node => slot.appendChild(node));
  }
}

// function elementSlot (element) {
//   return SLOT_SUPPORTED ? element.slot : element.getAttribute('slot');
// }

export { slotName, slotAppend };
