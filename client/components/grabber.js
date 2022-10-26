AFRAME.registerSystem('grabber', {
  init: function () {

  }
});

AFRAME.registerComponent('grabber', {
  init: function () {
    this.grabbed = null;
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
    if (evt.currentTarget.components['raycaster'].intersections.length>0) {
      this.grabbed = evt.currentTarget.components['raycaster'].intersections[0].object.el;
      this.grabbed.emit('grabbed', {hand: evt.currentTarget});
    }

  },
  release: function(evt) {
    if (this.grabbed) {
      this.grabbed.emit('released');
      this.grabbed = null;
    }
  },

  tick: function() {

  }
});
