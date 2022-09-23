AFRAME.registerComponent('share-position', {
    schema: {

    },
    init: function () {
        const templateComponent = this.el.parentEl.components['template'];
        this.hasPosition = true;

        if (templateComponent) {
          if (templateComponent.data.src == '#connector-template') {
              this.hasPosition = false;
          }
        }

    },
    resetPosition: function() {

    },
    tick: function(time, timeDelta) {
        let parent = this.el.parentEl.object3D;
        if (this.el.id =='camera') {
           parent = this.el.object3D;
        }
        if (this.hasPosition) {

            if (!this.oldPosition) {
                this.oldPosition = new THREE.Vector3();
                this.oldRotation = new THREE.Quaternion();
                this.currentPosition = new THREE.Vector3();
                this.currentRotation = new THREE.Quaternion();
                parent.getWorldPosition(this.currentPosition);
                round100(this.currentPosition);
                parent.getWorldQuaternion(this.currentRotation);


                parent.getWorldPosition(this.oldPosition);
                round100(this.oldPosition);
                parent.getWorldQuaternion(this.oldRotation);



            } else {
                parent.getWorldPosition(this.currentPosition);
                round100(this.currentPosition);
                parent.getWorldQuaternion(this.currentRotation);


                if (!this.oldPosition.equals(this.currentPosition)||
                    (Math.abs(this.oldRotation.angleTo(this.currentRotation)) > .01)) {
                    parent.getWorldPosition(this.oldPosition);
                    round100(this.oldPosition);
                    parent.getWorldQuaternion(this.oldRotation);

                    const data = {
                        id: this.el.parentEl.getAttribute('id'),
                        position: this.currentPosition,
                        rotation: {x: THREE.MathUtils.radToDeg(parent.rotation.x),
                            y: THREE.MathUtils.radToDeg(parent.rotation.y),
                            z: THREE.MathUtils.radToDeg(parent.rotation.z)
                        }
                    }
                    document.dispatchEvent(
                        new CustomEvent('shareUpdate', {detail: data}));
                    console.log('moved');
                }
            }

        }
    },
    update: function () {

    }
});

function round100(position) {
    position.multiplyScalar(100);
    position.round();
    position.divideScalar(100);
}