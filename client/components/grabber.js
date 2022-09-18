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
    if (evt.currentTarget.components['raycaster'].intersections[0].object.el.classList.contains('saveable')) {
      this.grabbed = evt.currentTarget.components['raycaster'].intersections[0].object.el.closest('[template]');
      evt.currentTarget.object3D.attach(this.grabbed.object3D);
    } else {

    }

  },
  release: function(evt) {
    if (this.grabbed) {
      this.el.sceneEl.object3D.attach(this.grabbed.object3D);
      const data = {id: this.grabbed.id, position: this.grabbed.object3D.position};
      document.dispatchEvent(
          new CustomEvent('shareUpdate', {detail: data}));
      this.grabbed = null;
      this.distance = null;

    }

  },
  tick: function() {

  }
});
