AFRAME.registerSystem('buttons', {
  init: function () {
    this.mode = null;
  }
});
AFRAME.registerComponent('buttons', {
  init: function () {
    this.system.mode = null;
    this.el.addEventListener("bbuttondown", this.bbuttondown.bind(this));
    this.el.addEventListener("bbuttonup", this.bbuttonup.bind(this));
    this.el.addEventListener("abuttondown", (evt) => {
      generateWorlds(100);
    });
    this.el.addEventListener('triggerdown', this.triggerdown.bind(this));

  },
  bbuttondown: function (evt) {
    this.system.mode = null;
    this.template = '#universe';
    showHud();
  },
  triggerdown: function (evt) {
    const ele = document.querySelector('.intersected');
    const parent = ele ? ele.parentNode : null;
    if (ele == null && this.system.mode != 'adding') {
      debug('nothing intersected');
      return;
    }
    if ((ele && ele.classList.contains('saveable')) || this.system.mode == 'adding') {
      debug(this.system.mode);
      const template = ele.closest('[template]');
      if (template && template.id && template.id != '') {
        debug(template.id);
      }
      switch (this.system.mode) {
        case 'select-first':
          debug('first selected: ' + template.id);
          this.system.first = template.id;
          this.system.mode = 'select-second';
          debug(this.system.mode);
          break;
        case 'select-second':
          debug('second selected: ' + template.id);
          import('../firebase/firebase.js').then((module) => {
            const data = {
              id: createUUID(),
              first: this.system.first,
              second: template.id,
              text: '',
              template: '#connector'
            }
            module.writeEntity(data);
            this.system.mode = 'select-first';
            debug(this.system.mode);
          });
          break;
        case 'removing':
          import('../firebase/firebase.js').then((module) => {
            module.removeEntity(template.id);
          });
          break;
        case 'adding':
            this.system.mode = 'typing';
            createKeyboard();

      }

    }

  },
  bbuttonup:
    function (event) {
      const ele = document.querySelector('.intersected');
      if (ele) {
        switch (ele.getAttribute('id')) {
          case 'add-connector':
            this.system.mode = 'select-first'
            break;
          case 'add-universe':
            if (document.querySelector('#keyboard') != null) {
              return;
            }
            this.system.mode = 'adding';
            break;
          case 'remove':
            this.system.mode = 'removing';
            break;
        }
        debug(this.system.mode);
      }
      const hud = document.querySelector('#hud');
      hud.parentElement.removeChild(hud);
    }

  ,
  tick: function () {

  }
})
;

function showHud() {
  const scene = document.querySelector("a-scene");
  const ele = document.createElement('a-entity');
  ele.setAttribute('id', 'hud');
  ele.setAttribute('lookatme', '');
  ele.setAttribute('position', getHUDPosition(-3));
  ele.setAttribute("template", "src: #hud-template");
  scene.appendChild(ele);
}
