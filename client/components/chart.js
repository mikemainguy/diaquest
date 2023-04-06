AFRAME.registerComponent('series', {
    schema: {
        label: {type: 'string', default: ''},
        points: {
            default: null,
            parse: function (value) {
                try {
                    return JSON.parse(value);
                } catch (err) {
                    console.log(err);
                    return {};
                }
            },
            stringify: function (value) {
                JSON.stringify(value);
            }
        },
    },
    toggleLabels: function (evt) {
        for (const e of this.el.querySelectorAll('a-text')) {
            e.setAttribute("visible", !this.visible);
        }
        this.visible = !this.visible;
    },
    update: function () {

        this.points = this.data.points;
        let i = 0;
        for (const pnt of this.points) {
            let ii = 0;
            for (const dp of pnt.data) {
                if (dp.value > 0) {
                    const p = document.createElement('a-entity');
                    const prev = (i == 0) ? 0 : this.points[i - 1].data[ii].value;
                    p.setAttribute('chartpoint', 'time: ' + i + '; value: ' + dp.value + '; index:' + ii + '; scale:'
                        + dp.scale + '; previous:' + prev);
                    this.el.appendChild(p);
                    ii++;
                }


            }


            i++;
        }


        const label = htmlToElement(`
        <a-entity
        position="0 -.2 -.01"
        lookatme
        >
        <a-text
            rotation="0 0 -45"
            value="${this.data.label}"
            visible="false"
            width=".5">
            </a-text>
        </a-entity>
        
        `);
        this.el.appendChild(label);
        const box = htmlToElement(`
                <a-plane height="0.19" width="${this.points.length * .11}" color="#113"
                    rotation="-90 90 0" position="0 0 ${this.points.length / 2 * .11}"
                    text="value: ${this.data.label}; wrapCount: 130; align: center">
                </a-plane>
                
            `);
        this.el.appendChild(box);
        this.el.flushToDOM();

    },
    init: function () {
        this.points = this.data.points;
        this.startTime = 0;
        this.endTime = 0;
        this.visible = false;
        this.toggleLabels = this.toggleLabels.bind(this);
        document.addEventListener('togglelabels', this.toggleLabels);
    },
    events: {
        'time': function (evt) {
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
            parse: function (value) {
                return JSON.parse(value);
            },
            stringify: function (value) {
                JSON.stringify(value);
            }
        },
        max: {type: 'int', default: 10}
    },
    events: {
        'startTime': function (evt) {
            this.startTime = evt.detail.startTime;
        },
        'endTime': function (evt) {
            this.endTime = evt.detail.endTime;
        }
    },
    init: function () {
        let i = 0;

        for (const series in this.data.chartData.series) {
            const sdata = this.data.chartData.series[series];

            const s = htmlToElement(`
            <a-entity
                series='label: ${sdata.label}; points: ${JSON.stringify(sdata.points)}'
                position="${i * .2} 0 0"
                rotation="0 180 0">
            
            </a-entity>
            `);
            this.el.appendChild(s);
            if (i == 0) {
                let ii = 0;
                for (const pnt of sdata.points) {
                    const dt = new Date(pnt.time * 1000);
                    const time = htmlToElement(`
                        <a-text value="${dt.toISOString()}" width="1" height="0.2" position=".75 .1 ${ii * .11}" rotation="-90 180 0"></a-text>
                    `);
                    s.appendChild(time);
                    ii++;
                }


            }
            i++;
        }
        this.el.setAttribute('position', `${i * .2 / -2} 0 0`);
        //this.el.setAttribute('rotation', '0 180 0');
        this.el.flushToDOM();
    }
});
AFRAME.registerComponent('chartpoint', {
    schema: {
        time: {type: 'int', default: 0},
        value: {type: 'float', default: 0},
        index: {type: 'int', default: 0},
        scale: {type: 'float', default: 1},
        previous: {type: 'float', default: 0}
    },
    init: function () {
        const colors = ['#00d', '#c0f', '#d04'];
        const height = this.data.value * this.data.scale;
        const z = this.data.time * .11;
        const box = htmlToElement(`
        <a-triangle
        vertex-a=".00 .00 .00"
        vertex-b="-.01 -.1 .00"
        vertex-c=".01 -.1 .00"
        lookatmexlock
        position="${(this.data.index * 0.05) - .025} ${height - .01} ${z}"
        
        material="color: ${colors[this.data.index]};"
        
        >
        </a-triangleplane>
        `);
        this.el.appendChild(box);
        this.point = box;
        const label = htmlToElement(`
        <a-text value="${this.data.value}"
            position="${(this.data.index * 0.05) - .025} ${height + .001}  ${z}" 
            rotation="0 0 -45"
            lookatme
            visible="false"
            width="1"
            color="${colors[this.data.index]}"
            height=".25"
            baseline="bottom"
            wrapCount="5"
            align="center"
            ></a-text>
        `);
        if (this.data.time > 0) {
            const prevheight = this.data.previous * this.data.scale;
            const prevz = (this.data.time - 1) * .11;

            const line = htmlToElement(`
            <a-entity line="color: ${colors[this.data.index]}; start: ${(this.data.index * 0.05) - .025} ${height}  ${z}; end: ${(this.data.index * 0.05) - .025} ${prevheight} ${prevz}"
            </a-entity>
            
        `);
            this.el.appendChild(line);
        }
        this.el.appendChild(label);
        this.el.parentEl.emit('time', {time: this.data.time});
    }
});
AFRAME.registerComponent('chartinteraction', {
    init: function () {

    },
    events: {
        bbuttondown: function (evt) {
            document.dispatchEvent(new CustomEvent('togglelabels', {detail: 'OK'}));
        }
    }
});

function htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

AFRAME.registerComponent('lookatmexlock', {
    init: function () {
        this.tick = AFRAME.utils.throttleTick(this.tick, 2000, this);
        const cam = document.getElementById('camera');
        if (cam) {
            this.pos = new THREE.Vector3();
            this.camera = document.getElementById('camera').object3D;
            this.mypos = new THREE.Vector3();
        }
    },
    update: function () {
        this.el.object3D.getWorldPosition(this.mypos);
    },
    tick: function () {
        if (this.camera) {
            this.camera.getWorldPosition(this.pos);
            this.mypos.setX(this.pos.x);
            this.mypos.setZ(this.pos.z);
            this.el.object3D.lookAt(this.mypos);
        }
    }
});