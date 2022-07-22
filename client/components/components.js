AFRAME.registerComponent('user', {
  schema: {
    //keyboard: {default: '#keyboard', type: 'selector'}
  },
  init: function () {
    fetch('/api/user/profile')
      .then((res)=> res.json())
      .then((data) => {
          console.log(data);
          this.el.setAttribute('text','value: ' + data.email);
      });

  },
  tick: function () {

  }
});



