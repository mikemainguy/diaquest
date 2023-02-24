import {debug} from './debug';
import {changeRaycaster, createUUID} from './util';

AFRAME.registerSystem('buttons', {
    init: function () {
        this.first = null;
        this.mode = [];
        this.color = '#399';
        this.image = null;
        this.template = null;
        this.buttonstate = this.buttonstate.bind(this);
        this.hideMenu = hideMenu.bind(this);
        this.showMenu = showMenu.bind(this);
        this.pointers = [];
        this.el.addEventListener('buttonstate', this.buttonstate);
        this.el.addEventListener('hideMenu', this.hideMenu);
        this.el.addEventListener('showMenu', this.showMenu);
        document.addEventListener('export', function () {
            console.log('starting');
            const exporter = new THREE.GLTFExporter();
            const nodes = Array.from(document.querySelectorAll('[stuff]').values());
            const nodeMap = nodes.map(x => x.object3D);
// Parse the input and generate the glTF output
            exporter.parse(
                nodeMap,
                // called when the gltf has been generated
                function (gltf) {
                    console.log(gltf);
                    //let myJson = gltf
                    let element = document.createElement('a');
                    element.setAttribute('href',
                        URL.createObjectURL(new Blob([gltf],
                            {type: 'model/gltf-binary'})));
                    element.setAttribute('download', 'model.glb');
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                },
                function (err) {
                    console.log('error ' + err);
                },

                {
                    "binary": true,
                    forcePowerOfTwoTextures: true,
                    onlyVisible: true,
                    embedImages: true,
                    forceIndices: true
                }
            );

        });
    },
    buttonstate: function (evt) {
        this.template = evt.detail.template ? evt.detail.template : null;
        this.mode = evt.detail.mode;
        this.image = evt.detail.image;
        this.id = evt.detail.id ? evt.detail.id : null;
        this.first = evt.detail.first ? evt.detail.first : null;
        this.color = evt.detail.color ? evt.detail.color : this.color;
    }
});

AFRAME.registerComponent('buttons', {
    init: function () {
        this.mode = [];
        this.second = null;
        this.template = null;
        this.color = '#399';
        this.image = '';
        const pointer = document.createElement('a-sphere');
        pointer.setAttribute('material', 'color: #fff; opacity: 0.8; emissive: #fff');
        pointer.setAttribute('radius', '0.004');
        pointer.setAttribute('visible', 'false');
        this.el.appendChild(pointer);
        this.pointer = pointer;
        this.system.pointers.push(pointer);
    },
    update: function () {

    },
    tock: function () {
        if (!this.raycaster) {
            const ray = this.el.components['raycaster'];
            if (ray) {
                this.raycaster = ray;
                this.pointer.setAttribute('position', this.raycaster.lineData.end);
            }
        } else {
            this.pointer.object3D.position.copy(this.raycaster.lineData.end);
        }
    },
    events: {
        thumbstickdown: function (evt) {
            const rays = getRaycasters();
            for (const caster of rays) {
                caster.setAttribute('raycaster', 'far',
                    caster.getAttribute('raycaster').far == 10 ? .1 : 20);
            }
        },
        xbuttondown: function (evt) {
            const debug = document.querySelector('#debug');
            if (debug.getAttribute('visible')) {
                debug.setAttribute('visible', false);
            } else {
                debug.setAttribute('visible', true);
            }

        },
        abuttondown: function (evt) {
            const amenu = document.getElementById('animationmenu');
            if (amenu) {
                const aMenuShowing = amenu.getAttribute('visible');
                if (aMenuShowing) {
                    hideMenu({detail: {id: '#animationmenu'}});
                } else {
                    showMenu({detail: {id: '#animationmenu', objects: '#animationmenu [widget], .saveable'}});
                }
            }

        },
        abuttonup: function (evt) {

        },
        bbuttontouchstart: function (evt) {

        },
        bbuttontouchend: function (evt) {

        },
        triggertouchstart: function (evt) {
            this.pointer.setAttribute('visible', 'true');
        },
        triggertouchend: function (evt) {
            this.pointer.setAttribute('visible', 'false');
        },
        bbuttondown: function (evt) {
            const bmenu = document.getElementById('bmenu');
            if (bmenu) {
                const bMenuShowing = document.getElementById('bmenu').getAttribute('visible');
                if (bMenuShowing) {
                    hideMenu({detail: {id: '#bmenu'}});
                } else {
                    showMenu({detail: {id: '#bmenu', objects: '#bmenu [widget], .saveable'}});
                }
            }

        },
        ybuttondown: function (evt) {
            const yMenuShowing = document.getElementById('ymenu').getAttribute('visible');
            if (yMenuShowing) {
                hideMenu({detail: {id: '#ymenu'}});
            } else {
                showMenu({detail: {id: '#ymenu', objects: '#ymenu a-plane[mixin=menuPlane], .saveable'}});
            }
        },
        triggerdown: function (evt) {
            if (evt.target.states.includes('cursor-hovering')) {
                return;
            }
            const data = {};
            const v = this.pointer.object3D.position.clone();
            this.el.object3D.localToWorld(v);
            data.position = v;

            switch (this.system.mode.slice(-1)[0]) {
                case 'copying':
                    data.id = createUUID();
                    const ele = document.getElementById(this.system.first);
                    data.template = ele.getAttribute('template').src;
                    const stuffData = ele.components['stuff'].data;
                    data.text = stuffData.text;
                    data.image = stuffData.image;
                    data.color = stuffData.color;
                    data.scale = stuffData.scale;
                    document.dispatchEvent(
                        new CustomEvent('shareUpdate',
                            {detail: data}));
                    break;
                case 'adding':
                    this.system.first = null;
                    data.id = createUUID();
                    data.template = this.system.template;
                    data.color = this.system.color;
                    document.dispatchEvent(
                        new CustomEvent('shareUpdate',
                            {detail: data}));
                    break;
            }
            debug(this.system.mode);
        },
    },
});

function showMenu(evt) {
    changeMenu(evt.detail.id, true, evt.detail.objects);
}


function hideMenu(evt) {
    let objs = '.saveable'
    if (!evt.id || evt.id != '#bmenu') {
        const bmenu = document.getElementById('bmenu')

        if (bmenu && bmenu.object3D.visible) {
            objs += ', #bmenu [widget]'
        }
    }
    changeMenu(evt.detail.id, false, objs);
}

function changeMenu(id, visible, objects) {
    const el = document.querySelector(id);
    if (el) {
        el.setAttribute('visible', visible);
    }
    changeRaycaster(objects);
}

function getRaycasters() {
    return document.querySelectorAll('[raycaster]');
}

