import {changeRaycaster} from "./util";

AFRAME.registerSystem('menumanager', {
    init: function () {
        this.hideMenu = this.hideMenu.bind(this);
        this.showMenu = this.showMenu.bind(this);

        this.el.addEventListener('hideMenu', this.hideMenu);
        this.el.addEventListener('showMenu', this.showMenu);

    },
    showMenu: function (evt) {
        this.changeMenu(evt.detail.id, true, evt.detail.objects);
    },
    hideMenu: function (evt) {
        let objs = '.saveable, [widget]'
        this.changeMenu(evt.detail.id, false, objs);
    },
    changeMenu: function (id, visible, objects) {
        const el = document.querySelector(id);
        if (el) {
            el.setAttribute('visible', visible);
        }
        changeRaycaster(objects);
    }
});