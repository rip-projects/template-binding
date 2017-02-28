function fix (template) {
  if (!template.content && window.HTMLTemplateElement && window.HTMLTemplateElement.decorate) {
    window.HTMLTemplateElement.decorate(template);
  }
  return template;
};

function needFixImportNode () {
  console.log('needFixImportNode?');
  if (document._xImportNode) {
    // already fixed
    return false;
  }
  let template = document.createElement('template');
  template.innerHTML = '<template>i</template>';
  let imported = document.importNode(template.content, true);
  return imported.firstChild.content.firstChild !== 'i';
}

if (needFixImportNode()) {
  console.log('fixed importNode');

  let importNode = document._xImportNode = document.importNode;
  document.importNode = function (node, deep) {
    if (!deep) {
      return importNode(node, deep);
    }

    let sourceTpls = [].slice.call(node.querySelectorAll('template'));
    let imported = document._xImportNode(node, deep);
    [].forEach.call(imported.querySelectorAll('template'), (child, i) => {
      child.innerHTML = sourceTpls[i].innerHTML;
    });

    return imported;
  };
}

export { fix };
