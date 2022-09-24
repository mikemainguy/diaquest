AFRAME.registerComponent('sizer', {
    schema: {
        x: {type: 'string', default: '1 0 0'},
        y: {type: 'string', default: '0 1 0'}
    },
    init: function () {
        this.running = false;
        this.thumbstickmoved = this.thumbstickmoved.bind(this);
        this.el.addEventListener('thumbstickmoved', this.thumbstickmoved);
    },
    thumbstickmoved: function(evt) {
        const buttons = document.querySelector('a-scene').systems['buttons'];
        if (buttons.mode.slice(-1)[0]== 'change-size') {
            const ele = document.querySelector('#' + buttons.first);
            const currStuff = ele.getAttribute('stuff').scale;
            const currScale = new THREE.Vector3(currStuff.x, currStuff.y, currStuff.z);
            if (Math.abs(evt.detail.x)>.2) {
                const v1 = AFRAME.utils.coordinates.parse(this.data.x);
                const v = new THREE.Vector3(v1.x, v1.y, v1.z);
                v.multiplyScalar(evt.detail.x);

                currScale.add(v);
                ele.setAttribute('stuff', 'scale',  currScale);

            }
            if (Math.abs(evt.detail.y)>.2) {

                const v1 = AFRAME.utils.coordinates.parse(this.data.y);
                const v = new THREE.Vector3(v1.x, v1.y, v1.z);
                v.multiplyScalar(evt.detail.y);

                currScale.add(v);
                ele.setAttribute('stuff', 'scale',  currScale);

            }
        }
    }
});

