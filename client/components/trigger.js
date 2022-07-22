AFRAME.registerComponent('trigger', {
  init: function () {
    //this.el.addEventListener("triggerdown", this.triggerdown);
    // this.el.addEventListener("triggerup", this.triggerup);
  },
  keypress: (evt) => {

  },
  triggerup: function(evt) {

  },
  triggerdown: function (evt) {
    const ele = document.createElement('a-entity');
    let pos = new THREE.Vector3();
    this.object3D.getWorldPosition(pos);
    let dir = new THREE.Vector3();
    this.object3D.getWorldDirection(dir);

    ele.setAttribute('position', pos);
    ele.setAttribute('grabbable', "");
    ele.setAttribute('collider', "");
    ele.setAttribute("template", "src: #billboard");
    const scene = document.querySelector("a-scene");
    scene.appendChild(ele);
  },
  tick: function () {

  }
});

