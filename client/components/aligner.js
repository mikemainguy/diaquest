import {changeRaycaster} from "./util";

AFRAME.registerSystem('aligner', {
    init: function () {
        this.direction = null;
        this.saveable = null;
        document.addEventListener('align', this.align.bind(this));
        document.addEventListener('stopalign', this.stopalign.bind(this));
    },
    stopalign: function () {
        this.saveable.removeAttribute('animation');
        this.saveable.setAttribute('color', this.saveable.components['stuff'].data.color);
    },
    getBounds: function (o) {
        const geometry = o.getObject3D('mesh').geometry;
        geometry.computeBoundingBox();
        return geometry.boundingBox;
    },
    calculateOffset(src, dest, dim) {
        const srcPos = src.object3D.position.clone();
        src
            .object3D
            .getWorldPosition(
                srcPos
            );
        const destPos = dest.object3D.position.clone();
        dest
            .object3D
            .getWorldPosition(
                destPos
            )
        const position = src.closest('[template]').object3D.position;
        if (Math.abs(dim.x) > 0) {
            position.setX(destPos.x);
        }
        if (Math.abs(dim.y) > 0) {
            position.setY(destPos.y);
        }
        if (Math.abs(dim.z) > 0) {
            position.setZ(destPos.z);
        }
    },
    align: function (evt) {
        if (!evt.detail.id) {
            return;
        }
        const bmenu = document.getElementById('bmenu');
        if (bmenu && bmenu.object3D.visible) {
            this.changeRaycaster('#aligner a-plane, #bmenu [widget], ');
        } else {
            this.changeRaycaster('#aligner a-plane, ');
        }

        const el = document.getElementById(evt.detail.id);
        if (el) {
            const saveable = el.querySelector('.saveable');
            const aligner = document.querySelector('#aligner');
            if (saveable) {
                if (this.saveable != null &&
                    this.direction != null) {
                    const dir = this.direction;
                    this.calculateOffset(saveable, this.saveable, dir);
                    this.saveable.closest('[template]').components['stuff'].aligning = false;
                    this.saveable.closest('[template]').emit('mouseleave');
                    this.saveable = null;
                    this.direction = null;
                    aligner.setAttribute('visible', false);
                    this.changeRaycaster('');
                } else {
                    this.saveable = saveable;
                    const pos = saveable.object3D.position.clone();
                    saveable
                        .object3D
                        .getWorldPosition(
                            pos
                        )
                    aligner.setAttribute('position', pos);
                    aligner.setAttribute('visible', true);
                    this.saveable.setAttribute('animation', 'from: #f00; to: #0f0; property: material.color; loop: true; dir: alternate; dur: 1000');
                }
            } else {
                if (this.saveable) {
                    this.saveable.removeAttribute('animation');
                    this.saveable = null;
                    this.changeRaycaster('');
                }
                this.direction = AFRAME.utils.coordinates.parse(el.components['aligner'].data.plane);
            }
        }
    },
    changeRaycaster: function (value) {
        changeRaycaster(value + '.saveable');
    }
});
AFRAME.registerComponent('aligner', {
    schema: {
        plane: {type: 'string'}
    },
    init: function () {
        this.el.setAttribute('sound', 'src: #audiohover; volume: 0.2; on: mouseenter;');
        this.el.setAttribute('sound', 'src: #audioclick; volume: 0.5; on: click;');
    },
    events: {
        click: function () {
            this.system.direction = AFRAME.utils.coordinates.parse(this.data.plane);
        }
    }
});