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
                  template: '#connector-template'
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
        case 'selecting-color-object':
          if (selectedObject) {
            ele.setAttribute('material', 'color', this.system.color);
            ele.setAttribute('base-color', this.system.color);
            const data = {id: selectedObject.id, color: this.system.color};
            import('../firebase/firebase.js').then((module) => {
              module.updateEntity(data);
            });
          }
          break;
        case 'editing-color':
          if (ele && ele.classList.contains('colorswatch')) {
            this.system.color=ele.getAttribute('newcolor');
            this.system.mode.push('selecting-color-object');
            hideColorPicker();
          }
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
            hide('#hud');
            break;
          case 'add-stuff':
            this.system.mode = ['adding'];
            hide('#hud');
            break;
          case 'remove':
            this.system.mode = ['removing'];
            hide('#hud');
            break;
          case 'move':
            this.system.mode = ['moving'];
            hide('#hud');
            break;
          case 'edit':
            this.system.mode = ['editing'];
            hide('#hud');
            break;
          case 'edit-color':
            this.system.mode = ['editing-color'];
            hide('#hud');
            showColorPicker();
            break;
          case 'align':
            hide('#hud');
            enableAlignment();
            this.system.mode = ['aligning'];
            this.system.mode.push('select-first');
            break;
          default:
            hide('#hud');
        }
        debug(this.system.mode);
      }

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

function showColorPicker() {
  show('#color-picker', '.colorswatch');
}
function hideColorPicker() {
  hide('#color-picker');
}

function showHud() {
  show('#hud', '[widget]');
}

function hide(id) {
  const obj = document.querySelector(id);
  document.querySelector('#right-hand').setAttribute('raycaster', 'objects: .saveable');
  document.querySelector('#left-hand').setAttribute('raycaster', 'objects: .saveable');
  obj.setAttribute('visible', false);

}
function show(id, selector) {
  const obj = document.querySelector(id);
  document.querySelector('#right-hand').setAttribute('raycaster', 'objects' , selector);
  document.querySelector('#left-hand').setAttribute('raycaster', 'objects' , selector);
  obj.setAttribute('position', getHUDPosition(-1));
  obj.setAttribute('visible', true);
}

