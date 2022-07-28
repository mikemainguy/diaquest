AFRAME.registerComponent('collider', {
  schema: {
    type: {type: 'string'},
    color: {default: '#fff'}
  },
  init: function () {
    this.basecolor = this.el.getAttribute('color');
    this.el.addEventListener('raycaster-intersected', (event) => {
      this.el.setAttribute("color", this.data.color);
      this.el.classList.add('intersected');
    });
    this.el.addEventListener('raycaster-intersected-cleared', (event) => {
      this.el.setAttribute("color", this.basecolor);
      this.el.classList.remove('intersected');
    });

  }

});

function createKeyboard() {
  const ele = document.createElement('a-entity');
  ele.setAttribute("id", "keyboard");
  ele.setAttribute('position', getHUDPosition());
  ele.setAttribute('lookatme', '');
  ele.setAttribute("template", "src: #keys");
  const scene = document.querySelector("a-scene");
  scene.appendChild(ele);

}

function getHUDPosition(distance) {
  let pos = new THREE.Vector3();
  const obj = document.querySelector('#camera').object3D;
  obj.getWorldPosition(pos);
  let dir = new THREE.Vector3();
  obj.getWorldDirection(dir);
  dir.y += 0.25;
  dir.multiplyScalar(distance ? distance : -1);
  pos.add(dir);
  return pos;
}

function drawLine(start, end) {
  const ele = document.createElement('a-entity');
  const sphere = document.createElement('a-sphere');
  sphere.setAttribute("position", vectorString(start));
  ele.setAttribute("line", "start: " + vectorString(start) + ";end: " + vectorString(end));

  document.querySelector('a-scene').appendChild(ele);
}

function vectorString(vector) {
  return vector.x + " " + vector.y + " " + vector.z;
}
