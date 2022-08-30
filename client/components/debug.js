function debug(value) {
  const debug = document.querySelector("#debug")
  if (debug) {
    const lines = debug.getAttribute('text').value;
    const data = lines.split('\n').slice(-20);
    data.push(value)
    debug.setAttribute('text', 'value', data.join('\n'));
  }
}

function vectorString(vector) {
  return vector.x + " " + vector.y + " " + vector.z;
}

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
