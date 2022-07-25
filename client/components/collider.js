AFRAME.registerComponent('collider', {
  init: function() {
    this.basecolor = this.el.getAttribute('color');
    this.el.addEventListener('raycaster-intersected', (event) => {
      this.el.setAttribute("color", "#ff0");
      event.detail.el.touching = this;
      event.detail.el.addEventListener("triggerdown", this.triggerdown);
    });
    this.el.addEventListener('raycaster-intersected-cleared', (event) => {
      this.el.setAttribute("color", this.basecolor);
      event.detail.el.removeEventListener("triggerdown", this.triggerdown);
      event.detail.el.removeEventListener("triggerup", this.triggerup);
    });
  },
  triggerdown: (event) => {
    if (document.querySelector('#keyboard') != null) {
      return;
    }
    createKeyboard(event.currentTarget);
  },
  triggerup: (event) => {

  }
})
function createKeyboard(target) {
  const ele = document.createElement('a-entity');
  ele.setAttribute("id", "keyboard");
  let pos = new THREE.Vector3();
  const obj = target.parentEl.object3D;
  obj.getWorldPosition(pos);
  let dir = new THREE.Vector3();

  obj.getWorldDirection(dir);

  dir.multiplyScalar(-2);
  const start = Object.assign({}, pos);
  pos.add(dir);
  const end = pos;
  drawLine(start, end);

  pos.y += 1.2;
  ele.setAttribute('position', pos);
  ele.setAttribute('lookatme', '');
  ele.setAttribute("template", "src: #keys");

  const scene = document.querySelector("a-scene");
  scene.appendChild(ele);

}
function drawLine(start, end) {
  const ele = document.createElement('a-entity');
  const sphere = document.createElement('a-sphere');
  sphere.setAttribute("position", vectorString(start));
  ele.setAttribute("line", "start: " + vectorString(start)+ ";end: " + vectorString(end));

  document.querySelector('a-scene').appendChild(ele);
}
function vectorString(vector) {
  return vector.x + " " + vector.y + " " + vector.z;
}
