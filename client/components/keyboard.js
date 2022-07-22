AFRAME.registerComponent('key-listen', {
  schema: {
    keyboard: {default: '#keyboard', type: 'selector'}
  },
  init: function () {
    this.data.keyboard.addEventListener("input", this.keypress.bind(this));
    this.data.keyboard.addEventListener("backspace", this.backspace.bind(this));
    let pos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(pos);
    pos.x = pos.x-.7;
    pos.y = pos.y-1.4;
    this.data.keyboard.setAttribute('rotation', '-30 0 0');
    this.data.keyboard.setAttribute('position', pos);
  },
  keypress: function(event) {
    if (event.detail) {
      if (event.detail == '\n') {
        this.data.keyboard.emit('dismiss','');
        this.el.removeAttribute('key-listen');
      } else {
        this.el.setAttribute('text', 'value: ' + this.el.getAttribute('text').value + event.detail);
      }
    }
  },
  backspace: function(event) {
    this.el.setAttribute('text', 'value: ' + this.el.getAttribute('text').value.slice(0,-1));
  },
  tick: function () {

  }
});

