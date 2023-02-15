AFRAME.registerSystem('grabber', {
  init: function () {

  }
});

AFRAME.registerComponent('grabber', {
  init: function () {
    this.grabbed = null;
  },
  events: {
    gripdown: function(evt) {
      if (evt.currentTarget.components['raycaster'].intersections.length>0) {
        this.grabbed = evt.currentTarget.components['raycaster'].intersections[0].object.el;
        this.grabbed.emit('grabbed', {hand: evt.currentTarget});
      }
    },
    gripup: function(evt) {
      if (this.grabbed) {
        this.grabbed.emit('released', {hand: evt.currentTarget});
        this.grabbed = null;
      }
    }
  }
});
