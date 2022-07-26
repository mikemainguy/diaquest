AFRAME.registerComponent('key-listen', {
  init: function () {
    this.text = '';
    this.el.setAttribute('text', 'value: ' +  this.text);
    document.addEventListener("a-keyboard-update", this.keypress.bind(this));
  },
  keypress: function(event) {
    const code = parseInt(event.detail.code);
    switch(code) {
      case 8:
        this.text = this.text.slice(0,-1);
        this.el.setAttribute('text', 'value: ' +  this.text);
        break;
      case 6:
        const keyboard = document.querySelector('#keyboard');
        if (keyboard) {
          createUniverse(keyboard, this.text);
          this.text = '';
          keyboard.parentNode.removeChild(keyboard);
        }

        return;
      default:
        this.text += event.detail.value;
        this.el.setAttribute('text', 'value: ' +  this.text);
    }
  },
  tick: function () {

  }
});

function createUniverse(el, text) {
  const scene = document.querySelector('a-scene');
  const ele = document.createElement('a-entity');
  ele.setAttribute('template', 'src: #universe');
  let pos = new THREE.Vector3();
  el.object3D.getWorldPosition(pos);
  ele.setAttribute('position', pos);

  scene.appendChild(ele);
  //stupid hack I don't 100% understand why I need to do this...seems like async load is problem.
  window.setTimeout(function() {
    ele.setAttribute('universe', 'text: ' + text);
  },200);
}


