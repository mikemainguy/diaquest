AFRAME.registerSystem('aligner', {
    init: function () {
        this.direction = null;
        this.saveable = null;
        document.addEventListener('align', this.align.bind(this));
    },
    getBounds: function(o) {
        const geometry = o.getObject3D('mesh').geometry;
        geometry.computeBoundingBox();
        return geometry.boundingBox;
    },
    calculateOffset(src, dest, dim) {
        const srcBox = this.getBounds(src);

        const srcPos = src
            .object3D
            .getWorldPosition(
                src.object3D.position
            );
        const destBox = this.getBounds(dest);
        const destPos = dest
            .object3D
            .getWorldPosition(
                dest.object3D.position
            )
        const dist= srcPos.distanceTo(destPos);
        if (dist != 0) {
            dest.object3D.translateOnAxis(dim, dist);
        }


    },
    align: function(evt) {
        this.changeRaycaster();
        const el = document.getElementById(evt.detail.id);
        if (!el) {
            return;
        } else {
            const saveable = el.querySelector('.saveable');
            if (saveable) {
                if (this.saveable != null && this.direction != null) {
                    const dir = this.direction;
                    this.calculateOffset(saveable, this.saveable, dir);
                } else {
                    this.saveable = saveable;
                }
            } else {
                this.saveable = null;
                this.direction = el.getAttribute('position');
            }
        }
    },
    changeRaycaster: function () {
        for (const hand of this.getRaycasters()) {
            hand.setAttribute('raycaster', 'objects', '#aligner a-box, .saveable');
        }
    },
    getRaycasters: function () {
        return document.querySelectorAll('[raycaster]');
    }
});
AFRAME.registerComponent('aligner', {
    schema: {

    },
    events: {
        click: function (evt) {
            this.system.direction = this.el.getAttribute('position')
        }
    }
});