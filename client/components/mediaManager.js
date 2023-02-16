AFRAME.registerComponent('mediamanager', {
    init: function () {

    },
    events: {
        mediaUpdated: function (evt) {
            let x = 0;
            for (const i in evt.detail) {
                const el = document.createElement('a-plane');
                el.setAttribute('material', `src: ${evt.detail[i].href}`);
                el.setAttribute('image-swatch', `image: ${evt.detail[i].href}`)
                el.setAttribute('text', `value: ${evt.detail[i].name}`);
                el.setAttribute('position', `${x++} 0 0`);
                this.el.appendChild(el);
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