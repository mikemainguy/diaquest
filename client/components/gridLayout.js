AFRAME.registerComponent('gridlayout', {
  schema: {
    //keyboard: {default: '#keyboard', type: 'selector'}
  },
  update: function () {
    const factor = 5;
    let x = 0;
    const z = 0;
    this.childcount = this.el.childElementCount;
    this.el.setAttribute('scale', new THREE.Vector3(.5, .5, .5));
    for (el of this.el.children) {
      el.setAttribute('position',new THREE.Vector3(-1+(x%factor),(Math.floor(x/factor)),z));
      x++;
    }
  },
  tock: function () {
    if (this.childcount != this.el.childElementCount) {
      this.update();
    }
  }
});
