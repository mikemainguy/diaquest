require('aframe');
require('aframe-extras');
require('nunjucks');
require('aframe-super-keyboard');
require('aframe-template-component');

function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('../client/components/', true, /\.js$/));
requireAll(require.context('../client/firebase/', true, /\.js$/));
