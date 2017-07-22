var importHTML = document.querySelector('link[id="html-templates"]').import;

var el = importHTML.querySelector('.child1-container');

console.log(el);

document.querySelector('.parent-container').insertAdjacentElement('beforeend', el);
