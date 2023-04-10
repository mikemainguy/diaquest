AFRAME.registerComponent('scene-initializer', {
    init: function() {
        const sceneEl = this.el;
        console.log('scene initializer registered');
        document.dispatchEvent(new CustomEvent('aframeLoaded', {detail: {status: 'OK'}}));
    }
});