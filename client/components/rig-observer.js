AFRAME.registerComponent('rig-observer', {
    schema: {
        rig: {default: '.rig', type: 'selector'},
        camera: {default: '.rig #camera', type: 'selector'}
    },
    init: function () {
        this.rigObj = this.data.rig.object3D;
        this.mover = document.querySelector('a-scene').systems['mover'];

        this.camObj = this.data.camera.object3D;
        this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);

    },
    tick: function (t, dt) {
        const rigDirection = new THREE.Vector3();
        const camDirection = new THREE.Vector3();

        this.rigObj.getWorldDirection(rigDirection);
        this.camObj.getWorldDirection(camDirection);


        const output =

            `Rig
             position: ${this.roundVec(this.rigObj.position)}
             rotation: ${this.roundVec(this.rigObj.rotation)}
             direction: ${this.roundVec(rigDirection)}
             Camera
             position: ${this.roundVec(this.camObj.position)}
             rotation: ${this.roundVec(this.camObj.rotation)}
             direction: ${this.roundVec(camDirection)}
             mover: ${this.roundVec(this.mover.velocity)}
             speed: ${this.mover.velocity.length()}
             time: ${Math.round(t/1000)}
            `;

        this.el.setAttribute('text', 'value', output);
    },
    roundVec: function(vec) {
        const pos=vec.clone().toArray().slice(0,3);
        return JSON.stringify(pos.map( x => x.toFixed(4)));
    }

});