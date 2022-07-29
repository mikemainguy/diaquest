AFRAME.registerComponent('user', {
  schema: {
    //keyboard: {default: '#keyboard', type: 'selector'}
  },
  init: function () {
    fetch('/api/user/profile')
      .then((res)=> res.json())
      .then((data) => {
          import('../firebase/firebase.js').then((module) => {
            module.writeUser(data.user);
          });
          this.el.setAttribute('text','value: ' + data.user.email);
      });
  },
  tick: function () {

  }
});

AFRAME.registerComponent('rotate-listen', {
  schema: {
    //keyboard: {default: '#keyboard', type: 'selector'}
  },
  init: function () {

  },
  tick: function () {
    //debug(vectorString(getHUDPosition()));
    //document.querySelector('#reticle').object3D.position.set(getHUDPosition());
    /*debug(radians_to_degrees(this.el.object3D.rotation.x) + ' '+
      radians_to_degrees(this.el.object3D.rotation.y) + ' '+
      radians_to_degrees(this.el.object3D.rotation.z)
    );*/
  }
});
function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}
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





