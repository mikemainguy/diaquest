AFRAME.registerComponent('connector', {
  schema: {
    startEl: {type: 'selector'},
    color: {type: 'string'},
    endEl: {type: 'selector'},
    speed: {type: 'number', default: 1.0},
    delay: {type: 'number', default: 1.0},
    twoWay: {type: 'boolean', default: false},
    text: {type: 'string'}
  },
  update: function() {
    this.pos1 = new THREE.Vector3();
    this.pos2 = new THREE.Vector3();
    this.oldPos1 = new THREE.Vector3();
    this.oldPos2 = new THREE.Vector3();

    if (this.data.startEl && this.data.startEl.object3D &&
      this.data.endEl && this.data.endEl.object3D ) {
      this.obj1 = this.data.startEl.object3D;
      this.obj2 = this.data.endEl.object3D;
      this.started = false;
      const distance = this.obj1.position.distanceTo(this.obj2.position);

      this.packet = this.el.querySelector('.data-packet').object3D;
      this.connector = this.el.querySelector('.data-direction').object3D;

      this.label = this.el.querySelector('a-plane').object3D;
      this.packetPosition = 0.1;
      this.el.querySelector('.saveable').setAttribute('material', 'color', this.data.color);
      if (this.data.text) {
        this.el.querySelector('a-plane').setAttribute('visible', true);
        this.el.querySelector('a-plane').setAttribute('text', 'value', this.data.text);

      } else {
        this.el.querySelector('a-plane').setAttribute('visible', false);
      }
      this.el.setAttribute('position', this.obj1.position);
      this.offset = this.data.speed /1000;
      this.obj1.getWorldPosition(this.oldPos1);
      this.obj2.getWorldPosition(this.oldPos2);

    } else {
      //debug(JSON.stringify(this.data));
    }

  },
  tick: function(time, timeDelta) {
    if (this.obj1 && this.obj2) {
      this.obj1.getWorldPosition(this.pos1);
      this.obj2.getWorldPosition(this.pos2);
      if (!this.pos1.equals(this.oldPos1) || !this.pos2.equals(this.oldPos2) || !this.started) {
        this.el.object3D.position.set(this.pos1.x, this.pos1.y, this.pos1.z);
        this.el.object3D.lookAt(this.pos2);
        this.oldPos1.copy(this.pos1);
        this.oldPos2.copy(this.pos2);
      }

      const distance = this.pos1.distanceTo(this.pos2);


      this.packetPosition = this.packetPosition + this.offset / (timeDelta / 1000) ;

      if (this.packetPosition > distance) {
        this.packetPosition = 0;
      }
      this.packet.position.z = this.packetPosition
      this.connector.position.z = distance/2;
      this.label.position.z = distance/2;
      this.connector.scale.y = distance;

    } else {
      //const id = this.el.getAttribute('id');
      console.log(id + ' missing data, removing');
      //import('../firebase/firebase.js').then((module) => {
      //  module.removeEntity(id);
      //});

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
