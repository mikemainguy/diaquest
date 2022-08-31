AFRAME.registerSystem('collider', {
  init: function () {
    this.el.addEventListener('raycaster-intersected', this.intersected.bind(this));
    this.el.addEventListener('raycaster-intersected-cleared', this.cleared.bind(this));
  },
  cleared: function(event) {
      event.target.setAttribute('material', 'wireframe', false);
      event.target.setAttribute('material', 'color', event.target.getAttribute('base-color'));
      //event.target.setAttribute('position', event.target.getAttribute('base-position'));
      event.target.classList.remove('intersected');
  },
  intersected: function(event) {
    const intersected = document.querySelectorAll('.intersected');

    for (const obj of intersected) {
      if (obj && obj.classList) {
        if (obj.getAttribute('id') != event.target.getAttribute('id')) {
          obj.classList.remove('intersected');
        }
      }
    }

    event.target.setAttribute('base-color', event.target.getAttribute('material').color);
    //event.target.setAttribute('base-position', event.target.getAttribute('position'));
    if (event.target.classList.contains('colorswatch')) {

    } else {
      event.target.setAttribute('material', 'color', '#ff0');
    }

    if (!event.target.classList.contains('intersected')) {
      event.target.classList.add('intersected');
    }

    if (event.target.classList.contains('saveable')) {
      event.target.setAttribute('material', 'wireframe', true);
    }

  }
});

function getHUDPosition(distance) {
  let pos = new THREE.Vector3();
  const c = document.querySelector('#camera').object3D;
  c.getWorldPosition(pos);
  let dir = new THREE.Vector3();
  c.getWorldDirection(dir);
  dir.multiplyScalar(distance ? distance : -1);
  pos.add(dir);
  return pos;
}

function drawLine(start, end) {
  const ele = document.createElement('a-entity');
  const sphere = document.createElement('a-sphere');
  sphere.setAttribute("position", vectorString(start));
  ele.setAttribute("line", "start: " + vectorString(start) + ";end: " + vectorString(end));
  document.querySelector('a-scene').appendChild(ele);
}

