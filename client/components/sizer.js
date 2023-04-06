import {debug} from './debug';
import {changeRaycaster, round} from './util';

AFRAME.registerSystem('sizer', {
    schema: {
        color: {type: 'string', value: '#550'}
    },
    eventListener: function (evt) {
        const el = document.getElementById(evt.detail.id);
        if (!el) {
            return;
        } else {
            if (evt.handle) {
                this.handle = evt.handle;
            } else {
                this.el.emit('hideMenu', {id: '#bmenu'}, true);
                this.handle = null;
            }
        }
        debug('sizing ' + evt.detail.id);
        if (!this.sizer) {
            this.sizer = document.getElementById('sizer');
            if (!this.sizer) {
                debug('sizer model missing');
                return;
            }

        }
        el.object3D.add(this.sizer.object3D);

        this.sized = el;

        this.saveable = this.sized.querySelector('.saveable');

        this.changeRaycaster();
        this.sizer.setAttribute('visible', true);

    },
    init: function () {
        this.sized = null;
        this.handle = null;


        this.sizer = document.getElementById('sizer');
        document.addEventListener('resizing', this.eventListener.bind(this));
    },

    remove: function () {

    },
    changeRaycaster: function () {
        changeRaycaster('[mixin="sizeConnectorMixin"]');
    }
});
AFRAME.registerComponent('sizer', {
    schema: {
        color: {type: 'string', value: '#550'},
        position: {type: 'string'}

    },
    init: function () {
        this.el.setAttribute('material', 'color', this.data.color);
        this.el.setAttribute('sound', 'src: #audiohover; on: mouseenter');

        this.start = new THREE.Vector3();
        this.sizing = false;
        this.position = AFRAME.utils.coordinates.parse(this.data.position);
    },
    events: {
        mouseenter: function (evt) {
            const obj = evt.target;
            obj.setAttribute('animation', "property: material.color; from: #cc2; to: #ff2; dir: alternate; dur: 500; loop: true")
        },
        grabbed: function (evt) {
            this.start.copy(this.el.object3D.position);
            this.sizing = true;
            this.hand = evt.detail.hand;
            evt.detail.hand.setAttribute('raycaster', 'objects', '[mixin="sizeConnectorMixin"]');
            debug('grabbed');
        },
        released: function (evt) {
            this.start = new THREE.Vector3();
            const scale = round(this.system.saveable.object3D.scale, .1);
            this.system.sized.setAttribute('stuff', 'scale', AFRAME.utils.coordinates.stringify(scale));
            document.dispatchEvent(new CustomEvent('shareUpdate', {
                detail: {
                    id: this.system.saveable.closest('[template]').getAttribute('id'),
                    scale: scale.x + ' ' +
                        scale.y + ' ' +
                        scale.z
                }
            }));
            evt.detail.hand.setAttribute('raycaster', 'objects', '[mixin="sizeConnectorMixin"], .saveable');
            this.hand = null;

            debug('released');
        },
        mouseleave: function (evt) {
            const obj = evt.target;
            obj.setAttribute('material', 'color', this.data.color);
            obj.removeAttribute('animation');
        }
    },
    update: function () {
        this.position = AFRAME.utils.coordinates.parse(this.data.position);
    },
    tick: function () {
        if (this.system.handle && this.system.sized) {

            //debug(this.system.handle.object3D.position)
        }
        if (this.sizing && this.hand && this.hand.components['raycaster']) {
            const v = new THREE.Vector3();
            v.copy(this.start);

            const v2 = new THREE.Vector3();
            this.hand.components['buttons'].pointer.object3D.getWorldPosition(v2);
            this.el.object3D.parent.worldToLocal(v2);

            if (Math.abs(this.position.y) > 0 && (v2.y != 0)) {
                this.system.saveable.object3D.scale.setY(v2.y * 2);
            }
            if (Math.abs(this.position.x) > 0 && (v2.x != 0)) {
                this.system.saveable.object3D.scale.setX(v2.x * 2);
            }
            if (Math.abs(this.position.z) > 0 && (v2.z != 0)) {
                this.system.saveable.object3D.scale.setZ(v2.z * 2);
            }


        }
        if (this.system.saveable) {
            const geometry = this.system.saveable.getObject3D('mesh').geometry;
            geometry.computeBoundingBox();
            const bounds = geometry.boundingBox;

            const v = new THREE.Vector3();

            if (this.position.x > 0 || this.position.y > 0 || this.position.z > 0) {
                v.multiplyVectors(this.position, bounds.max);
                v.multiply(this.system.saveable.object3D.scale);
            } else {
                v.multiplyVectors(this.position, bounds.min);
                v.multiply(this.system.saveable.object3D.scale);
                v.multiplyScalar(-1);
            }
            this.el.object3D.position.set(v.x, v.y, v.z);

        }


    }

});