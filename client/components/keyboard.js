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

