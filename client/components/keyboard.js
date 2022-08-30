AFRAME.registerSystem('key-listen', {
  init: function () {
    this.text = '';
    this.id = null;

    document.addEventListener("a-keyboard-update", this.keypress.bind(this));
    document.addEventListener("key-listen-target", this.targetListener.bind(this));
  },
  targetListener: function (event) {
    this.keyboard = this.targetEl.parentEl;
    if (event.detail.id) {
      this.id = event.detail.id;
      if (this.id) {
        const ele = document.querySelector('#' + this.id);
        if (ele) {
          const txt = ele.querySelector('a-plane');
          this.template = ele.closest('[template]').getAttribute('template').src;

          if (txt) {
            this.text = txt.getAttribute('text').value;
          }
        }
      } else {
        this.id = null;
        this.text = '';
      }
    }
    showKeyboard(this);

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
          const data = {id: this.id, text: this.text};
          if (data.id) {
            import('../firebase/firebase.js').then((module) => {
              module.updateEntity(data);
            });
          } else {
            let pos = new THREE.Vector3();
            this.keyboard.object3D.getWorldPosition(pos);
            data.id = createUUID();
            data.position = pos;
            data.template = this.template;
            import('../firebase/firebase.js').then((module) => {
              module.writeEntity(data);
            });
          }
        }
        //we intentionally fall through to cancel here.
      case 24:
        hideKeyboard(this);
        break;
      default:
        this.text += event.detail.value;
        this.targetEl.setAttribute('text', 'value: ' + this.text);
    }
  },
})
function hideKeyboard(obj) {
  obj.text = '';
  obj.id = null;
  document.querySelector('#right-hand').setAttribute('raycaster', 'objects: .saveable');
  document.querySelector('#left-hand').setAttribute('raycaster', 'objects: .saveable');
  obj.keyboard.setAttribute('visible', false);
  const buttons = document.querySelector('a-scene').systems['buttons'];
  buttons.mode.pop();
}

function showKeyboard(obj) {
  obj.keyboard.setAttribute('visible', true);
  obj.keyboard.setAttribute('position', getHUDPosition());
  document.querySelector('#right-hand').setAttribute('raycaster', 'objects: .collidable');
  document.querySelector('#left-hand').setAttribute('raycaster', 'objects: .collidable');
  if (obj.targetEl) {
    obj.targetEl.setAttribute('text', 'value: ' + obj.text);
  }
}
AFRAME.registerComponent('key-listen', {
  init: function () {
    this.system.targetEl = this.el;
  }
});


function createUUID() {
  return 'id' + ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}


