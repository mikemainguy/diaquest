AFRAME.registerComponent('series', {
    schema: {
        label: {type: 'string', default: ''},
        points: {
            default: null,
            parse: function(value){
                try {
                    const c = JSON.parse( value);
                    return c;
                } catch (err) {
                    console.log(err);
                    return {};
                }
            },
            stringify: function(value) {
                JSON.stringify(value);
            }
        },
    },
    update: function() {

        this.points = this.data.points;
        let i = 0;
        for (const pnt of this.points) {
            let ii=0;
            for (const dp of pnt.data) {
                const p = document.createElement('a-entity');
                p.setAttribute('chartpoint', 'time: ' + i + '; value: ' + dp.value + '; index:' + ii );
                this.el.appendChild(p);
                ii++
            }
            i++;
        }
        const label = htmlToElement(`
        <a-text
            position="0 1 0"
            value="${this.data.label}"
            lookatme
            width="1">
            </a-text>
        `);
        this.el.appendChild(label);
        const box = htmlToElement(`
                <a-box height=".05" width="0.5" depth="${this.points.length}"
                    color="#66d" position="0 -.1 ${this.points.length/2}">
                </a-box>
            `);
        this.el.appendChild(box);
        this.el.flushToDOM();

    },
    init: function() {
        this.points = this.data.points;
        this.startTime = 0;
        this.endTime = 0;
    },
    events: {
        'time': function(evt) {
            if (evt.detail.time > this.endTime) {
                this.endTime = evt.detail.time;
                this.el.parentEl.emit('endTime', this.endTime);
            }
            if (this.startTime == 0 || this.startTime > evt.detail.time) {
                this.startTime = evt.detail.time;
                this.el.parentEl.emit('startTime', this.startTime);
            }
        }
    }
});
AFRAME.registerComponent('chart', {
   schema: {
       chartData: {
           default: null,
           parse: function(value){
               return JSON.parse(value);
           },
           stringify: function(value) {
               JSON.stringify(value);
           }
       },
       max: {type: 'int', default: 10}
   },
    events: {
       'startTime': function(evt) {
           this.startTime = evt.detail.startTime;
       },
        'endTime': function(evt) {
           this.endTime = evt.detail.endTime;
        }
    },
    init: function() {
       let i = 0;
        for (const series in this.data.chartData.series) {
            const sdata = this.data.chartData.series[series];

            const s = htmlToElement(`
            <a-entity
                series='label: ${sdata.label}; points: ${JSON.stringify(sdata.points)}'
                position="${i} 0 0">
            
            </a-entity>
            `);
            this.el.appendChild(s);

            i++;
        }
        this.el.flushToDOM();
    }
});
AFRAME.registerComponent('chartpoint', {
    schema: {
        time: {type: 'int', default: 0},
        value: {type: 'float', default: 0},
        index: {type: 'int', default: 0}
    },
    init: function () {
        const box = htmlToElement(`
        <a-box width="0.1" depth="0.1" height="${this.data.value}"
        position="${this.data.index * 0.1} ${this.data.value/2} ${this.data.time}"
        color="#00d">
        </a-box>
        `);
        this.el.appendChild(box);
        this.point = box;
        const label = htmlToElement(`
        <a-text value="${this.data.value}"
            position="0 ${this.data.value+.25}  ${this.data.time}"
            lookatme
            width="1"
            height=".25"
            baseline="bottom"
            wrapCount="10"
            align="center"
            ></a-text>
        `);
        this.el.appendChild(label);
        this.el.parentEl.emit('time', {time: this.data.time});
    }
});
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}