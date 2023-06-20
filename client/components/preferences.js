AFRAME.registerSystem('preferences', {
    schema: {
        skyMaterial: {type: 'string', default: '/assets/skyboxes/outdoor_field.jpeg'},
        skyColor: {type: 'string', default: '#fff'},
        floorMaterial: {type: 'string', default: '/assets/materials/grass.jpeg'},
        floorColor: {type: 'string', default: '#272'},
        floorRepeat: {type: 'string', default: '100 100'},
        ambientVolume: {type: 'number', default: '1'},
        rotateSnap: {type: 'number', default: '22.5'},
        positionSnap: {type: 'number', default: '.1'}
    },
    init: function () {
        console.log("Preferences Initialized");
        this.el.sceneEl.addEventListener('loaded', () => {
            console.log("Main Scene Loaded");
        })
    },
    update: function (oldData) {
        console.log('Preferences Updated');
        const sky = document.querySelector('a-sky');
        sky.setAttribute('material', 'src', this.data.skyMaterial);
        sky.setAttribute('material', 'color', this.data.skyColor);
        const floor = document.querySelector('#floor');
        floor.setAttribute('material', 'src', this.data.floorMaterial);
        floor.setAttribute('material', 'color', this.data.floorColor);
        floor.setAttribute('material', 'repeat', this.data.floorRepeat);
        const backgroundSound = document.querySelector('#ambient');

    }
});