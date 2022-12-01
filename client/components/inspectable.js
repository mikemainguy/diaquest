import {changeRaycaster, round} from "./util";

AFRAME.registerComponent('inspectable', {
    schema: {
        //keyboard: {default: '#keyboard', type: 'selector'}
    },
    init: function() {
      document.addEventListener('inspect', this.inspect.bind(this));
    },
    inspect: function(evt) {
        changeRaycaster('[inspectable]');
        this.inspector = document.querySelector('#inspector');
        this.inspector.setAttribute('visible', true);
    },
    update: function () {

    },
    tick: function () {
        if (this.inspector){
            this.inspector.setAttribute('text', 'value', JSON.stringify(this.el.getAttribute('position')));
        }


    },
    events: {
        grabbed: function (evt) {
            this.original = this.el.parentEl;
            evt.detail.hand.object3D.attach(this.el.object3D);
        },
        released: function () {
            this.original.object3D.attach(this.el.object3D);

        }
    }
});