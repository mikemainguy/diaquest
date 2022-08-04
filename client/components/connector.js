AFRAME.registerComponent('connector', {
  dependencies: [ 'template'],
  schema: {
    startEl: {type: 'selector'},
    endEl: {type: 'selector'}
  },
  init: function() {
    this.pos = new THREE.Vector3();
    this.obj1 = this.data.startEl.object3D;
    this.obj2 = this.data.endEl.object3D;
  },
  tick: function() {
    const obj = this.el.querySelector('a-cylinder').object3D;
    const line = new THREE.Line3(this.obj1.position, this.obj2.position);
    line.getCenter(obj.parent.position);
    obj.lookAt(this.obj2.position);
    obj.rotateX(THREE.Math.degToRad(90));
    obj.scale.y =line.distance();
  }
});
AFRAME.registerComponent('raycaster-debug', {

  init: function () {
    this.el.addEventListener('raycaster-intersected', (event) => {
      debug(JSON.stringify(event.detail.getIntersection(event.target).point));
    });
  }
});
