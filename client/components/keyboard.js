AFRAME.registerSystem('key-listen', {
    init: function () {
        this.text = '';
        this.id = null;
        document.addEventListener('superkeyboardinput', this.superkeyboardinput.bind(this));
    },
    superkeyboardinput: function (event) {
        const data = {text: event.detail.value, id: event.detail.elId};
        document.getElementById(data.id).setAttribute('stuff', 'text', data.text);
        document.dispatchEvent(new CustomEvent('shareUpdate', {detail: data}));
        document.getElementById('keyboard').setAttribute('3d-keyboard', 'value', '');
        this.el.emit('hideMenu', {});
    }
});

