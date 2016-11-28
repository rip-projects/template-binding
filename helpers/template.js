function fix (template) {
  if (!template.content && window.HTMLTemplateElement && window.HTMLTemplateElement.decorate) {
    window.HTMLTemplateElement.decorate(template);
  }
  return template;
};

export { fix };
