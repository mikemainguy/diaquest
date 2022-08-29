AFRAME.registerSystem('buttons', {
  init: function () {
    this.mode = [];
    this.id = null;
  }
});

AFRAME.registerComponent('buttons', {
  init: function () {
    this.el.addEventListener("bbuttondown", this.bbuttondown.bind(this));
    this.el.addEventListener("bbuttonup", this.bbuttonup.bind(this));
    this.el.addEventListener('triggerdown', this.triggerdown.bind(this));
  },
  bbuttondown: function (evt) {
    this.template = '#universe';
    showHud();
  },
  triggerdown: function (evt) {
    const ele = document.querySelector('.intersected');
    if (this.system.mode.length == 0 && ele == null) {
      debug('nothing intersected');
      return;
    }
    if ((ele && ele.classList.contains('saveable')) || this.system.mode.length > 0) {
      const template = ele ? ele.closest('[template]') : null;
      if (template && template.id && template.id != '') {
        debug(template.id);
      }
      switch (this.system.mode.length > 0 ? this.system.mode.slice(-1)[0] : null) {
        case 'select-first':
          debug('first selected: ' + template.id);
          this.system.first = template.id;
          this.system.mode.pop();
          this.system.mode.push('select-second');
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
            this.system.mode.pop();
            this.system.mode.push('select-first');
          });
          break;
        case 'removing':
          import('../firebase/firebase.js').then((module) => {
            module.removeEntity(template.id);
          });
          break;
        case 'editing':
            this.system.mode.push('typing');
            this.el.emit('key-listen-target', {id: template.id}, true);
            createKeyboard();
          break;
        case 'adding':
          this.system.id = null;
          this.system.mode.push('typing');
          this.el.emit('key-listen-target', {id: null}, true);
          createKeyboard();
        case 'moving':
          this.system.mode.pop();
          this.system.mode.push('moving');
          if (template) {
            this.system.id = template.id;
            debug('moving: ' + template.id);
          } else {
            debug('movement cleared: ');
            this.system.id = null;
          }
      }
      if (this.system.mode.length > 0) {
        debug(this.system.mode[-1]);
      }
    }

  },
  bbuttonup:
    function (event) {
      const ele = document.querySelector('.intersected');
      if (ele) {
        switch (ele.getAttribute('id')) {
          case 'add-connector':
            this.system.mode = ['select-first'];
            break;
          case 'add-universe':
            if (document.querySelector('#keyboard') != null) {
              return;
            }
            this.system.mode = ['adding'];
            break;
          case 'remove':
            this.system.mode = ['removing'];
            break;
          case 'move':
            this.system.mode = ['moving'];
            break;
          case 'edit':
            this.system.mode = ['editing'];
            break;
        }
        debug(this.system.mode);
      }
      const hud = document.querySelector('#hud');
      hud.parentElement.removeChild(hud);
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

function createKeyboard() {

}

