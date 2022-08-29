AFRAME.registerComponent('aligner', {
  init: function () {
    this.mover = document.querySelector('a-scene').systems['mover'];
    this.mover.disable();
    this.handler = this.thumbstick.bind(this);
    this.el.addEventListener('thumbstickmoved', this.handler);
    this.triggered = false;
    this.distance = null;
  },
  remove: function () {
    this.el.removeEventListener('thumbstickmoved', this.handler);
    const aligner = document.querySelector("#aligner");
    aligner.setAttribute('visible', false);
    this.mover.enable();
  },
  thumbstick: function (evt) {
    if (this.triggered) {
      if (Math.abs(evt.detail.x) < .1 && Math.abs(evt.detail.y) < .1) {
        this.triggered = false;
      }
      return;
    }
    this.triggered = true;
    const buttons = this.el.sceneEl.systems['buttons'];
    const aligner = document.querySelector("#aligner");
    if (!buttons.first) {
      return;
    }
    const firstEl = document.querySelector('#' + buttons.first).closest('[template]');
    aligner.setAttribute('position', firstEl.getAttribute('position'));
    aligner.setAttribute('visible', true);

    if (!buttons.second) {
      return;
    }
    const secondEl = document.querySelector('#' + buttons.second).closest('[template]');
    const firstPos = firstEl.getAttribute('position');
    const secondPos = secondEl.getAttribute('position');
    if (this.distance == null) {
      this.distance = firstEl.object3D.position.distanceTo(secondEl.object3D.position);
    }

    const endpoint = aligner.querySelector('a-sphere');
    this.distance += (Math.sign(evt.detail.y) * .25);
    endpoint.setAttribute('position', "0 " + this.distance + "0");
    aligner.querySelector('a-cylinder').setAttribute('height', this.distance * 2);
    const newPos = new THREE.Vector3(firstPos.x, this.distance + firstPos.y, firstPos.z);
    secondEl.setAttribute('position', newPos);
  }
});

function align(el1, el2, distance) {

}
