function debug(value) {
  const debug = document.querySelector("#debug")
  if (debug) {
    debug.setAttribute('text', 'value: ' + value);
  }
}
function vectorString(vector) {
  return vector.x + " " + vector.y + " " + vector.z;
}
window.addEventListener('keydown', (event) => {
  console.log(event.code);
  if (event.code=='KeyI') {
    generateWorlds(100);
  }
});
function generateWorlds(count) {
  import('../firebase/firebase.js').then((module) => {
    for (let i = 0; i< count; i++) {
      const max = 50;
      const pos = new THREE.Vector3(
        (Math.random()*max)-(max/2),
           (Math.random()*max)-(max/2),
        (Math.random()*max)-(max/2));
      module.createUniverse(createUUID(), pos, pos.x + ' ' + pos.y + ' ' + pos.z);
    }
  });
}
