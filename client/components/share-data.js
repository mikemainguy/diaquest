import {debug} from './debug';

AFRAME.registerComponent('share-position', {
    schema: {
        active: {type: 'boolean', default: true}
    },
    init: function () {
        this.e = new THREE.Euler();

        const templateComponent = this.el.parentEl.components['template'];
        this.hasPosition = true;
        this.dirty = false;
        this.parent = this.el.parentEl.object3D;
        if (this.el.id == 'camera') {
            this.parent = this.el.object3D;
        }
        this.updateShape = AFRAME.utils.throttleTick(this.updateShape, 200, this);
        if (templateComponent) {
            if (templateComponent.data.src == '#connector-template') {
                this.hasPosition = false;
            }
        }

    },
    resetPosition: function () {

    },
    updateShape: function (time, timeDelta) {
        if (this.dirty) {
            //this.e = this.parent.rotation.clone();
            const q = new THREE.Quaternion();
            this.el.object3D.getWorldQuaternion(q);
            this.e.setFromQuaternion(q);


            const data = {
                id: this.el.parentEl.getAttribute('id'),
                position: this.currentPosition,
                rotation: {
                    x: THREE.MathUtils.radToDeg(this.e.x),
                    y: THREE.MathUtils.radToDeg(this.e.y),
                    z: THREE.MathUtils.radToDeg(this.e.z)
                }
            }

            data.last_seen = new Date().toUTCString();
            document.dispatchEvent(
                new CustomEvent('shareUpdate', {detail: data}));
            this.dirty = false;
        }
    },
    tick: function (time, timeDelta) {

        if (this.hasPosition && this.data.active) {

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


                if (!this.oldPosition.equals(this.currentPosition) ||
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