AFRAME.registerSystem('color-picker', {
  init: function() {
    this.color = "#66f";
  }
});
AFRAME.registerComponent('color-picker', {
  init: function() {
    const letters = "0369cF";
    let x = 0;

    for (const red of letters) {
      for(const green of letters) {
        for (const blue of letters) {
          const color = "#" + red + green + blue;
          const ele = document.createElement('a-plane')
          ele.setAttribute('width', 0.05);
          ele.setAttribute('height', 0.05);
          ele.setAttribute('color', color);
          ele.setAttribute('text', `value: ${color}; wrapCount: 4`);
          ele.setAttribute('color-swatch', 'color: ' + color);
          ele.setAttribute('position', new THREE.Vector3((x%12)*0.05, Math.floor((x/12))*0.05, 0));
          this.el.appendChild(ele);

          x++;
        }
      }
    }

  }
});
AFRAME.registerComponent('color-swatch', {
  schema: {
    color: {type: 'string'}
  },
  init: function () {
    this.el.addEventListener("click", this.clickHandler.bind(this));
  },
  clickHandler: function(evt) {
    this.el.emit('hideMenu', {id: '#bmenu'}, true);
    this.el.emit('hideMenu', {id: '#color-picker'}, true);
    this.el.emit('buttonstate', {mode: ['edit-color'], color: this.data.color}, true);
  }
});
