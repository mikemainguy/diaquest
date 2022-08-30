AFRAME.registerComponent('universe', {
  schema: {
    text: {type: 'string'},
    color: {type: 'string'}
  },
  init: function() {

  },
  update: function() {
    if (this.el.querySelector('a-plane')) {
      if (this.data.text) {
        this.el.querySelector('a-plane').setAttribute('visible', true);
        this.el.querySelector('a-plane').setAttribute('text', 'value: '+ this.data.text);
      } else {
        this.el.querySelector('a-plane').setAttribute('visible', false);
      }

    }
    if (this.el.querySelector('.saveable')) {
      this.el.querySelector('.saveable').setAttribute('material', 'color', this.data.color);
    }
  }
});
