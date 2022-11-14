import {debug} from './debug';

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
    this.started = false;
    if (this.data.startEl && this.data.startEl.object3D &&
      this.data.endEl && this.data.endEl.object3D ) {
      if (this.el.querySelector('.data-direction')) {
        this.connector = this.el.querySelector('.data-direction').object3D;
      }
      if (this.el.querySelector('.label')) {
        this.label = this.el.querySelector('.label').object3D;
      }
      if (this.el.querySelector('.data-packet')) {
        this.dataPacket = this.el.querySelector('.data-packet').object3D;
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
  tock: function() {
    if (!this.obj1 && this.data.startEl && this.data.startEl.object3D) {
      this.obj1 = this.data.startEl.object3D;
    }
    if (!this.obj2 && this.data.endEl && this.data.endEl.object3D) {
      this.obj2 = this.data.endEl.object3D;
    }

  },
  tick: function(time, timeDelta) {
    if (this.obj1 && this.obj2 && this.connector) {
      this.obj1.getWorldPosition(this.pos1);
      this.obj2.getWorldPosition(this.pos2);

      const distance = this.pos1.distanceTo(this.pos2);
      if (!this.pos1.equals(this.oldPos1) ||
          !this.pos2.equals(this.oldPos2) ||
          !this.started) {
        this.oldPos1.copy(this.pos1);
        this.oldPos2.copy(this.pos2);
        this.started = true;
      }

      const intersections = this.getIntersections(distance);
      if (intersections &&
          intersections.length > 1) {

        const d2 = intersections[0].distanceTo(intersections[1]);
        const pos = intersections[0].lerp(intersections[1], .5);

        this.el.object3D.position.set(pos.x, pos.y, pos.z);
        this.el.object3D.lookAt(intersections[1]);
        this.connector.scale.y = d2 - .08;
        //this.connector.position.z = d2/2 + ((distance -d2) /2);
        if (!this.dataPacket) {
          this.dataPacket = this.el.querySelector('.data-packet').object3D;
        } else {
          this.dataPacket
              .position.setZ((d2/-2) + .02);
        }

        if (this.label) {
          this.label.position.set(0, .1, 0);
          //this.label.position.z = d2/2 + ((distance -d2) /2);
        } else {
          this.label = this.el.querySelector('.label').object3D;
        }

      } else {
        debug(JSON.stringify(intersections));
      }
    } else {
      if (this.el.querySelector('.data-direction')) {
        this.connector = this.el.querySelector('.data-direction').object3D;
      }

    }

  },
  getIntersections: function(distance) {
    if (!this.obj1 || !this.obj1.el || !this.obj2 || !this.obj2.el) {
      return;
    }
    if (!this.obj1.el.querySelector('.saveable') ||
        !this.obj2.el.querySelector('.saveable')) {
      return;
    }

    const save1 = this.obj1.el.querySelector('.saveable').object3D;
    const save2 = this.obj2.el.querySelector('.saveable').object3D;
    const direction = new THREE.Vector3();

    direction.subVectors(this.pos2, this.pos1);
    direction.normalize();

    const raycast = new THREE.Raycaster(this.pos1, direction, 0, distance);

    const intersects = raycast.intersectObject(save2);

    const intersections = [];
    if (intersects.length > 0) {
      intersections.push(intersects[0].point);
    } else {
      debug("object 2 not intersected");
    }
    direction.multiplyScalar(-1);
    const raycast2 = new THREE.Raycaster(this.pos2, direction, 0, distance);
    const intersects2 = raycast2.intersectObject(save1);
    if (intersects2.length > 0) {
      intersections.push(intersects2[0].point);
    } else {
        debug("object 1 not intersected");
    }
    return intersections;
  }

});
