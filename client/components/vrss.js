AFRAME.registerSystem('vrss', {
   init: function() {
       this.els = [];
       this.registerElement = this.registerElement.bind(this);
       document.addEventListener('vrss', this.registerElement);
   },
    registerElement: function(event) {
       this.els.push(event.detail);
    }
});
AFRAME.registerComponent('vrss', {
    schema: {
        width: {default: 1, type: 'number'},
        height: {default: 1, type: 'number'},
        display: {default: 'block', type: 'string'}
    },
    init: function() {
        const mesh = this.el.getObject3D('mesh');
        if (mesh && mesh.geometry.isBufferGeometry) {
            mesh.geometry.computeBoundingBox();
        }
    },
    update: function(oldData) {
        const mesh = this.el.getObject3D('mesh');
        if (mesh && mesh.geometry.isBufferGeometry) {
            mesh.geometry.computeBoundingBox();
        }
        if (this.el.parentEl.hasAttribute('vrss')) {
            console.log('here');
        } else {
            console.log('not here');
        }
        document.dispatchEvent(new CustomEvent('vrss', {detail: this.el}));
    }
});