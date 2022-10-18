AFRAME.registerSystem('color-picker', {
  init: function() {
    this.color = "#66f";
  }
});
AFRAME.registerComponent('color-picker', {
  init: function() {
    const letters = "069F";
    let x = 0;

    for (const red of letters) {
      for(const green of letters) {
        for (const blue of letters) {
          const color = "#" + red + green + blue;
          const ele = document.createElement('a-plane')
          ele.setAttribute('width', 0.05);
          ele.setAttribute('height', 0.05);
          ele.setAttribute('color', color);
          ele.setAttribute('color-swatch', 'color: ' + color);
          ele.setAttribute('position', new THREE.Vector3((x%8)*0.05, Math.floor((x/8))*0.05, 0));
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
    document.querySelector('a-scene').systems['color-picker'].color = this.data.color;

    document.dispatchEvent( new CustomEvent('hideMenu', {detail: {id: '#menu'}}));
    document.dispatchEvent( new CustomEvent('hideMenu', {detail: {id: '#color-picker'}}));
  }
});
