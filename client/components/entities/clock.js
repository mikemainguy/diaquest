AFRAME.registerComponent('clock', {
    schema: {
        position: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        color: {type: 'color', default: '#cfc'},
        font: {type: 'string', default: 'monoid'}
    },
    init: function () {
        this.el.setAttribute('text-geometry', 'value', '.');
        this.updateTime = this.updateTime.bind(this);
        window.setInterval(() => {
            this.updateTime()
        }, 1000);
    },
    updateTime: function () {
        this.el.setAttribute('text-geometry', 'value', this.getTime());
    },
    getTime: function () {
        const d = new Date();
        return d.toLocaleTimeString();
    }
});