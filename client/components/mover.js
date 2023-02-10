import {initSound} from "./util";

AFRAME.registerSystem('mover', {
    init: function () {
        this.running = true;
        this.enabled = true;
        this.directions = [];
        this.offset = new THREE.Vector3(0,0,0);
        this.keyEvent = this.keyEvent.bind(this);
        document.addEventListener('keydown', this.keyEvent);
    },
    keyEvent: function(evt) {
        if (!this.camera) {
            this.camera = document.getElementById("camera");
            return;
        }
        if (!this.rig) {
            this.rig = document.querySelector(".rig");
            return;
        }

        const camWorld = new THREE.Quaternion();
        this.camera.object3D.getWorldQuaternion(camWorld);

        switch (evt.key) {
            case 'w':
                this.offset.set(0,0,-.1);
                break;
            case 's':
                this.offset.set(0,0,.1);
                break;
            case 'a':
                this.offset.set(-.1,0,0);
                break;
            case 'd':
                this.offset.set(.1,0,0);
                break;
            case '1':
                this.offset.set(0,.1,0);
                break;
            case 'q':
                this.offset.set(0,-.1,0);
                break;

            default:
                this.offset.set(0,0,0);
        }
        const dir = this.offset.clone().applyQuaternion(this.camera.object3D.quaternion);
        this.rig.object3D.position.add(dir);

    }
});
AFRAME.registerComponent('mover', {
    schema: {
        x: {type: 'string', default: '0 0 0'},
        y: {type: 'string', default: '0 0 0'}
    },
    init: function () {
        this.x = {};
        if (AFRAME.utils.coordinates.isCoordinates(this.data.x)) {
            const x = AFRAME.utils.coordinates.parse(this.data.x);
            this.x.direction = new THREE.Vector3(
                x.x,
                x.y,
                x.z
            );
            this.x.scaledDirection = new THREE.Vector3();
            this.system.directions.push(this.x.scaledDirection);
            this.x.rotation = 0;
        } else {
            this.x.direction = new THREE.Vector3(0, 0, 0);
            this.x.scaledDirection = new THREE.Vector3();
            this.x.rotation = THREE.MathUtils.degToRad(this.data.x);
        }
        this.y = {};
        if (AFRAME.utils.coordinates.isCoordinates(this.data.y)) {
            const y = AFRAME.utils.coordinates.parse(this.data.y);
            this.y.direction = new THREE.Vector3(
                y.x,
                y.y,
                y.z
            );
            this.y.scaledDirection = new THREE.Vector3();
            this.system.directions.push(this.y.scaledDirection);
            this.y.rotation = 0;
        } else {
            this.y.direction = new THREE.Vector3(0, 0, 0);
            this.y.scaledDirection = new THREE.Vector3(0, 0, 0);

            this.y.rotation = THREE.MathUtils.degToRad(this.data.y);
        }
        this.rotating = false;
        this.rotate = 0;
        this.handler = this.thumbstick.bind(this);
        this.rig = document.querySelector(".rig");
        this.el.addEventListener('thumbstickmoved', this.handler);
    },
    remove: function () {
        this.el.removeEventListener('thumbstickmoved', this.handler);
    },
    tick: function (time, timeDelta) {
        if (!this.camera) {
            this.camera = document.getElementById("camera");
            if (this.camera) {
                this.camera.setAttribute('camera', 'active', true);
                console.log('camera updated');
            }
        }
        if (!this.rig) {
            this.rig = document.querySelector('.rig');
        }
        if (this.rig &&
            this.rig.object3D &&
            this.camera &&
            this.camera.object3D) {
            if (this.system.directions.length > 0) {
                const velocity = new THREE.Vector3();
                for (const d of this.system.directions) {
                    velocity.add(d);
                }
                const v = velocity.length();
                const camWorld = new THREE.Quaternion();
                this.camera.object3D.getWorldQuaternion(camWorld);
                velocity.applyQuaternion(camWorld);
                this.rig.object3D.position.add(velocity.multiplyScalar(v / 40));

            }
            this.rotateY(time, timeDelta)
        }
    },
    thumbstick: function (evt) {
        initSound();
        if (this.data.camera) {
            this.data.camera.setAttribute('active', true);
        }
        this.x.scaledDirection.copy(this.x.direction.clone().multiplyScalar(evt.detail.x));
        this.y.scaledDirection.copy(this.y.direction.clone().multiplyScalar(evt.detail.y));

        if (this.x.rotation != 0) {
            if (Math.abs(evt.detail.x) > .5) {
                this.rotate = (this.x.rotation * Math.sign(evt.detail.x));
            } else {
                this.rotate = 0;
            }
        }

        if (this.y.rotation != 0) {
            if (Math.abs(evt.detail.y) > .5) {
                this.rotate = (this.y.rotation * Math.sign(evt.detail.y));
            } else {
                this.rotate = 0;
            }
        }


    },
    rotateY: function (t, dt) {
        const nextRotate = (this.rotate != 0);
        if (!this.rotating && nextRotate) {
            this.rig.object3D.rotation.y += this.rotate;
            this.rotating = true;
        } else {
            this.rotating = nextRotate;
        }
    }
});