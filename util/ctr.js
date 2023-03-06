const ctrhome = 'https://www.canadiantire.ca/en.html';
const jsdom = require("jsdom");
const axios = require("axios");
const { JSDOM } = jsdom;
(async() => {
    const response = await axios.get(ctrhome);
    const dom = new JSDOM(response.data);
    const categories = JSON.parse([...dom.window.document.querySelectorAll('span[data-component="SecondaryNavigation"]')][0].getAttribute('data-props'));
    console.log(categories);
})();