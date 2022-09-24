import {debug} from './debug';

AFRAME.registerComponent('share-position', {
    schema: {

    },
    init: function () {
        const templateComponent = this.el.parentEl.components['template'];
        this.hasPosition = true;
        this.dirty = false;
        this.parent = this.el.parentEl.object3D;
        if (this.el.id =='camera') {
            this.parent = this.el.object3D;
        }
        this.updateShape = AFRAME.utils.throttleTick(this.updateShape, 200, this);
        if (templateComponent) {
          if (templateComponent.data.src == '#connector-template') {
              this.hasPosition = false;
          }
        }

    },
    resetPosition: function() {

    },
    updateShape: function(time, timeDelta) {
        if (this.dirty) {
            if (this.el.id != 'camera') {
                const data = {
                    id: this.el.parentEl.getAttribute('id'),
                    position: this.currentPosition,
                    rotation: {x: THREE.MathUtils.radToDeg(this.parent.rotation.x),
                        y: THREE.MathUtils.radToDeg(this.parent.rotation.y),
                        z: THREE.MathUtils.radToDeg(this.parent.rotation.z)
                    }
                }
                document.dispatchEvent(
                    new CustomEvent('shareUpdate', {detail: data}));

                this.dirty = false;
            } else {
                const e = new THREE.Euler();
                e.setFromQuaternion(this.currentRotation);
                const data = {
                    id: this.el.parentEl.getAttribute('id'),
                    position: this.currentPosition,
                    rotation: {x: THREE.MathUtils.radToDeg(e.x),
                        y: THREE.MathUtils.radToDeg(e.y),
                        z: THREE.MathUtils.radToDeg(e.z)
                    }
                }
                document.dispatchEvent(
                    new CustomEvent('shareUpdate', {detail: data}));

                this.dirty = false;
            }

        }

    },
    tick: function(time, timeDelta) {

        if (this.hasPosition) {

            if (!this.oldPosition) {
                this.oldPosition = new THREE.Vector3();
                this.oldRotation = new THREE.Quaternion();
                this.currentPosition = new THREE.Vector3();
                this.currentRotation = new THREE.Quaternion();
                this.parent.getWorldPosition(this.currentPosition);
                round100(this.currentPosition);
                this.parent.getWorldQuaternion(this.currentRotation);


                this.parent.getWorldPosition(this.oldPosition);
                round100(this.oldPosition);
                this.parent.getWorldQuaternion(this.oldRotation);



            } else {
                this.parent.getWorldPosition(this.currentPosition);
                round100(this.currentPosition);
                this.parent.getWorldQuaternion(this.currentRotation);


                if (!this.oldPosition.equals(this.currentPosition)||
                    (Math.abs(this.oldRotation.angleTo(this.currentRotation)) > .01)) {
                    this.parent.getWorldPosition(this.oldPosition);
                    round100(this.oldPosition);
                    this.parent.getWorldQuaternion(this.oldRotation);
                    this.dirty = true;

                }
            }
            this.updateShape(time, timeDelta);

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