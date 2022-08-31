AFRAME.registerSystem('grabber', {
  init: function () {

  }
});

AFRAME.registerComponent('grabber', {
  init: function () {
    this.grabbed = null;
    this.distance = null;
    this.point = null;
    this.grabHandler = this.grab.bind(this);
    this.releaseHandler = this.release.bind(this);
    this.el.addEventListener('gripdown', this.grabHandler);
    this.el.addEventListener('gripup', this.releaseHandler);

  },
  remove: function() {
    this.el.removeEventListener('gripdown', this.grabHandler);
    this.el.removeEventListener('gripup', this.releaseHandler);

  },
  grab: function(evt) {
    if (evt.currentTarget.components['raycaster'].intersections[0].object.el.classList.contains('intersected')) {
      this.grabbed = evt.currentTarget.components['raycaster'].intersections[0].object.el.closest('[template]');
      this.distance = evt.currentTarget.components['raycaster'].intersections[0].distance;
      this.point = evt.currentTarget.components['raycaster'].intersections[0].distance;
      evt.currentTarget.object3D.attach(this.grabbed.object3D);
    } else {
      console.log("nothing gripped");
    }

  },
  release: function(evt) {
    if (this.grabbed) {
      this.el.sceneEl.object3D.attach(this.grabbed.object3D);
      const data = {id: this.grabbed.id, position: this.grabbed.object3D.position};
      import('../firebase/firebase.js').then((module) => {
        module.updateEntity(data);
      });
      this.grabbed = null;
      this.distance = null;
    }
    console.log("released");
  },
  tick: function() {

  }
});
