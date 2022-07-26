AFRAME.registerComponent('universe', {
  schema: {
    text: {type: 'string'}
  },
  init: function() {
    this.el.querySelector('a-plane').setAttribute('text', 'value: '+ this.data.text);
  },
  update: function() {
    this.el.querySelector('a-plane').setAttribute('text', 'value: '+ this.data.text);
  }
});
