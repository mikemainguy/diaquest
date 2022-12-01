import {changeRaycaster} from "../util";
import {debug} from '../debug';

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('3d-keyboard', {
    keys: [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '<-'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
        [' ']

    ],
    schema: {
        value: {type: 'string'},
        visible: {type: 'boolean', default: false},
        scale: {type: 'string', default: '.08 .08 1'},
        elId: {type: 'string'}

    },
    events: {
        transcriptiondata: function (evt) {
            debug(JSON.stringify(evt.detail, null, 2));
            if (evt.detail.data.message_type == "PartialTranscript") {
                //what do I do with "FinalTranscript"
                this.data.value = evt.detail.data.text;
                this.label.setAttribute('text', 'value', this.data.value);
            }
        }
    },
    init: function () {
        this.el.addEventListener('show', this.show.bind(this));
        this.el.addEventListener('mousedown', this.click.bind(this));
        this.el.addEventListener('mouseenter', this.hover.bind(this));
        this.el.addEventListener('mouseleave', this.blur.bind(this));

        this.keyboard = document.createElement('a-entity');
        this.keyboard.setAttribute('visible', this.data.visible);
        this.keyboard.setAttribute('sound', 'src: #keyin; volume: 0.3; on: mouseenter; poolSize: 5');
        this.el.setAttribute('sound', 'src: #keydown; volume: 0.8; on: mousedown; poolSize: 5');
        this.el.appendChild(this.keyboard);
        this.keyboard.setAttribute('scale', this.data.scale);
        let y = 1.5;
        for (const row of this.keys) {
            let x = -7;
            for (const key of row) {
                const k = document.createElement('a-plane');
                this.keyboard.appendChild(k);
                k.classList.add('keyboardRaycastable');
                k.setAttribute('key', key);
                switch (key) {
                    case 'Enter':
                        k.setAttribute('width', '1.95');
                        k.setAttribute('text', 'wrapCount', '6');
                        x += 1.5;
                        k.setAttribute('position', x + ' ' + y + ' .001');
                        break;
                    case ' ':
                        k.setAttribute('width', '6');
                        k.setAttribute('text', 'wrapCount', '6');
                        x += 5;
                        k.setAttribute('position', x + ' ' + y + ' .001');
                        break;
                    default:
                        k.setAttribute('width', '.95');
                        k.setAttribute('text', 'wrapCount', '2');
                        x += 1;
                        k.setAttribute('position', x + ' ' + y + ' .001');
                }

                k.setAttribute('height', '.95');
                k.setAttribute('text', 'value', key);
                k.setAttribute('text', 'align', 'center');
                k.setAttribute('material', 'color', '#222');
            }
            y -= 1;
        }
        const back = document.createElement('a-plane');


        back.setAttribute('material', 'color', '#444');
        back.setAttribute('position', '0 0 0');
        back.setAttribute('width', '13.1');
        back.setAttribute('height', '4.1');


        this.keyboard.appendChild(back);

        this.label = document.createElement('a-plane');

        this.keyboard.appendChild(this.label);
        this.label.setAttribute('material', 'color', '#555');
        this.label.setAttribute('position', '0 3 .001');
        this.label.setAttribute('width', '13.1');
        this.label.setAttribute('text', 'wrapCount', '40');
        this.label.setAttribute('text', 'value', this.data.value);
        this.label.setAttribute('height', '1');
        this.label.setAttribute('height', '1');


    },

    update: function (oldData) {
    },
    tick: function (time) {


    },

    play: function () {

    },

    pause: function () {

    },

    /**
     * The plane for visual feedback when a key is hovered or clicked
     */

    click: function (ev) {
        const k = ev.target.getAttribute('key');
        if (k) {
            switch (k) {
                case 'Enter':
                    this.el.emit('superkeyboardinput', {value: this.data.value, elId: this.data.elId});
                    this.close();
                    break;
                case '<-':
                    if (this.data.value.length > 0) {
                        this.data.value = this.data.value.slice(0, this.data.value.length - 1);
                    }
                    break;
                default:
                    this.data.value = this.data.value + k;
            }
            this.label.setAttribute('text', 'value', this.data.value);
        }
    },

    show: function (evt) {
        if (evt.detail.value) {
            this.data.value = evt.detail.value;
        }
        if (evt.detail.elId) {
            this.data.elId = evt.detail.elId;
        }
        this.label.setAttribute('text', 'value', this.data.value);
        const cam = document.querySelector('#camera').object3D;

        //const keyboard = this.el.object3D;
        const pos = new THREE.Vector3();
        pos.copy(cam.position);
        const rig = document.querySelector('.rig').object3D;
        //rig.worldToLocal(pos);
        this.el.object3D.position.set(pos.x, pos.y - .2, pos.z - .5);

        changeRaycaster('.keyboardRaycastable,[transcription]');
        this.keyboard.setAttribute('visible', 'true');
        this.el.querySelector('a-sphere').setAttribute('visible', true);
    },

    close: function () {
        this.keyboard.setAttribute('visible', 'false');
        this.el.querySelector('a-sphere').setAttribute('visible', false);

    },
    hover: function (ev) {
        ev.target.setAttribute('material', 'color', '#dd0');
    },
    blur: function (ev) {
        ev.target.setAttribute('material', 'color', '#222');
    }


});