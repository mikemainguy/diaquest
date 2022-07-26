AFRAME.registerComponent('universe', {
  schema: {
    text: {type: 'string'}
  },
  init: function() {
    if (this.el.querySelector('a-plane')) {
      this.el.querySelector('a-plane').setAttribute('text', 'value: '+ this.data.text);
    }
  },
  update: function() {
    if (this.el.querySelector('a-plane')) {
      this.el.querySelector('a-plane').setAttribute('text', 'value: '+ this.data.text);
    }
  }
});
