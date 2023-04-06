import {debug} from './debug';

AFRAME.registerSystem('language', {
    init: function () {
        this.createRule = /(create|make|add) .*(box|sphere|cylinder|connector).*/;
        this.entityMap = new Map();
        document.addEventListener('languageCommand', this.parseInput.bind(this));
        this.entityMap.set('box', {template: '#box-template'});
        this.entityMap.set('sphere', {template: '#sphere-template'});
        this.entityMap.set('cylinder', {template: '#cylinder-template'});
    },
    parseInput: function (evt) {
        const match = this.createRule.exec(evt.detail);
        if (match && match.length == 3) {
            const entity = this.entityMap.get(match[2]);
            if (!entity) return;
            const obj = Object.assign(entity)
            obj.mode = ['adding'];
            debug(JSON.stringify(entity))
            debug(JSON.stringify(entity))
            this.el.sceneEl.emit('buttonstate', obj);
        }
    }


});



