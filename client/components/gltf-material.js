AFRAME.registerComponent('gltf-material', {
    schema: {
        color: {default: '#f22', type: 'string'},
        opacity: {default: 1, type: 'number'}
    },
    init: function () {
        this.color = this.data.color;
        this.modelLoaded = this.modelLoaded.bind(this);
        this.materialChanged = this.materialChanged.bind(this);
        this.el.addEventListener('model-loaded', this.modelLoaded);
        this.el.addEventListener('componentchanged', this.materialChanged);
    },
    materialChanged: function (evt) {
        console.log(evt.detail.name);
    },
    modelLoaded: function (evt) {
        const mesh = this.el.getObject3D('mesh');
        const color = this.data.color;
        const opacity = this.data.opacity;
        mesh.traverse(function (node) {
            if (node.isMesh && node.material) {
                node.material.color.set(color);
                node.material.opacity = opacity;
                node.material.needsUpdate;
            }
        });
    },
    update: function () {
        if (this.color != this.data.color) {
            this.modelLoaded();
            this.color = this.data.color;

        }
    }
});