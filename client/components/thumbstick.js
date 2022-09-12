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
        this.handler = this.thumbstick.bind(this);
        this.camera = document.querySelector("#camera");
        this.rigDir = new THREE.Vector3();
        this.camDir = new THREE.Vector3();

        this.rig = document.querySelector(".rig");
        this.el.addEventListener('thumbstickmoved', this.handler);

        document.querySelector('#camera').setAttribute('camera', 'active', true);
        document.addEventListener('rigChanged', this.rigChanged.bind(this));
    },
    rigChanged: function (evt) {
        const buttons = document.querySelector('a-scene').systems['buttons'];
        debug(buttons.mode);
        if (buttons && buttons.first && buttons.mode[0] == 'moving') {
            this.rig = document.querySelector('#' + buttons.first);
            debug('first');
        } else {
            this.rig = document.querySelector(".rig");
            debug('second');
        }
    },
    remove: function () {
        this.el.removeEventListener(this.handler);
    },
    tick: function (time, timeDelta) {
        if (this.rig && this.rig.object3D  && this.camera && this.camera.object3D) {

            //this.rig.object3D.rotation.y = this.camera.object3D.getWorldRotation().y;


            let direction = new THREE.Vector3();
            //this.rig.object3D.getWorldDirection(direction);
            //direction.multiply(this.velocity);
            if (this.system.velocity.length() > 0) {
                const velocity = this.system.velocity.clone();
                this.rig.object3D.getWorldDirection(this.rigDir);
                this.camera.object3D.getWorldDirection(this.camDir);
                this.camDir.y = 0;
                this.rigDir.y = 0;
                const angle = this.rigDir.angleTo(this.camDir);
                //velocity.normalize();
                velocity.applyAxisAngle(new THREE.Vector3(0,1,0), angle);
                this.rig.object3D.translateOnAxis(velocity, this.system.velocity.length()/15);
            }
            this.rotateY(time, timeDelta);

        }

    },
    thumbstick: function (evt) {
        if (!this.system.enabled) {
            return;
        }

        const ambient = document.querySelector('#ambient').components.sound;
        if (ambient.loaded && ambient.listener.context.state != 'running') {
            ambient.playSound();
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
})
;

function degrees_to_radians(degrees) {
    return degrees * (Math.PI / 180);
}

function move(amount, slide) {

    updatePosition(this.rig, pos);
}

function elevate(amount) {

    updatePosition(this.rig, position);
}

function updatePosition(rig, position) {
    import('../firebase/firebase.js').then((module) => {
        const data = {
            id: rig.getAttribute('id'),
            position: position,
            rotation: rig.getAttribute('rotation')
        }
        module.updateEntity(data);
    });

}
