AFRAME.registerSystem('mover', {
  init: function() {
    this.enabled = true;
  }
});

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
    this.handler = this.thumbstick.bind(this);
    this.el.addEventListener('thumbstickmoved', this.handler);
    document.querySelector('#camera').setAttribute('camera', 'active', true);
  },
  remove: function() {
    this.el.removeEventListener(this.handler);
  },
  thumbstick: function(evt) {
    if (!this.system.enabled) {
      return;
    }


      const ambient = document.querySelector('#ambient').components.sound;
    if (ambient.loaded && ambient.listener.context.state != 'running') {
      ambient.playSound();
    }


    const buttons = document.querySelector('a-scene').systems['buttons'];
    const val = evt.detail[this.data.axis];
    const sign = Math.sign(val);

    const fastmove = Math.abs(val) > .9;
      if (Math.abs(val) > 0.1) {
        if (fastmove || !this.running) {
          if (!fastmove) {
            this.running = true;
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

function rotatey(amount) {
  const rig = getRig();
  let rotation = rig.getAttribute("rotation");
  rotation.y += amount;
  rig.setAttribute("rotation", rotation);
  updatePosition(rig, rig.getAttribute('position'));
}

function getRig() {
  const buttons = document.querySelector('a-scene').systems['buttons'];
  if (buttons && buttons.first && buttons.mode[0] == 'moving') {
    return document.querySelector('#' + buttons.first);
  } else {
    return document.querySelector(".rig");
  }
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
  updatePosition(rig, pos);

}

function elevate(amount) {
  const rig = getRig();
  let position = rig.getAttribute("position");
  position.y -= amount;
  updatePosition(rig, position);
}

function updatePosition(rig, position) {
  import('../firebase/firebase.js').then((module) => {
    const data = {
      id: rig.getAttribute('id'),
      position: position,
      rotation: rig.getAttribute('rotation')
    }
    module.updateEntity(data);
  });

}
