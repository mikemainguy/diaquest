AFRAME.registerSystem('animatedpath', {
   init: function() {

   }
});
AFRAME.registerComponent('animation-entry', {
   events: {
      buttonState: function(evt) {
         console.log(evt.detail);
      }
   }

});
AFRAME.registerComponent('animatedpath', {
   schema: {
      steps: {type: 'array', default: ['idf8d6f551-b0eb-401b-953c-7b99c21d65de', 'idfdef9ee5-57ba-4ee6-ba01-70381ec1f2a7',
         'id50bc4c09-861c-451c-9d71-395da5c9bd60']}
   },
   init: function() {
      this.throttled = AFRAME.utils.throttle(this.findNodes, 1000, this);
   },
   update: function(oldData) {
      console.log(oldData);
      this.el.getAttributeNames().forEach((name)=> {
         if (name.startsWith('animation')) {
            this.el.removeAttribute(name);
         }
      });
      this.steps = this.data.steps;
      this.ready = false;


   },
   play: function() {

   },
   start: function() {

   },
   findNodes: function() {
      if (!this.ready) {
         let someMissing = false;
         for (const node of this.steps) {
            if (!document.querySelector('#'+ node)) {
               someMissing = true;
            }
         }
         if (!someMissing){
            for (let i = 1; i < this.steps.length; i++) {
               const from = document.querySelector('#' + this.steps[i-1]);
               const to = document.querySelector('#' + this.steps[i]);
               if (from && to) {
                  this.el.setAttribute('animation__'+i, 'from', AFRAME.utils.coordinates.stringify(from.object3D.position));
                  this.el.setAttribute('animation__'+i, 'to', AFRAME.utils.coordinates.stringify(to.object3D.position));
                  this.el.setAttribute('animation__'+i, 'property', 'position');
                  this.el.setAttribute('animation__'+i, 'dur', 1990);
                  this.el.setAttribute('animation__'+i, 'autoplay', false);
                  this.el.setAttribute('animation__'+i, 'delay', (2000*(i-1))+1);
                  this.el.setAttribute('animation__'+i, 'startEvents', 'startAnimation');
               }
            }
            this.ready = true;
         }
      }
   },
   tick: function() {
      this.throttled();
   }
});
