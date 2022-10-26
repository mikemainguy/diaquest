import {debug} from './debug';
AFRAME.registerSystem('sizer', {
    schema: {
        color: {type: 'string', value: '#550'}


    },
    eventListener: function(evt) {
        const el = document.querySelector('#' + evt.detail.id);
        if (!el) {
            return;
        } else {
            if (evt.handle) {
                this.handle = evt.handle;
            } else {
                this.handle = null;
            }
        }
        debug('sizing ' + evt.detail.id);
        if (!this.sizer) {
            this.sizer = document.querySelector('#sizer');
            if (!this.sizer) {
                debug('sizer model missing');
                return;
            }
        }
        el.object3D.add(this.sizer.object3D);

        this.sized = el;

        this.saveable = this.sized.querySelector('.saveable');

        this.changeRaycaster();

    },
    init: function () {
        this.bounds = new THREE.Box3();
        this.sized = null;
        this.handle = null;
        this.sizer = document.querySelector('#sizer');
        document.addEventListener('resizing', this.eventListener.bind(this));
    },

    remove: function() {

    },
    changeRaycaster: function(evt) {
        for (const hand of this.getRaycasters()) {
            hand.setAttribute('raycaster', 'objects', '[mixin="sizeConnectorMixin"]');
        }
    },
    getRaycasters: function() {
        return document.querySelectorAll('[raycaster]');
    }
});
AFRAME.registerComponent('sizer', {
    schema: {
        color: {type: 'string', value: '#550'},
        position: {type: 'string'}
    },
    init: function () {
        this.el.setAttribute('material', 'color', this.data.color);
        this.el.addEventListener("mouseenter", this.mouseEnter.bind(this));
        this.el.addEventListener("mouseleave", this.mouseLeave.bind(this));
        this.el.addEventListener("grabbed", this.grabbed.bind(this));
        this.el.addEventListener("released", this.released.bind(this));
        this.start = new THREE.Vector3();
        this.sizing = false;
    },
    grabbed: function(evt){
        evt.detail.hand.object3D.getWorldPosition(this.start);
        this.sizing=true;
        debug('grabbed');
    },
    released: function(evt){
        this.start = new THREE.Vector3();
        debug('released');
    },
    update: function() {
       this.position = AFRAME.utils.coordinates.parse(this.data.position);
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
    tick: function(time) {
        if (this.system.handle && this.system.sized) {

            //debug(this.system.handle.object3D.position)
        }
        if (this.sizing) {

        }
        if (this.system.saveable) {
            const geometry = this.system.saveable.getObject3D('mesh').geometry;
            geometry.computeBoundingBox();
            const bounds = geometry.boundingBox;
            const myFactor = this.position;
            const v = new THREE.Vector3();
            if (this.position.x > 0 || this.position.y > 0 || this.position.z > 0) {
                v.multiplyVectors(this.position, bounds.max);
            } else {
                v.multiplyVectors(this.position, bounds.min);
                v.multiplyScalar(-1);
            }
            this.el.object3D.position.set(v.x, v.y, v.z);
        }


    }

});