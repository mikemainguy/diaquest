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
                    const srcBox = this.getBounds(saveable);
                    const destBox = this.getBounds(this.saveable);

                    if (Math.abs(dir.x)> 0) {
                        if (dir.x > 0) {
                            const offset = destBox.max.x - srcBox.max.x;
                            obj.translateX(offset);
                        }   else {
                            const offset = destBox.min.x - srcBox.min.x;
                            obj.translateX(offset);
                        }
                    }
                    if (Math.abs(dir.y)> 0) {

                    }
                    if (Math.abs(dir.z)> 0) {

                    }

                } else {
                    this.saveable = saveable.object3D;
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