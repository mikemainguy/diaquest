
AFRAME.registerComponent('forwardback', {
  init: function () {
    this.forwardback = 0;
    this.el.addEventListener('thumbstickmoved', this.thumbstick);
  },
  thumbstick: function (evt) {
    if (Math.abs(evt.detail.y) > 0.2) {
      move(evt.detail.y, false);
    }
  },
  tick: function (time, delta) {


  }
});
AFRAME.registerComponent('turn', {
  init: function () {
    this.el.addEventListener('thumbstickmoved', this.thumbstick);
  },
  thumbstick: function (evt) {
    if (Math.abs(evt.detail.x)  > -0.2) {
      rotate(0 - evt.detail.x);
    }
  },
  tick: function () {

  }
});
AFRAME.registerComponent('strafe', {
  init: function () {
    this.el.addEventListener('thumbstickmoved', this.thumbstick);
  },
  thumbstick: function (evt) {
    if (Math.abs(evt.detail.x) > 0.2) {
      move(evt.detail.x, true);
    }
  },
  tick: function () {

  }
});

function rotate(amount) {
  const rig = getRig();
  let rotation = rig.getAttribute("rotation");
  rotation.y += amount;
  rig.setAttribute("rotation", rotation);
}

function getRig() {
  return document.querySelector("#rig");
}

function getCamera() {
  return document.querySelector( "#camera");
}

function move(amount, slide) {
  const rig = getRig();
  const c = getCamera();
  let pos = rig.getAttribute("position");
  let direction = new THREE.Vector3();
  c.object3D.getWorldDirection(direction);
  direction.y = 0;
  if (slide) {
      let axis = new THREE.Vector3( 0, 1, 0 );
      let deg = 90;
      let angle = deg * (Math.PI / 180);
      direction.applyAxisAngle( axis, angle );
  }
  direction.multiplyScalar(getSpeed(amount));
  pos.add(direction);
  rig.setAttribute("position", pos);
}

function getSpeed(value) {
  let speed = 0;
  if (value > 0) {
    speed = Math.log(value);
  } else {
    speed = (Math.log(Math.abs(value))) * -1;
  }
  return value/5;
}
