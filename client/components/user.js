AFRAME.registerComponent('user', {
  init: function () {
    if (!VRLOCAL) {
      fetch('/api/user/profile')
          .then((res)=> res.json())
          .then((data) => {
            this.el.setAttribute('text','value: ' + data.user.email);
          });
    } else {
      this.el.setAttribute('text', 'value: Local User');
    }
  },
    events: {
      'enter-vr': function() {
          this.el.setAttribute('visible', true);
      }
    }
});








