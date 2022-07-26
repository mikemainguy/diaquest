AFRAME.registerComponent('user', {
  schema: {
    //keyboard: {default: '#keyboard', type: 'selector'}
  },
  init: function () {
    fetch('/api/user/profile')
      .then((res)=> res.json())
      .then((data) => {
          this.el.setAttribute('text','value: ' + data.email);
      });
  },
  tick: function () {

  }
});
AFRAME.registerComponent('lookatme', {
  init: function() {
    this.pos = new THREE.Vector3();
    this.camera = document.querySelector('#camera').object3D;

  },
  tick: function() {
    this.camera.getWorldPosition(this.pos);
    this.el.object3D.lookAt(this.pos);
  }
});
AFRAME.registerComponent('raycaster-debug', {

  init: function () {
    this.el.addEventListener('raycaster-intersected', (event) => {
      debug(JSON.stringify(event.detail.getIntersection(event.target).point));
    });
  }
});




