AFRAME.registerComponent('connector', {
  schema: {
    startEl: {type: 'selector'},
    endEl: {type: 'selector'},
    speed: {type: 'number', default: 1.0},
    delay: {type: 'number', default: 1.0},
    twoWay: {type: 'boolean', default: false}
  },
  init: function() {
    this.pos = new THREE.Vector3();
    if (this.data.startEl && this.data.startEl.object3D &&
      this.data.endEl && this.data.endEl.object3D ) {
      this.obj1 = this.data.startEl.object3D;
      this.obj2 = this.data.endEl.object3D;

      const distance = this.obj1.position.distanceTo(this.obj2.position);

      this.packet = this.el.querySelector('.data-packet').object3D;
      this.connector = this.el.querySelector('.data-direction').object3D;
      this.packetPosition = 0;

      this.el.querySelector('a-plane').setAttribute('visible', false);
      this.el.querySelector('a-plane').setAttribute('position','z', distance/2);
      this.el.setAttribute('position', this.obj1.position);

    } else {
      //debug(JSON.stringify(this.data));
    }

  },
  update: function() {

  },
  tick: function(time, timeDelta) {
    if (this.obj1 && this.obj2) {
      this.el.object3D.position.set(this.obj1.position.x, this.obj1.position.y, this.obj1.position.z);
      this.el.object3D.lookAt(this.obj2.position);
      const distance = this.obj1.position.distanceTo(this.obj2.position);
      if (this.packetPosition < 50) {
        this.packet.position.z = this.packetPosition++ * (distance/50);

      } else {
        this.packetPosition = 0;
      }
      this.connector.position.z = distance/2;
      this.connector.scale.y = distance;

    } else {
      const id = this.el.getAttribute('id');
      console.log(id + ' missing data, removing');
      import('../firebase/firebase.js').then((module) => {
        module.removeEntity(id);
      });

    }

  }
});
AFRAME.registerComponent('raycaster-debug', {

  init: function () {
    this.el.addEventListener('raycaster-intersected', (event) => {
      debug(JSON.stringify(event.detail.getIntersection(event.target).point));
    });
  }
});
