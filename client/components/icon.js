const files = ['apps-512x512-1617663.png',
    'apps-512x512-1617714.png',
    'attach-512x512-1617713.png',
    'attention-512x512-1617712.png',
    'bar-graph-512x512-1617671.png',
    'bar-graph-512x512-1617672.png',
    'basket-512x512-1617711.png',
    'blank-512x512-1617710.png',
    'calendar-512x512-1617709.png',
    'card-512x512-1617708.png',
    'check-512x512-1617706.png',
    'close-512x512-1617704.png',
    'close-512x512-1617705.png',
    'closed-512x512-1617703.png',
    'cloud-upload-512x512-1617655.png',
    'delete-512x512-1617702.png',
    'doc-512x512-1617701.png',
    'down-512x512-1617700.png',
    'download-512x512-1617699.png',
    'edit-512x512-1617698.png',
    'exit-512x512-1617697.png',
    'filter-512x512-1617695.png',
    'filter-512x512-1617696.png',
    'graph-512x512-1617665.png',
    'grid-512x512-1617694.png',
    'home-512x512-1617693.png',
    'left-512x512-1617692.png',
    'link-512x512-1617691.png',
    'location-512x512-1617690.png',
    'love-512x512-1617689.png',
    'mail-512x512-1617688.png',
    'menu-512x512-1617684.png',
    'menu-512x512-1617685.png',
    'menu-512x512-1617686.png',
    'menu-512x512-1617687.png',
    'minus-512x512-1617682.png',
    'minus-512x512-1617683.png',
    'money-512x512-1617681.png',
    'notification-512x512-1617680.png',
    'pause-512x512-1617679.png',
    'phone-512x512-1617678.png',
    'play-512x512-1617677.png',
    'plus-512x512-1617675.png',
    'plus-512x512-1617676.png',
    'printer-512x512-1617674.png',
    'question-512x512-1617673.png',
    'record-512x512-1617670.png',
    'reload-512x512-1617669.png',
    'right-arrow-512x512-1617668.png',
    'save-512x512-1617667.png',
    'schedule-512x512-1617666.png',
    'search-512x512-1617664.png',
    'settings-512x512-1617662.png',
    'share-512x512-1617661.png',
    'sorting-512x512-1617660.png',
    'star-512x512-1617659.png',
    'time-512x512-1617658.png',
    'up-arrow-512x512-1617656.png',
    'up-down-arrow-512x512-1617657.png',
    'user-512x512-1617653.png',
    'user-512x512-1617654.png',
    'view-512x512-1617652.png',
    'wallet-512x512-1617707.png',
    'world-512x512-1617651.png'];

const extendDeep = AFRAME.utils.extendDeep;
const meshMixin = AFRAME.primitives.getMeshMixin();

AFRAME.registerComponent('icon', {
   init: function() {
       this.icons = files;
   },
    update: function() {
       if (this.data.name) {
           const result = this.icons.find(element => element.indexOf(this.data.name)>-1);
           this.el.setAttribute('material', 'src', `/assets/icons/${result}`);

       }
    },
    schema: {
       name: {type: 'string'}
    }
});
AFRAME.registerPrimitive('a-icon', extendDeep({}, meshMixin, {
    defaultComponents: {
        geometry: {primitive: 'plane'},
        material: {transparent: true},
        icon: {}
    },
    mappings: {
        name: 'icon.name',
        width: 'geometry.width',
        height: 'geometry.height'
    }
}));

