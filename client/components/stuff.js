import {getCurrentMode, getSystem, changeRaycaster, createUUID} from "./util";

AFRAME.registerComponent('stuff', {
    schema: {
        text: {type: 'string'},
        color: {type: 'string'},
        scale: {type: 'string', default: '.2 .2 .2'}

    },
    init: function () {
        this.el.addEventListener("click", this.clickHandler.bind(this));
        this.el.addEventListener("mouseenter", this.mouseEnter.bind(this));
        this.el.addEventListener("mouseleave", this.mouseLeave.bind(this));
        this.el.addEventListener("grabbed", this.grabHandler.bind(this));
        this.el.addEventListener("released", this.releaseHandler.bind(this));
        this.saveable = this.el.querySelector('.saveable');
        if (this.saveable) {
            this.scale = AFRAME.utils.coordinates.parse(this.data.scale);
            this.saveable.object3D.scale.set(this.scale.x, this.scale.y, this.scale.z);
        }

    },
    tick: function(time, timeDelta) {
      if (this.textDisplay  && this.saveable) {
          this.saveable.object3D.children[0].geometry.computeBoundingBox()
          const radius = this.saveable.object3D.children[0].geometry.boundingBox.max.y;
          this.textDisplay.position.set(0,radius * this.saveable.object3D.scale.y,0);
      }
    },
    grabHandler: function(evt) {
        this.grabbed = this.el.closest('[template]');
        evt.detail.hand.object3D.attach(this.grabbed.object3D);
    },
    releaseHandler: function(evt) {
        this.el.sceneEl.object3D.attach(this.grabbed.object3D);
        this.grabbed = null;
    },
    mouseEnter: function (evt) {
        const obj = evt.target;
        obj.setAttribute('animation',  "property: material.color; from: #cc2; to: #ff2; dir: alternate; dur: 500; loop: true")
    },
    mouseLeave: function (evt) {
        const obj = evt.target;
        obj.setAttribute('material', 'color', this.data.color);
        obj.removeAttribute('animation');
    },
    clickHandler: function (evt) {
        const buttons = getSystem('buttons');
        const obj = evt.target.closest('[template]');
        switch (getCurrentMode()) {
            case 'removing':
                document.dispatchEvent( new CustomEvent('shareUpdate', {detail: {id: obj.id, remove: true}}));
                break;
            case 'edit-color':
                const newColor = getSystem('color-picker').color
                this.data.color = newColor;
                evt.target.setAttribute('material', 'color', this.data.color);
                document.dispatchEvent( new CustomEvent('shareUpdate', {detail: {id: obj.id, color: newColor}}));
                break;
            case 'resizing':
                buttons.first = obj.id;
                buttons.mode.push('change-size');
                document.dispatchEvent( new CustomEvent('resizing', {detail: {id: obj.id}}));
                break;
            case 'editing':
                buttons.first = obj.id;
                buttons.mode.push('typing');
                const keyboard = document.querySelector('#keyboard');
                keyboard.setAttribute('3d-keyboard', 'value', this.data.text);
                keyboard.setAttribute('position', getKeyboardPosition(-1));
                const c = document.querySelector('#camera').object3D;
                const v = new THREE.Vector3();
                c.getWorldPosition(v);
                keyboard.object3D.lookAt(v);

                changeRaycaster('.keyboardRaycastable');
                keyboard.emit('show');
                break;
            case 'moving':
                buttons.first = obj.id;
                const event = new Event('rigChanged');
                document.dispatchEvent(event);
                break;
            case 'select-first':
                buttons.first = obj.id;
                buttons.mode.push('select-second');
                break;
            case 'select-second':
                switch (buttons.mode[0]) {
                    case 'connecting':
                        const data = {
                            id: createUUID(),
                            first: buttons.first,
                            second: obj.id,
                            text: '',
                            color: getSystem('color-picker').color,
                            template: '#connector-template'
                        }
                        document.dispatchEvent(
                            new CustomEvent('shareUpdate',
                                {detail: data}));

                        buttons.mode.pop();
                        break;

                }
        }
    },
    update: function () {
        const textDisplay = this.el.querySelector('[text-geometry]');
        this.saveable = this.el.querySelector('.saveable');
        if (this.saveable) {
            this.scale = AFRAME.utils.coordinates.parse(this.data.scale);
            this.saveable.object3D.scale.set(this.scale.x, this.scale.y, this.scale.z);
        }
        if (textDisplay) {
            if (this.data.text) {
                this.textDisplay = textDisplay.object3D;
                textDisplay.setAttribute('visible', true);
                textDisplay.setAttribute('text-geometry', 'value', this.data.text);
               // textDisplay.setAttribute('position', '0 0 0');
            } else {
                this.textDisplay = null;
                textDisplay.setAttribute('visible', false);
            }

        }

        const saveable = this.el.querySelector('.saveable');
        if (saveable) {
            saveable.setAttribute('material', 'color', this.data.color);
        }
    }
});

function getKeyboardPosition(distance) {
    let pos = new THREE.Vector3();
    const c = document.querySelector('#camera').object3D;
    c.getWorldPosition(pos);
    let dir = new THREE.Vector3();
    c.getWorldDirection(dir);
    dir.multiplyScalar(distance ? distance : -1);
    dir.y -= .3;

    pos.add(dir);
    return pos;
}
