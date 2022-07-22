AFRAME.registerComponent('collider', {
  init: function() {
    this.el.addEventListener('raycaster-intersected', function() {
      console.log("raycast");
      this.el.setAttribute("color", "#00f");
    })
  }
})
