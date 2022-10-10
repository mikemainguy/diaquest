AFRAME.registerSystem('sizer', {
    init: function () {

    }
});

AFRAME.registerComponent('sizer', {
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
        const el = evt.currentTarget.components['raycaster'].intersections[0].object.el;
        if (el.classList.contains('sizer')) {
            this.grabbed = el.closest('[template]');
            evt.currentTarget.object3D.attach(this.grabbed.object3D);
        } else {

        }

    },
    release: function(evt) {
        if (this.grabbed) {
            this.el.sceneEl.object3D.attach(this.grabbed.object3D);
            this.grabbed = null;
        }

    },
    tick: function() {

    }
});