AFRAME.registerComponent('gridlayout', {
  schema: {
    //keyboard: {default: '#keyboard', type: 'selector'}
  },
  init: function () {
    const factor = 3;
    let x = 0;
    const z = 0;
    this.el.setAttribute('scale', new THREE.Vector3(.5, .5, .5));
    for (el of this.el.children) {
      el.setAttribute('position',new THREE.Vector3(-1+(x%factor),(Math.floor(x/factor)),z));
      x++;
    }
  },
  tick: function () {

  }
});
