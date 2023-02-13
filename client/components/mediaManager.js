AFRAME.registerComponent('mediamanager', {
    init: function() {

    },
    events: {
        mediaUpdated: function(evt) {
            let x = 0;
            console.log(this.el);
            for (const i in evt.detail) {

                const el = document.createElement('a-plane');
                el.setAttribute('material', `src: ${evt.detail[i].href}`);
                el.setAttribute('text', `value: ${evt.detail[i].name}`);
                el.setAttribute('position', `${x++} 0 0`);
                this.el.appendChild(el);
                console.log(evt.detail[i].href);
            }


        }
    }

});