import {changeRaycaster, createUUID, getCurrentMode, getSystem, round} from "../util";

AFRAME.registerSystem('stuff', {
    init: function () {
        this.first = null;
    }
});
AFRAME.registerComponent('stuff', {
    schema: {
        text: {type: 'string'},
        color: {type: 'string'},
        scale: {type: 'string', default: '.2 .2 .2'},
        action: {type: 'string'},
        image: {type: 'string'},
        sides: {type: 'int', default: 36},
        parent: {type: 'string', default: null}
    },
    init: function () {
        this.el.setAttribute('sound', 'src: url(/assets/sounds/KeyInLow.mp3); volume: 0.2; on: mouseenter;');
        this.aligning = false;
        this.el.addChild = this.addChild.bind(this);
        this.groupline = null;
    },
    addChild: function(el) {
        this.el.object3D.appendChild(el.object3D);
        el.setAttribute('stuff', 'parent', this.el.getAttribute('id'));
    },
    update: function () {
        const v = AFRAME.utils.coordinates.parse(this.data.scale);
        this.scale = new THREE.Vector3(v.x, v.y, v.z);
        this.color = this.data.color;
        this.text = this.data.text;
        this.sides = this.data.sides;
        this.image = this.data.image;
        this.saveable = this.el.querySelector('.saveable');
        this.packet = this.el.querySelector('.data-packet');
        this.textDisplay = this.el.querySelector('[text]');
        this.calculate = AFRAME.utils.throttleTick(this.calculate, 500, this);
        if (this.data.parent) {

            const parent = document.getElementById(this.data.parent);
            if (parent) {

                window.setTimeout(() => {parent.object3D.attach(this.el.object3D)}, 250);
            } else {

                window.setTimeout(() => {this.el.sceneEl.object3D.attach(this.el.object3D);}, 250);
            }
        } else {
            window.setTimeout(() => {this.el.sceneEl.object3D.attach(this.el.object3D);}, 250);
        }
        if (this.image && this.saveable) {
            this.saveable.setAttribute('material', 'src', this.image);
        }
        if (this.saveable) {
            this.saveable.setAttribute('visible', true);
            this.saveable.setAttribute('sound', 'src: url(/assets/sounds/ButtonClick.mp3); on: click;');
        }
        if (this.textDisplay) {
            if (this.data.text) {
                this.textDisplay.setAttribute('visible', true);
                this.textDisplay.setAttribute('text', 'value', this.data.text);
            } else {
                this.textDisplay.setAttribute('visible', false);
            }
        }

        this.el.emit('registerupdate', {}, true);
    },
    tock: function () {

    },
    calculate: function(time, timeDelta) {
        setTimeout(() => {
            if (!this.textDisplay || !this.saveable) {
                this.update();
                return;
            }
            if (!this.scale.equals(this.saveable.object3D.scale)) {
                this.saveable.object3D.scale.set(this.scale.x, this.scale.y, this.scale.z);
            }
            if (this.saveable?.object3D?.children[0]?.geometry) {
                this.saveable.object3D.children[0].geometry.computeBoundingBox();
            }
            if (!this.saveable.getAttribute('animation')) {
                this.saveable.setAttribute('material', 'color', this.data.color);
                if (this.packet) {
                    this.packet.setAttribute('material', 'color', this.data.color);
                }
            }

        },0);
    },
    tick: function (time, timeDelta) {
        if (this.textDisplay && this.saveable) {
            if (this.saveable?.object3D?.children[0]?.geometry?.boundingBox) {
                const radius = this.saveable
                    .object3D
                    .children[0]
                    .geometry
                    .boundingBox
                    .max
                    .y;
                if (this.textDisplay.object3D?.position) {
                    this.textDisplay
                        .object3D
                        .position
                        .set(0, (radius * this.saveable.object3D.scale.y) + 0.06, 0);
                }
            }
        }
        this.calculate(time, timeDelta);
    },
    events: {
        click: function (evt) {
            evt.detail.cursorEl.components['tracked-controls-webxr'].controller.gamepad.hapticActuators[0].pulse(.8, 100);
            const obj = evt.target.closest('[template]');
            if (typeof newrelic !== 'undefined') {
                newrelic.addPageAction('click', {id: obj.id});
            }
            const mode = getCurrentMode();
            switch (mode) {
                case 'add-children':
                    const parent = getSystem('buttons').first;
                    if (parent) {
                        this.el.setAttribute('stuff', 'parent', parent);
                        document.dispatchEvent(new CustomEvent('shareUpdate', {detail: {id: obj.id, parent: parent}}));
                    } else {
                        this.data.parent='';
                        this.el.setAttribute('stuff', 'parent', '');
                        document.dispatchEvent(new CustomEvent('shareUpdate', {detail: {id: obj.id, parent: ''}}));
                    }
                    break;
                case 'grouping':
                    this.el.emit('buttonstate', {mode: ['add-children'], first: obj.id});
                    break;
                case 'ungrouping':
                    this.el.emit('buttonstate', {mode: ['add-children'], first: null});
                    break;
                case 'aligning':
                    document.dispatchEvent(new CustomEvent('align', {detail: {id: obj.id}}));
                    break;
                case 'removing':
                    console.log('removing');
                    document.dispatchEvent(new CustomEvent('shareUpdate', {detail: {id: obj.id, remove: true}}));
                    break;
                case 'edit-color':
                    const newColor = getSystem('buttons').color;
                    this.data.color = newColor;
                    evt.target.setAttribute('material', 'color', this.data.color);
                    document.dispatchEvent(new CustomEvent('shareUpdate', {detail: {id: obj.id, color: newColor}}));
                    break;
                case 'edit-image':
                    const newImage = getSystem('buttons').image;
                    this.data.image = newImage;
                    evt.target.setAttribute('material', 'src', this.data.image);
                    document.dispatchEvent(new CustomEvent('shareUpdate', {detail: {id: obj.id, image: newImage}}));
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
                        color: getSystem('buttons').color,
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
            obj.setAttribute('animation', "property: material.color; from: #cc2; to: #ff2; dir: alternate; dur: 500; loop: true");
        },
        mouseleave: function (evt) {
            const obj = evt.target;
            obj.setAttribute('material', 'color', this.data.color);
            obj.removeAttribute('animation');

        },
        grabbed: function (evt) {
            this.grabbed = this.el.closest('[template]');
            if (typeof newrelic !== 'undefined') {
                newrelic.addPageAction('grab', {id: this.grabbed.id});
            }
            evt.detail.hand.object3D.attach(this.grabbed.object3D);
        },
        released: function () {
            if (typeof newrelic !== 'undefined') {
                newrelic.addPageAction('release', {id: this.grabbed.id});
            }
            if (this.data.parent) {
                const parent = document.getElementById(this.data.parent);
                if (parent) {
                    parent.object3D.attach(this.grabbed.object3D);
                } else {
                    this.el.setAttribute('stuff', 'parent', '');
                    this.el.sceneEl.object3D.attach(this.grabbed.object3D);
                }
            } else {
                this.el.sceneEl.object3D.attach(this.grabbed.object3D);

            }
            const newPos = round(this.grabbed.object3D.position, .1);
            this.grabbed.object3D.position.set(newPos.x, newPos.y, newPos.z);

            const ang = AFRAME.utils.coordinates.parse(this.grabbed.getAttribute('rotation'));
            this.grabbed.setAttribute('rotation', AFRAME.utils.coordinates.stringify(round(ang, 45)));
            this.grabbed = null;
        }
    }
});


