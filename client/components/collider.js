AFRAME.registerComponent('collider', {
  schema: {
    type: {type: 'string'},
    color: {default: '#ff0'}
  },
  init: function () {

    this.basecolor = this.el.getAttribute('color');
    this.el.addEventListener('raycaster-intersected', (event) => {
      this.el.setAttribute("color", this.data.color);
      const intersected = document.querySelectorAll('.intersected');
      for(const obj of intersected) {
        if (obj && obj.classList) {
          obj.classList.remove('intersected');
        }
      }
      const save = this.el.closest('[template]');
      /*if (save && save.id) {
        debug(save.id);
        debug(this.el.id);
      }

       */
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
  const c = document.querySelector('#camera').object3D;
  c.getWorldPosition(pos);
  let dir = new THREE.Vector3();
  c.getWorldDirection(dir);
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

