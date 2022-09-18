import {debug} from "./debug";

AFRAME.registerSystem('mover', {
    init: function () {
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
        moveSpeed: {type: 'float', default: 1},
        turnIncrement: {type: 'float', default: 0.3926991}
    },
    init: function () {
        this.sound = false;
        this.running = false;
        this.rotating = false;
        this.rotate = 0;
        this.dir = document.querySelector('#dir');
        this.handler = this.thumbstick.bind(this);
        this.camera = document.querySelector("#camera");
        this.rigDir = new THREE.Vector3();
        this.camDir = new THREE.Vector3();

        this.rig = document.querySelector(".rig");
        this.mainRig = document.querySelector(".rig");
        this.el.addEventListener('thumbstickmoved', this.handler);

        document.querySelector('#camera').setAttribute('camera', 'active', true);
        document.addEventListener('rigChanged', this.rigChanged.bind(this));
    },
    rigChanged: function (evt) {
        const buttons = document.querySelector('a-scene').systems['buttons'];
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
        let changed = false;
        if (this.rig && this.rig.object3D  && this.camera && this.camera.object3D) {
            if (this.system.velocity.length() > 0) {
                const velocity = this.system.velocity.clone();
                const camWorld = new THREE.Quaternion();
                this.camera.object3D.getWorldQuaternion(camWorld);
                velocity.applyQuaternion(camWorld);
                this.rig.object3D.position.add(velocity.divideScalar(30));
                changed = true;
            }
            changed = changed || this.rotateY(time, timeDelta)
            if (changed) {
                updatePosition(this.rig);
            }

        }

    },
    thumbstick: function (evt) {
        if (!this.system.enabled) {
            return;
        }
        const a = document.querySelector('#ambient');

        if (false){
            const ambient =  a.components.sound;
            if (ambient.loaded && ambient.listener.context.state != 'running') {
                ambient.playSound();
            }
        }

        const val = Math.round(evt.detail[this.data.stickaxis] * 8) / 8;
        const sign = Math.sign(val);


        if (Math.abs(val) > 0.125) {
            if (this.data.forwardback ||
                this.data.elevate ||
                this.data.strafe) {

                this.system.velocity[this.data.axis] = this.data.moveSpeed * (val - .125);
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
        if (!this.rotating) {
            if (this.rotate != 0) {
                this.rig.object3D.rotation.y += this.rotate;
                this.rotating = true;
                return true;

            } else {
                this.rotating = false;
            }
            //let newRotation = this.rig.object3D.rotation.y + this.rotate;

        } else {
            if (this.rotate == 0) {
                this.rotating = false;
            }
        }
    }
});

function updatePosition(el) {
    const data = {
        id: el.getAttribute('id'),
        position: el.object3D.position,
        rotation: {x: THREE.MathUtils.radToDeg(el.object3D.rotation.x),
            y: THREE.MathUtils.radToDeg(el.object3D.rotation.y),
            z: THREE.MathUtils.radToDeg(el.object3D.rotation.z)
        }
    }
    document.dispatchEvent(
        new CustomEvent('shareUpdate', {detail: data}));
}
