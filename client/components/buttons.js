AFRAME.registerComponent('buttons', {
  init: function () {

    this.el.addEventListener("bbuttondown", this.bbuttondown);
    this.el.addEventListener("bbuttonup", this.bbuttonup);
    // this.el.addEventListener("triggerup", this.triggerup);
  },
  bbuttondown: function (evt) {
    showHud();
  },
  bbuttonup: function(evt) {
    const hud = document.querySelector('#hud');
    hud.parentElement.removeChild(hud);
  },
  tick: function () {

  }
});

function showHud() {
  const scene = document.querySelector("a-scene");
  const ele = document.createElement('a-entity');
  ele.setAttribute('id', 'hud');
  ele.setAttribute('lookatme', '');
  ele.setAttribute('position', getHUDPosition(-3));
  ele.setAttribute("template", "src: #hud-template");
  scene.appendChild(ele);
}
