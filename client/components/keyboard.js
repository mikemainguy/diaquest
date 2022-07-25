AFRAME.registerComponent('key-listen', {
  schema: {
    keyboard: {default: '#keyboard', type: 'selector'}
  },
  init: function () {
    document.addEventListener("a-keyboard-update", this.keypress.bind(this));
  },
  keypress: function(event) {
    const code = parseInt(event.detail.code);
    switch(code) {
      case 8:
        this.el.setAttribute('text', 'value: ' + this.el.getAttribute('text').value.slice(0,-1));
        break;
      case 6:
        const keyboard = document.querySelector('#keyboard');
        if (keyboard) {
          keyboard.parentNode.removeChild(keyboard);
        }

        return;
      default:
        const current = this.el.getAttribute('text').value;
        debug("'" + 'value: ' + current + event.detail.value + "'");
        this.el.setAttribute('text', 'value: ' + current + event.detail.value);
    }
  },
  tick: function () {

  }
});

