import {changeRaycaster, createUUID, getCurrentMode, getSystem, round} from "./util";

AFRAME.registerSystem('stuff', {
   init: function() {
       this.first=null;
   }
});
AFRAME.registerComponent('stuff', {
    schema: {
        text: {type: 'string'},
        color: {type: 'string'},
        scale: {type: 'string', default: '.2 .2 .2'},
        action: {type: 'string'}
    },
    init: function () {
        this.el.setAttribute('sound', 'src: #keyin; volume: 0.2; on: mouseenter;');
        this.saveable = this.el.querySelector('.saveable');
    },
    update: function () {
        const textDisplay = this.el.querySelector('[text-geometry]');
        this.saveable = this.el.querySelector('.saveable');

        this.el.emit('registerupdate', {}, true);
        if (this.saveable) {
            this.scale = AFRAME.utils.coordinates.parse(this.data.scale);
            this.saveable.object3D.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.saveable.object3D.children[0].geometry.computeBoundingBox();
            this.saveable.setAttribute('visible', true);
            this.saveable.setAttribute('sound', 'src: #keydown; on: click;');
        }
        if (textDisplay) {
            if (this.data.text) {
                this.textDisplay = textDisplay.object3D;
                textDisplay.setAttribute('visible', true);
                textDisplay.setAttribute('text-geometry', 'value', this.data.text);
            } else {
                this.textDisplay = null;
                textDisplay.setAttribute('visible', false);
            }

        }

        const saveable = this.el.querySelector('.saveable');
        if (saveable) {
            saveable.setAttribute('material', 'color', this.data.color);
        }
    },
    tick: function () {
        if (this.textDisplay && this.saveable) {
            const radius = this.saveable.object3D.children[0].geometry.boundingBox.max.y;
            this.textDisplay.position.set(0, (radius * this.saveable.object3D.scale.y) + 0.05, 0);
        }
    },
    events: {
        click: function (evt) {
            evt.detail.cursorEl.components['tracked-controls-webxr'].controller.gamepad.hapticActuators[0].pulse(.5, 100);


            const obj = evt.target.closest('[template]');
            switch (getCurrentMode()) {
                case 'removing':
                    document.dispatchEvent(new CustomEvent('shareUpdate', {detail: {id: obj.id, remove: true}}));
                    break;
                case 'edit-color':
                    const newColor = getSystem('color-picker').color
                    this.data.color = newColor;
                    evt.target.setAttribute('material', 'color', this.data.color);
                    document.dispatchEvent(new CustomEvent('shareUpdate', {detail: {id: obj.id, color: newColor}}));
                    break;
                case 'resizing':
                    this.el.emit('buttonstate', {mode: ['change-size'], first: obj.id}, true);
                    document.dispatchEvent(new CustomEvent('resizing', {detail: {id: obj.id}}));
                    break;
                case 'editing':
                    this.el.emit('buttonstate', {mode: ['typing'], first: obj.id}, true);
                    const keyboard = document.getElementById('keyboard');
                    changeRaycaster('.keyboardRaycastable');
                    keyboard.emit('show', {value: this.data.text, elId: obj.id});
                    break;
                case 'copying':
                    this.el.emit('buttonstate', {mode: ['copying'], first: obj.id}, true);
                    break;
                case 'select-first':
                    this.el.emit('buttonstate', {mode: ['select-second'], first: obj.id}, true);
                    this.system.first = obj.id;
                    break;
                case 'select-second':
                    this.el.emit('buttonstate', {mode: ['select-first'], first: null}, true);
                    const data = {
                        id: createUUID(),
                        first: this.system.first,
                        second: obj.id,
                        text: '',
                        color: getSystem('color-picker').color,
                        template: '#connector-template'
                    }
                    document.dispatchEvent(
                        new CustomEvent('shareUpdate',
                            {detail: data}));


            }
        },
        mouseenter: function (evt) {
            evt.detail.cursorEl.components['tracked-controls-webxr'].controller.gamepad.hapticActuators[0].pulse(.05, 25);
            const obj = evt.target;
            obj.setAttribute('animation', "property: material.color; from: #cc2; to: #ff2; dir: alternate; dur: 500; loop: true")
        },
        mouseleave: function (evt) {
            const obj = evt.target;
            obj.setAttribute('material', 'color', this.data.color);
            obj.removeAttribute('animation');
        },
        grabbed: function (evt) {
            this.grabbed = this.el.closest('[template]');
            evt.detail.hand.object3D.attach(this.grabbed.object3D);
        },
        released: function () {
            this.el.sceneEl.object3D.attach(this.grabbed.object3D);

            const newPos = round(this.grabbed.object3D.position, .1);
            this.grabbed.object3D.position.set(newPos.x, newPos.y, newPos.z);
            const ang = AFRAME.utils.coordinates.parse(this.grabbed.getAttribute('rotation'));
            this.grabbed.setAttribute('rotation', AFRAME.utils.coordinates.stringify(round(ang, 45)));
            this.grabbed = null;
        }
    }
});


function getKeyboardPosition(distance) {
    let pos = new THREE.Vector3();
    const c = document.getElementById('camera').object3D;
    c.getWorldPosition(pos);
    let dir = new THREE.Vector3();
    c.getWorldDirection(dir);
    dir.multiplyScalar(distance ? distance : -1);
    dir.y -= .3;

    pos.add(dir);
    return pos;
}
