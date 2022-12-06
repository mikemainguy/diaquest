import {changeRaycaster} from "./util";

AFRAME.registerSystem('aligner', {
    init: function () {
        this.direction = null;
        this.saveable = null;
        document.addEventListener('align', this.align.bind(this));
        document.addEventListener('stopalign', this.stopalign.bind(this));

    },
    stopalign: function() {
        this.saveable.removeAttribute('animation');
        this.saveable.setAttribute('color', this.saveable.components['stuff'].data.color);

    },
    getBounds: function (o) {
        const geometry = o.getObject3D('mesh').geometry;
        geometry.computeBoundingBox();
        return geometry.boundingBox;
    },
    calculateOffset(src, dest, dim) {
        const srcBox = this.getBounds(src);

        const srcPos = src.object3D.position.clone();
        src
            .object3D
            .getWorldPosition(
                srcPos
            );


        const destBox = this.getBounds(dest);
        const destPos = dest.object3D.position.clone();
        dest
            .object3D
            .getWorldPosition(
                destPos
            )

        if (Math.abs(dim.x) > 0) {
            src.closest('[template]').object3D.position.setX(destPos.x);
        }
        if (Math.abs(dim.y) > 0) {
            src.closest('[template]').object3D.position.setY(destPos.y);
        }
        if (Math.abs(dim.z) > 0) {
            src.closest('[template]').object3D.position.setZ(destPos.z);
        }
        const obj = src.closest('[template]');
        /*document.dispatchEvent(
            new CustomEvent('shareUpdate', {
                detail: {id: obj.id, position: obj.object3D.position}}));
*/
    },
    align: function (evt) {
        this.changeRaycaster('#aligner a-plane, ');
        const el = document.getElementById(evt.detail.id);
        if (!el) {
            return;
        } else {
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
        this.el.setAttribute('sound', 'src: /assets/sounds/KeyInLow.mp3; volume: 0.2; on: mouseenter;');
        this.el.setAttribute('sound', 'src: /assets/sounds/KeyInLow.mp3; volume: 0.5; on: click;');
    },
    events: {
        click: function (evt) {
            this.system.direction = AFRAME.utils.coordinates.parse(this.data.plane);
        }
    }
});