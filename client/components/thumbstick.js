AFRAME.registerComponent('mover', {
  multiple: true,
  schema: {
      axis: {type: 'string', default: 'x'},
      forwardback: {type: 'boolean', default: false},
      elevate: {type: 'boolean', default: false},
      strafe: {type: 'boolean', default: false},
      turn: {type: 'boolean', default: false},
      moveIncrement: {type: 'float', default: 0.25},
      turnIncrement: {type: 'float', default: 22.5}
  },
  init: function() {
    this.sound = false;
    this.running = false;
    this.el.addEventListener('thumbstickmoved', this.thumbstick.bind(this));
    document.querySelector('#camera').setAttribute('camera', 'active', true);
  },
  thumbstick: function(evt) {
    if (!this.sound) {
      document.querySelector('#ambient').components.sound.playSound();
      this.sound = true;
    }
    const val = evt.detail[this.data.axis];
    const sign = Math.sign(val);
    const fastmove = Math.abs(val) > .9;
      if (Math.abs(val) > 0.2) {
        if (fastmove || !this.running) {
          if (!fastmove) {
            this.running =true;
          }
          if (this.data.forwardback) {
            move(this.data.moveIncrement * sign, false);
          }
          if (this.data.elevate) {
            elevate(this.data.moveIncrement * sign);
          }
          if (this.data.strafe) {
            move(this.data.moveIncrement * sign, true);
          }
          if (this.data.turn) {
            rotatey( (this.data.turnIncrement * sign)*-1);
          }
        }
      } else {
        this.running = false;
      }
  }
});

function elevate(amount) {
  const rig = getRig();
  let position = rig.getAttribute("position");
  position.y -= amount;
  rig.setAttribute("position", position);
}

function rotatey(amount) {
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
  direction.multiplyScalar(amount);
  pos.add(direction);
  rig.setAttribute("position", pos);
}
