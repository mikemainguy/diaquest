AFRAME.registerSystem('key-listen', {
  init: function() {
    this.text = '';
    this.id = null;

    document.addEventListener("a-keyboard-update", this.keypress.bind(this));
    document.addEventListener( "key-listen-target", this.targetListener.bind(this));
  },
  targetListener: function(event) {
    if (event.detail.id) {
      this.keyboard = this.targetEl.parentEl;
      this.id = event.detail.id;
      this.text = document.querySelector('#'+ this.id).querySelector('a-plane').getAttribute('text').value;

      this.keyboard.setAttribute('visible', true);
      this.keyboard.setAttribute('position', getHUDPosition());

      if (this.targetEl) {

        this.targetEl.setAttribute('text', 'value: ' + this.text);
      }
    }
  },
  keypress: function (event) {
    const code = parseInt(event.detail.code);
    const click = document.querySelector('#click').components.sound;
    click.stopSound();
    click.playSound();
    switch (code) {
      case 8:
        this.text = this.text.slice(0, -1);
        this.targetEl.setAttribute('text', 'value: ' + this.text);
        break;
      case 6:
        if (this.keyboard) {
          if (this.id) {
            const data = {id: this.id, text: this.text};
            import('../firebase/firebase.js').then((module) => {
              module.updateEntity(data);
            });
          } else {
            let pos = new THREE.Vector3();
            this.keyboard.object3D.getWorldPosition(pos);
            data.id = createUUID();
            data.position = pos;
            data.template = "#universe";

            import('../firebase/firebase.js').then((module) => {
              module.writeEntity(data);
            });
          }

        }

      case 24:
        this.text = '';
        this.keyboard.setAttribute('visible', false);
        break;
      default:
        this.text += event.detail.value;
        this.targetEl.setAttribute('text', 'value: ' + this.text);
    }
  },
})

AFRAME.registerComponent('key-listen', {
  init: function () {
    this.system.targetEl = this.el;
  }
});


function createUUID() {
  return 'id'+ ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}


