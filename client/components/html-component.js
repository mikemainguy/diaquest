import domtoimage from "dom-to-image";

AFRAME.registerComponent('html-component', {
    schema: {
        html: {type: 'string'},
        width: {type: 'number', default: .2},
        height: {type: 'number', default: .05},
        density: {type: 'int', default: 1024},
        style: {type: 'string', default: 'text-align: center; font-family: Verdana, Arial, Sans-serif; background-color: #fff'}
    }, init: function () {

    }, update: function () {
        this.buildImage();
    }, buildImage: function () {
        if (this.data.html) {
            const html = this.htmlToElement(this.data.html);
            const width= this.data.width * this.data.density;
            const height = this.data.height * this.data.density;
            domtoimage.toPng(html, {width: width, height: height}).then((url) => {
                const img = new Image();
                img.src = url;
                const id = 'img' + Date.now().valueOf();
                img.setAttribute('id', id);
                const assets = document.querySelector('a-assets');
                assets.append(img);
                this.image = id;
                let plane = this.el.querySelector('.labelPlane');
                if (plane) {

                } else {
                    plane = document.createElement('a-entity');
                    plane.setAttribute('layer', 'width', this.data.width);
                    plane.setAttribute('layer', 'height',this.data.height);
                    plane.classList.add('labelPlane');
                    //plane.setAttribute('layer', 'type', 'quad');


                    this.el.appendChild(plane);
                }
                plane.setAttribute('layer', 'src', '#' + this.image);
            }).catch(function (error) {

            });
        }
    },
    htmlToElement: function htmlToElement(html) {
        const template = document.createElement('div');
        template.setAttribute('style', this.data.style);
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template;
    }
});