AFRAME.registerSystem('buttons', {
  init: function () {
    this.mode = [];
    this.first = null;
    this.second = null;
  }
});

AFRAME.registerComponent('buttons', {
  init: function () {
    this.el.addEventListener("bbuttondown", this.bbuttondown.bind(this));
    this.el.addEventListener("bbuttonup", this.bbuttonup.bind(this));
    this.el.addEventListener('triggerdown', this.triggerdown.bind(this));
  },
  bbuttondown: function (evt) {
    disableAlignment();
    showHud();
  },
  triggerdown: function (evt) {
    const ele = document.querySelector('.intersected');
    if (this.system.mode.length == 0 && ele == null) {
      debug('nothing intersected');
      return;
    }
    if ((ele && ele.classList.contains('saveable')) || this.system.mode.length > 0) {
      const selectedObject = ele ? ele.closest('[template]') : null;
      if (selectedObject && selectedObject.id && selectedObject.id != '') {
        debug(selectedObject.id);
      }
      switch (this.system.mode.length > 0 ? this.system.mode.slice(-1)[0] : null) {
        case 'select-first':
          this.system.first = selectedObject.id;
          this.system.mode.push('select-second');
          break;
        case 'select-second':
          switch (this.system.mode[0]) {
            case 'connecting':
              import('../firebase/firebase.js').then((module) => {
                const data = {
                  id: createUUID(),
                  first: this.system.first,
                  second: selectedObject.id,
                  text: '',
                  template: '#connector'
                }
                module.writeEntity(data);
              });
              this.system.mode.pop();
              break;
            case 'aligning':
              if (!selectedObject && this.system.second) {
                const data = {id: this.system.second, position: document.querySelector(this.system.second).getAttribute('position')};
                import('../firebase/firebase.js').then((module) => {
                  module.updateEntity(data);
                });
                this.system.second = null;
                this.system.mode.pop();
              } else {
                if (selectedObject) {
                  this.system.second = selectedObject.id;
                }
              }
              break;
          }
          break;
        case 'removing':
          import('../firebase/firebase.js').then((module) => {
            module.removeEntity(selectedObject.id);
          });
          break;
        case 'editing':
          this.system.mode.push('typing');
          this.el.emit('key-listen-target', {id: selectedObject.id}, true);
          break;
        case 'adding':
          this.system.first = null;
          this.system.mode.push('typing');
          this.el.emit('key-listen-target', {id: null}, true);
          break;
        case 'moving':
          if (selectedObject) {
            this.system.first = selectedObject.id;
            debug('moving: ' + selectedObject.id);
          } else {
            debug('movement cleared: ');
            this.system.first = null;
          }
      }
      if (this.system.mode.length > 0) {
        debug(JSON.stringify(this.system.mode));
      }
    }

  },
  bbuttonup:
    function (event) {
      const ele = document.querySelector('.intersected');
      if (ele) {
        switch (ele.getAttribute('id')) {
          case 'add-connector':
            this.system.mode = ['connecting'];
            this.system.mode.push('select-first');
            break;
          case 'add-universe':
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
          case 'align':
            enableAlignment();
            this.system.mode = ['aligning'];
            this.system.mode.push('select-first');
            break;
        }
        debug(this.system.mode);
      }
      const hud = document.querySelector('#hud');
      hud.setAttribute('visible', false);
      document.querySelector('#right-hand').setAttribute('raycaster', 'objects: [collider]');
    },
  tick: function () {

  }
});
function disableAlignment() {
  const hand = document.querySelector('#right-hand');
  hand.removeAttribute('aligner');
}
function enableAlignment() {
  const hand = document.querySelector('#right-hand');
  hand.setAttribute('aligner', '');
}
function showHud() {
  const hud = document.querySelector('#hud');
  document.querySelector('#right-hand').setAttribute('raycaster', 'objects: .widget');
  hud.setAttribute('position', getHUDPosition(-3));
  hud.setAttribute('visible', true);
}


