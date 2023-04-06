AFRAME.registerComponent('mediamanager', {
    init: function () {

    },
    events: {
        mediaUpdated: function (evt) {
            let x = 0;
            let y = 0;
            const curve = new THREE.EllipseCurve(0, 0, 2, 2, 0, 2 * Math.PI, false, 0);
            for (const i in evt.detail) {
                const el = document.createElement('a-plane');
                el.setAttribute('material', `src: ${evt.detail[i].href};side: double`);
                el.setAttribute('image-swatch', `image: ${evt.detail[i].href}`)
                el.setAttribute('text', `value: ${evt.detail[i].name}`);
                el.setAttribute('lookatme', '');
                if (evt.detail[i].width && evt.detail[i].height) {
                    const ratio = evt.detail[i].height / evt.detail[i].width;
                    el.setAttribute('height', ratio);
                    el.setAttribute('width', 1);
                }

                const pos = curve.getPoint(x);
                el.setAttribute('position', `${pos.x} ${Math.round(y / 10)} ${pos.y}`);
                this.el.appendChild(el);
                x = x + .1;
                y++;
            }
        }
    }
});

AFRAME.registerComponent('image-swatch', {
    schema: {
        image: {type: 'string'}
    },
    init: function () {
        this.el.addEventListener("click", this.clickHandler.bind(this));
    },
    clickHandler: function (evt) {
        this.el.emit('hideMenu', {id: '#image-picker'}, true);
        this.el.emit('buttonstate', {mode: ['edit-image'], image: this.data.image}, true);
    }
});