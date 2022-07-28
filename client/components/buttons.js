AFRAME.registerComponent('buttons', {
  init: function () {
    this.el.mode = null;
    this.el.addEventListener("bbuttondown", this.bbuttondown.bind(this));
    this.el.addEventListener("bbuttonup", this.bbuttonup.bind(this));
    this.el.addEventListener('triggerdown', this.triggerdown.bind(this));

  },
  bbuttondown: function (evt) {
    this.el.mode = null;
    showHud();
  },
  bbuttonup: function (evt) {
    const hud = document.querySelector('#hud');
    hud.parentElement.removeChild(hud);
  },
  triggerdown: function (event) {
    const ele = document.querySelector('.intersected');
    if (ele) {
      switch (ele.getAttribute('id')) {
        case 'add-universe':
          if (document.querySelector('#keyboard') != null) {
            return;
          }
          createKeyboard();
        case 'remove-universe':
          this.el.mode = 'removing';
          break;
        default:
          if (this.el.mode == 'removing') {
            if (ele.classList.contains('saveable')) {
              import('../firebase/firebase.js').then((module) => {
                module.removeUniverse(ele.getAttribute('id'));
              });
              this.el.mode = null;
            }
          }
          console.log('type not found');
      }
    }
  },
  tick: function () {

  }
});

function showHud() {
  const scene = document.querySelector("a-scene");
  const ele = document.createElement('a-entity');
  ele.setAttribute('id', 'hud');
  ele.setAttribute('lookatme', '');
  ele.setAttribute('position', getHUDPosition(-3));
  ele.setAttribute("template", "src: #hud-template");
  scene.appendChild(ele);
}
