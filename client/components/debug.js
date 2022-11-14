export function debug(value) {
  if (false) {
    const debug = document.getElementById("debug")
    if (debug) {
      const lines = debug.getAttribute('text').value;
      const data = lines.split('\n').slice(-20);
      data.push(value)
      debug.setAttribute('text', 'value', data.join('\n'));
      console.log(value);
    }
  }
}

function vectorString(vector) {
  return vector.x + " " + vector.y + " " + vector.z;
}
