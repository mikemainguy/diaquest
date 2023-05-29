AFRAME.registerComponent('avatar', {
    update: function () {
         const body = this.el.querySelector('.body');
         if (body) {
             this.body = body;
             console.log("body found");
         }
         const head = this.el.querySelector('.head');
         if (head) {
             this.head = head;
             console.log("head found");
         }
    },
    tick: function() {
        if (this.body) {
            this.el.parentEl.object3D.setRotationFromEuler(new THREE.Euler(0,0,0));

        }
    }
});