AFRAME.registerComponent('connector', {
    schema: {
        startEl: {type: 'string'},
        endEl: {type: 'string'},
        speed: {type: 'number', default: 1.0},
        delay: {type: 'number', default: 1.0},
        twoWay: {type: 'boolean', default: false}
    },
    events: {}
    ,
    init() {
        this.changed = this.changed.bind(this);
        this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
        this.startAttached = false;
        this.endAttached = false;
    },
    update: function () {
        this.pos1 = new THREE.Vector3();
        this.pos2 = new THREE.Vector3();

        if (this.data.startEl) {
            const el = document.querySelector(this.data.startEl);
            if (!this.startAttached && el && el.object3D) {
                el.addEventListener('child-attached', this.changed);
                el.addEventListener('registerupdate', this.changed);
                if (el?.components['stuff']?.saveable?.object3D) {
                    this.obj1 = el?.components['stuff']?.saveable?.object3D;
                }
                this.startAttached = true;
            }
        }
        if (this.data.endEl) {
            const el = document.querySelector(this.data.endEl);
            if (!this.endAttached && el && el.object3D) {
                el.addEventListener('child-attached', this.changed);
                el.addEventListener('registerupdate', this.changed);
                if (el?.components['stuff']?.saveable?.object3D) {
                    this.obj2 = el?.components['stuff']?.saveable?.object3D;
                }
                this.endAttached = true;
            }
        }
        if (this.obj1 && this.obj2) {
            if (this.el.querySelector('.data-direction')) {
                this.connector = this.el.querySelector('.data-direction').object3D;
            }
            if (this.el.querySelector('.label')) {
                this.label = this.el.querySelector('.label').object3D;
            }
            if (this.el.querySelector('.data-packet')) {
                this.dataPacket = this.el.querySelector('.data-packet').object3D;
            }
        } else {

        }

    },
    changed: function(evt) {
        const el = evt.detail.el;
        if (el.classList.contains('saveable')) {
            const template = el.closest('[template]');
            if (template && ('#' + template.getAttribute('id')) == this.data.startEl) {
                this.obj1 = el.object3D;
            }
            if (template && ('#' + template.getAttribute('id')) == this.data.endEl) {
                this.obj2 = el.object3D;
            }
        }
    },
    tick: function (time, timeDelta) {
        if (this.obj1 && this.obj2 && this.connector) {
            this.obj1.getWorldPosition(this.pos1);
            this.obj2.getWorldPosition(this.pos2);
            const distance = this.pos1.distanceTo(this.pos2);
            const intersections = this.getIntersections(distance);
            if (intersections &&
                intersections.length > 1) {

                const d2 = intersections[0].distanceTo(intersections[1]);
                const pos = intersections[0].lerp(intersections[1], .5);

                this.el.object3D.position.set(pos.x, pos.y, pos.z);
                this.el.object3D.lookAt(intersections[1]);
                this.connector.scale.y = d2 - .02;
                this.connector.position.setZ(.02);
                if (!this.dataPacket) {
                    this.dataPacket = this.el.querySelector('.data-packet').object3D;
                } else {
                    this.dataPacket
                        .position.setZ((d2 / -2) + .02);
                }
                if (this.label) {
                    this.label.position.set(0, .1, 0);
                } else {
                    this.label = this.el.querySelector('.label').object3D;
                }

            }
        } else {
            this.update();
        }
        if (!this.connector && this.el.querySelector('.data-direction')) {
            this.connector = this.el.querySelector('.data-direction').object3D;
        } else {
            if (!this.connector.el.getAttribute('visible')) {
                this.connector.el.setAttribute('visible', true);
            }
        }

    },
    getIntersections: function (distance) {
        if (!this.obj1 || !this.obj1.el || !this.obj2 || !this.obj2.el) {
            return;
        }
        const direction = new THREE.Vector3();
        direction.subVectors(this.pos2, this.pos1);
        direction.normalize();
        const raycast = new THREE.Raycaster(this.pos1, direction, 0, distance);
        const intersects = raycast.intersectObjects([this.obj1, this.obj2], true);
        const intersections = [];
        if (intersects.length > 0) {
            intersections.push(intersects[0].point);
        }
        direction.multiplyScalar(-1);
        const raycast2 = new THREE.Raycaster(this.pos2, direction, 0, distance);
        const intersects2 = raycast2.intersectObjects([this.obj1, this.obj2], true);
        if (intersects2.length > 0) {
            intersections.push(intersects2[0].point);
        }
        return intersections;
    }
});
