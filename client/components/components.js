AFRAME.registerComponent('user', {
  schema: {
    //keyboard: {default: '#keyboard', type: 'selector'}
  },
  init: function () {
    fetch('/api/user/profile')
      .then((res)=> res.json())
      .then((data) => {
          this.el.setAttribute('text','value: ' + data.user.email);
      });
  },
  tick: function () {

  }
});

AFRAME.registerComponent('lookatme', {
  init: function() {
    const cam = document.querySelector('#camera');
    if (cam) {
      this.pos = new THREE.Vector3();
      this.camera = document.querySelector('#camera').object3D;
    } else {

    }
  },
  tick: function() {
    if (this.camera) {
      this.camera.getWorldPosition(this.pos);
      this.el.object3D.lookAt(this.pos);
    }
  }
});







