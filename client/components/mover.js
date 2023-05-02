import {initSound} from "./util";

AFRAME.registerSystem('mover', {
    init: function () {
        this.running = true;
        this.enabled = true;
        this.directions = [];
        this.rotating = false;
        this.rotate = 0;
        this.vlength = 0;
        this.camWorld = new THREE.Quaternion();
        this.offset = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3();
        this.updateVelocity = this.updateVelocity.bind(this);
        this.keyEvent = this.keyEvent.bind(this);
        document.addEventListener('keydown', this.keyEvent);
        this.rig = document.querySelector('.rig');
        this.camera = document.getElementById("camera");

        this.checkRigAndCamera();
    },
    keyEvent: function (evt) {
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
                this.offset.set(0, 0, -.1);
                break;
            case 's':
                this.offset.set(0, 0, .1);
                break;
            case 'a':
                this.offset.set(-.1, 0, 0);
                break;
            case 'd':
                this.offset.set(.1, 0, 0);
                break;
            case 'W':
                this.offset.set(0, .1, 0);
                break;
            case 'S':
                this.offset.set(0, -.1, 0);
                break;
            case 'A':
                //THese two I'd like to make rotate, but it's a bit wierd as camera is child of rig, will fix later
                break;
            case 'D':
                //THese two I'd like to make rotate, but it's a bit wierd as camera is child of rig, will fix later
                break;
            default:
                this.offset.set(0, 0, 0);
        }
        const dir = this.offset.clone().applyQuaternion(this.camera.object3D.quaternion);
        this.rig.object3D.position.add(dir);

    },
    checkRigAndCamera: function () {
        if (!this.camera) {
            this.camera = document.getElementById("camera");
            if (this.camera) {
                this.camera.setAttribute('camera', 'active', true);
            }
        }
        if (!this.rig) {
            this.rig = document.querySelector('.rig');
        }
        return (this.rig && this.rig.object3D && this.camera && this.camera.object3D);

    },
    updateVelocity: function () {
        if (this.checkRigAndCamera()) {
            if (this.directions.length > 0) {
                const velocity = new THREE.Vector3();
                for (const d of this.directions) {
                    if (d.length != 0) {
                        velocity.add(d);
                    }

                }
                this.velocity.set(velocity.x, velocity.y, velocity.z);
                this.vlength = this.velocity.length();
            }
        }

    },
    tick: function (time, timeDelta) {
        const t = timeDelta/250;
        if (this.vlength != 0) {
            this.camera.object3D.getWorldQuaternion(this.camWorld);
            this.velocity.applyQuaternion(this.camWorld);
            this.rig.object3D.position.add(this.velocity.multiplyScalar(this.vlength * t));
        }

        this.rotateY(time, timeDelta);


    },
    rotateY: function (t, dt) {

        if (dt && this.rig && this.rig.object3D && this.rotate && this.rig.object3D.rotation) {
            const rotation = (dt/20) * this.rotate;
            this.rig.object3D.rotation.y = rotation + this.rig.object3D.rotation.y;
        }

    }
});
AFRAME.registerComponent('mover', {
    schema: {
        x: {type: 'string', default: '0 0 0'},
        y: {type: 'string', default: '0 0 0'}
    },
    setCoordinates: function (vec) {
        const val = {
            direction: new THREE.Vector3(0, 0, 0),
            scaledDirection: new THREE.Vector3(),
            rotation: 0
        }
        if (AFRAME.utils.coordinates.isCoordinates(vec)) {
            const v = AFRAME.utils.coordinates.parse(vec);
            val.direction.set(v.x, v.y, v.z);
            this.system.directions.push(val.scaledDirection);
        } else {
            val.rotation = THREE.MathUtils.degToRad(this.data.x);
        }
        return val;
    },
    init: function () {
        this.x = this.setCoordinates(this.data.x);
        this.y = this.setCoordinates(this.data.y);
        this.rig = document.querySelector(".rig");
    },
    events: {
        thumbstickmoved: function (evt) {
            initSound();

            if (this.data.camera) {
                this.data.camera.setAttribute('active', true);
            }
            if (this.x.rotation != 0) {
                if (Math.abs(evt.detail.x) > .15) {
                    this.system.rotate = (this.x.rotation * evt.detail.x);
                } else {
                    this.system.rotate = 0;
                }
            } else {
                this.x.scaledDirection.copy(this.x.direction.clone().multiplyScalar(Math.round(evt.detail.x * 10) / 10));
            }

            if (this.y.rotation != 0) {
                if (Math.abs(evt.detail.y) > .15) {
                    this.system.rotate = (this.y.rotation * evt.detail.y);
                } else {
                    this.system.rotate = 0;
                }
            } else {
                this.y.scaledDirection.copy(this.y.direction.clone().multiplyScalar(Math.round(evt.detail.y * 100) / 100));
            }
            this.system.updateVelocity();
        }
    }
});