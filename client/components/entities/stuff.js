import {changeRaycaster, getCurrentMode, getSystem, round} from "../util";

const TIMEOUT = 100;
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
    addChild: function (el) {
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
        if (this.scale &&
            this.saveable &&
            this.saveable.object3D) {
            this
                .saveable
                .object3D
                .scale
                .set(this.scale.x,
                    this.scale.y,
                    this.scale.z);
        }

        this.calculate = AFRAME.utils.throttleTick(this.calculate, 500, this);
        if (this.data.parent) {
            const parent = document.getElementById(this.data.parent);
            if (parent) {
                window.setTimeout(() => {
                    parent.object3D.attach(this.el.object3D)
                }, TIMEOUT);
            } else {
                window.setTimeout(() => {
                    this.el.sceneEl.object3D.attach(this.el.object3D);
                }, TIMEOUT);
            }
        } else {
            window.setTimeout(() => {
                this.el.sceneEl.object3D.attach(this.el.object3D);
            }, TIMEOUT);
        }
        if (this.image && this.saveable) {
            this.saveable.setAttribute('material', 'src', this.image);
        }
        if (this.textDisplay) {
            if (this.data.text) {
                this.textDisplay.setAttribute('visible', true);
                this.textDisplay.setAttribute('text', 'value', this.data.text);
            } else {
                this.textDisplay.setAttribute('visible', false);
            }
        }
        if (this.saveable) {
            window.setTimeout(() => {
                this.saveable.setAttribute('visible', true)
            }, TIMEOUT);
            this.saveable.setAttribute('sound', 'src: url(/assets/sounds/ButtonClick.mp3); on: click;');
        }

        this.el.emit('registerupdate', {}, true);
    },
    tock: function () {

    },
    calculate: function (time, timeDelta) {
        setTimeout(() => {
            if (!this.textDisplay || !this.saveable) {
                this.update();
                return;
            }
            const obj = this.saveable.object3D;
            if (!this.scale.equals(obj.scale)) {
                obj
                    .scale
                    .set(
                        this.scale.x,
                        this.scale.y,
                        this.scale.z);
                for (const o of obj.children) {
                    if (o.geometry) {
                        o.geometry.computeBoundingBox();
                    }
                }
            }
            for (const o of obj.children) {
                if (o.geometry && !o.geometry.boundingBox) {
                    o.geometry.computeBoundingBox();
                }
            }

            if (!this.saveable.getAttribute('animation')) {
                this.saveable.setAttribute('material', 'color', this.data.color);
                if (this.packet) {
                    this.packet.setAttribute('material', 'color', this.data.color);
                }
            }

        }, 0);
    },
    tick: function (time, timeDelta) {
        if (this.textDisplay && this.saveable) {
            if (this.saveable?.object3D?.children[0]?.geometry?.boundingBox) {
                const maxY = this.saveable
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
                        .set(0, (maxY * this.saveable.object3D.scale.y) + 0.06, 0);
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
                        this.data.parent = '';
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
                case 'align':
                    document.dispatchEvent(new CustomEvent('align', {detail: {id: obj.id}}));
                    break;
                case 'remove':
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
                case 'resize':
                    this.el.emit('buttonstate', {mode: ['change-size'], first: obj.id}, true);
                    document.dispatchEvent(new CustomEvent('resizing', {detail: {id: obj.id}}));
                    break;
                case 'edit':
                    this.el.emit('buttonstate', {mode: ['typing'], first: obj.id}, true);
                    const keyboard = document.getElementById('keyboard');
                    changeRaycaster('.keyboardRaycastable');
                    keyboard.emit('show', {value: this.data.text, elId: obj.id});
                    break;
                case 'copy':
                    this.el.emit('buttonstate', {mode: ['copy'], first: obj.id}, true);
                    break;
                case 'add':
                    this.el.emit('buttonstate', {mode: ['add'], first: obj.id}, true);
                    break;
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


