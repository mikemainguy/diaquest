AFRAME.registerComponent('connector', {
  schema: {
    startEl: {type: 'selector'},
    endEl: {type: 'selector'},
    speed: {type: 'number', default: 1.0},
    delay: {type: 'number', default: 1.0},
    twoWay: {type: 'boolean', default: false}

  },
  events: {

  }
  ,
  update: function() {
    this.pos1 = new THREE.Vector3();
    this.pos2 = new THREE.Vector3();
    this.oldPos1 = new THREE.Vector3();
    this.oldPos2 = new THREE.Vector3();
    this.el.emit('registerupdate', {}, true);
    if (this.data.startEl && this.data.startEl.object3D &&
      this.data.endEl && this.data.endEl.object3D ) {
      //this.data.startEl.components['connections'].push(this.el);
      //this.data.endEl.components['connections'].push(this.el);

      this.obj1 = this.data.startEl.object3D;
      this.obj2 = this.data.endEl.object3D;
      this.started = false;
      this.el.setAttribute('position', this.obj1.position);
      this.obj1.getWorldPosition(this.oldPos1);
      this.obj2.getWorldPosition(this.oldPos2);
      if (this.el.querySelector('.data-direction')) {
        this.connector = this.el.querySelector('.data-direction').object3D;
      }
    } else {

    }

  },
  remove: function() {
    if (this.data.startEl) {
      //this.data.startEl.components['connections'].push(this.el);
    }
    if (this.data.startEl) {
      //this.data.endEl.components['connections'].push(this.el);
    }
  },
  tick: function(time, timeDelta) {
    if (this.obj1 && this.obj2 && this.connector) {
      this.obj1.getWorldPosition(this.pos1);
      this.obj2.getWorldPosition(this.pos2);
      if (!this.pos1.equals(this.oldPos1) ||
          !this.pos2.equals(this.oldPos2) || !this.started) {
        this.el.object3D.position.set(this.pos1.x, this.pos1.y, this.pos1.z);
        this.el.object3D.lookAt(this.pos2);
        this.oldPos1.copy(this.pos1);
        this.oldPos2.copy(this.pos2);
        this.started = true;
      }
      const distance = this.pos1.distanceTo(this.pos2);
      this.connector.position.z = distance/2;
      this.connector.scale.y = distance;

    } else {
      if (this.el.querySelector('.data-direction')) {
        this.connector = this.el.querySelector('.data-direction').object3D;
      }

    }

  }

});
