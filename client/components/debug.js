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
