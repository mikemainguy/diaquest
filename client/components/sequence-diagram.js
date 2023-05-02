import {htmlToElement} from "./util";

AFRAME.registerComponent('sequencediagram', {
    schema: {
        messages: {
            default: '[]',
            parse: function (value) {
                return JSON.parse(value);
            },
            stringify: function (value) {
                return JSON.stringify(value);
            }
        },
        swimlanes: {
            default: '[]',
            parse: function (value) {
                return JSON.parse(value);
            },
            stringify: function (value) {
                return JSON.stringify(value);
            }
        },
        label: {type: 'string', default: 'sequencediagram'}
    },
    init: function() {
        console.log('#$#$$#$#$');
        this.childAttached = this.childAttached.bind(this);
        this.el.addEventListener('child-attached', this.childAttached);
        this.box = htmlToElement(`
            <a-box position="0 0 0" width="5" height=".1" depth="5"></a-box>
        `);
        this.button = htmlToElement(`
            <a-box class="addSwimlane" color="#f00" position="2 1.1 2.45" width="1" height="1" depth=".1"></a-box>
        `);
        this.el.appendChild(this.button);
        this.el.appendChild(this.box);

        if (this.el.querySelectorAll('[sequenceswimlane]')) {
            this.el.querySelectorAll('[sequenceswimlane]').forEach((el)=> {
                this.childAttached(el);
            })
        }
        if (this.el.querySelectorAll('[sequencemessage]')) {
            this.el.querySelectorAll('[sequencemessage]').forEach((el)=> {
                this.childAttached(el);
            })
        }
        this.addSwimlane = this.addSwimlane.bind(this);
        this.el.setAttribute('clickable', true);

    },
    update: function() {
        this.messages = this.data.messages;
        this.swimlanes = this.data.swimlanes;
        this.label = this.data.label;
    },
    addSwimlane: function(data) {
        console.log('addSwimlane ' + data.detail.innerHTML);
    },
    childAttached: function(child) {
      console.log('childAttached  ' + child.innerHTML);
    },
    events: {
        click: function(evt) {
            console.log('click');
        }
    }
});
AFRAME.registerComponent('sequenceswimlane', {
   init: function() {
       this.el.setAttribute('clickable', true);
       this.box = htmlToElement(`
        <a-box width="1" height="1" depth="1" color="#f33">
       </a-box>
       `);
       console.log('###########here');
       this.label =htmlToElement(`
       <a-plane width="1" height=".1" position="0 0 .501">
       </a-plane>
       `);

       this.el.appendChild(this.box);
       this.el.appendChild(this.label);

   },
    update: function() {

    },
    events: {
       click: function(evt) {
           console.log('click');
       }
    }
});
AFRAME.registerComponent('sequencemessage', {
    init: function() {
        this.message = htmlToElement(`
        <a-cylinder radius=".2" color="#9cc">
        </a-cylinder>
        `);
        this.el.appendChild(this.message);
    },

});