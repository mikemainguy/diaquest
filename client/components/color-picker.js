AFRAME.registerSystem('color-picker', {
  init: function() {
    this.color = "#66f";
  }
})
AFRAME.registerComponent('color-picker', {
  init: function() {
    const letters = "069F";
    let x = 0;

    for (red of letters) {
      for(green of letters) {
        for (blue of letters) {
          const color = "#" + red + green + blue;
          const ele = document.createElement('a-plane')
          ele.setAttribute('width', 0.05);
          ele.setAttribute('height', 0.05);
          ele.setAttribute('color', color);
          ele.setAttribute('newcolor', color);
          ele.setAttribute('class', 'colorswatch');
          ele.setAttribute('position', new THREE.Vector3((x%8)*0.05, Math.floor((x/8))*0.05, 0));
          this.el.appendChild(ele);

          x++;
        }
      }
    }

  }
});
