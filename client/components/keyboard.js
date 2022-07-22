AFRAME.registerComponent('key-listen', {
  schema: {
    keyboard: {default: '#keyboard', type: 'selector'}
  },
  init: function () {
    document.addEventListener("a-keyboard-update", this.keypress.bind(this));
    let pos = new THREE.Vector3();
    this.el.object3D.getWorldPosition(pos);
    pos.x = pos.x-.7;
    pos.y = pos.y-1.4;
    this.data.keyboard.setAttribute('rotation', '-30 0 0');
    this.data.keyboard.setAttribute('position', pos);
  },
  keypress: function(event) {
    console.log(event);
    const code = parseInt(event.detail.code);
    switch(code) {
      case 8:
        this.el.setAttribute('text', 'value: ' + this.el.getAttribute('text').value.slice(0,-1);
        break;
      case 6:
        this.data.keyboard.parent.removeChild(this.data.keyboard);
      default:
        this.el.setAttribute('text', 'value: ' + this.el.getAttribute('text').value + event.detail.value);
    }


  },
  tick: function () {

  }
});

