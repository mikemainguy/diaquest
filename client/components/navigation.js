AFRAME.registerComponent('navigation', {
    schema: {
        //keyboard: {default: '#keyboard', type: 'selector'}
    },
    update: function () {
        const factor = 3;
        let x = 0;
        const z = 0;
        for (el of this.el.children) {
            el.setAttribute('position',
                new THREE.Vector3((-1 + (x%factor)) * 3,(Math.floor(x/factor))*3,z));
            x++;
        }
    },
    tick: function () {

    }
});