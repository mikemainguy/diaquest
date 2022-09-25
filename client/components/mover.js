import {debug} from "./debug";
import {getCurrentMode, initSound, getSystem} from "./util";

AFRAME.registerSystem('mover', {
    init: function () {
        this.running = true;
        this.enabled = true;
        this.velocity = new THREE.Vector3(0, 0, 0);
    }
});

AFRAME.registerComponent('mover', {
    multiple: true,
    schema: {
        axis: {type: 'string', default: 'x'},
        stickaxis: {type: 'string', default: 'y'},
        forwardback: {type: 'boolean', default: false},
        elevate: {type: 'boolean', default: false},
        strafe: {type: 'boolean', default: false},
        turn: {type: 'boolean', default: false},
        turnIncrement: {type: 'float', default: 0.3926991}
    },
    init: function () {
        this.rotating = false;
        this.rotate = 0;
        this.dir = document.querySelector('#dir');
        this.handler = this.thumbstick.bind(this);
        this.camera = document.querySelector("#camera");
        this.rig = document.querySelector(".rig");
        this.el.addEventListener('thumbstickmoved', this.handler);

        document.querySelector('#camera').setAttribute('camera', 'active', true);
        document.addEventListener('rigChanged', this.rigChanged.bind(this));
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
        this.el.removeEventListener(this.handler);
    },
    tick: function (time, timeDelta) {
        if (this.rig && this.rig.object3D && this.camera && this.camera.object3D) {
            if (this.system.velocity.length() > 0) {
                const velocity = this.system.velocity.clone();
                const camWorld = new THREE.Quaternion();
                this.camera.object3D.getWorldQuaternion(camWorld);
                velocity.applyQuaternion(camWorld);
                this.rig.object3D.position.add(velocity.divideScalar(80));
            }
            this.rotateY(time, timeDelta)
        }
    },
    thumbstick: function (evt) {
        initSound();
        if (getCurrentMode() == 'change-size') {
            return;
        }
        const thumbFactor = 10;

        const val = Math.round(evt.detail[this.data.stickaxis] * thumbFactor) / thumbFactor;
        const sign = Math.sign(val);

        if (Math.abs(val) > (1/thumbFactor)) {
            if (this.data.forwardback ||
                this.data.elevate ||
                this.data.strafe) {
                this.system.velocity[this.data.axis] = (val - (1/thumbFactor));
            }
            if (this.data.turn) {
                if (Math.abs(val) > .3) {
                    this.rotate = ((this.data.turnIncrement * sign) * -1);
                } else {
                    this.rotate = 0;
                }
            }
        } else {
            if (this.data.turn) {
                this.rotate = 0;
            } else {
                this.system.velocity[this.data.axis] = 0;
            }
        }

    },
    rotateY: function (t, dt) {
        const nextRotate = (this.rotate != 0);
        if (!this.rotating && nextRotate) {
            this.rig.object3D.rotation.y += this.rotate;
            this.rotating = true;
            return true;
        } else {
            this.rotating = nextRotate;
        }
    }
});

