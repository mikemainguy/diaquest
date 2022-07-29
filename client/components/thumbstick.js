AFRAME.registerComponent('mover', {
  multiple: true,
  schema: {
      axis: {type: 'string', default: 'x'},
      forwardback: {type: 'boolean', default: false},
      elevate: {type: 'boolean', default: false},
      strafe: {type: 'boolean', default: false},
      turn: {type: 'boolean', default: false},
      moveIncrement: {type: 'int', default: 1},
      turnIncrement: {type: 'int', default: 45}
  },
  init: function() {
    this.running = false;
    this.el.addEventListener('thumbstickmoved', this.thumbstick.bind(this));
  },
  thumbstick: function(evt) {
    const val = evt.detail[this.data.axis];
    const sign = Math.sign(val);

      if (Math.abs(val) > 0.5) {
        if (!this.running) {
          this.running=true;
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
  position.y += amount;
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
  //const c = getCamera();
  let pos = rig.getAttribute("position");
  let direction = new THREE.Vector3();
  rig.object3D.getWorldDirection(direction);

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
