import {debug} from "./debug";
import {getCurrentMode, initSound, getSystem} from "./util";

AFRAME.registerSystem('mover', {
    init: function () {
        this.running = true;
        this.enabled = true;
        this.directions = [];
        this.velocity = new THREE.Vector3(0, 0, 0);


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
            this.x.direction = new THREE.Vector3(0,0,0);
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
            this.y.direction = new THREE.Vector3(0,0,0);
            this.y.scaledDirection = new THREE.Vector3(0,0,0);

            this.y.rotation = THREE.MathUtils.degToRad(this.data.y);
        }



        this.rotating = false;
        this.rotate = 0;
        this.handler = this.thumbstick.bind(this);
        this.camera = document.querySelector("#camera");
        this.rig = document.querySelector(".rig");
        this.el.addEventListener('thumbstickmoved', this.handler);
        document.querySelector('#camera').setAttribute('camera', 'active', true);
        this.rigChanged = this.rigChanged.bind(this)
        document.addEventListener('rigChanged', this.rigChanged);
    },
    rigChanged: function (evt) {
        const buttons = getSystem('buttons');
        debug(buttons.mode);
        if (buttons && buttons.first && buttons.mode[0] == 'moving') {
            this.rig = document.querySelector('#' + buttons.first);
        } else {
            this.rig = document.querySelector(".rig");
        }
    },
    remove: function () {
        this.el.removeEventListener('thumbstickmoved', this.handler);
        document.removeEventListener('rigChanged', this.rigChanged);
    },
    tick: function (time, timeDelta) {
        if (this.rig && this.rig.object3D && this.camera && this.camera.object3D) {
            if (this.system.directions.length > 0) {
                const velocity = new THREE.Vector3();
                for (const d of this.system.directions) {
                    velocity.add(d);
                }
                const v = velocity.length();

                const camWorld = new THREE.Quaternion();
                this.camera.object3D.getWorldQuaternion(camWorld);
                velocity.applyQuaternion(camWorld);
                this.rig.object3D.position.add(velocity.multiplyScalar(v/40));

            }
            this.rotateY(time, timeDelta)
        }
    },
    thumbstick: function (evt) {
        initSound();

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

