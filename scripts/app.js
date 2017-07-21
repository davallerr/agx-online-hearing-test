var importContent = document.querySelector('link[rel="import"]').import;

var el = importContent.querySelector('.child1-container');

console.log(el);

document.querySelector('.parent-container').insertAdjacentElement('beforeend', el);
