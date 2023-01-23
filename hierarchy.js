const uuid = require('uuid')
const {generateUUID} = require("super-three/src/math/MathUtils");


function buildShape(node, x, y, z) {
    return {
        'text': node.name,
        'id': 'id' + generateUUID(),
        'template': node.template,
        'scale': '.1 .1 .1',
        'color': node.color,
        'position': {'x': x, 'y': y, 'z': z}
    }
}
function getId() {
    return generateUUID();
}
function buildConnector(first, second) {
    return {
        'id': 'id' + generateUUID(),
        'template': '#connector-template',
        'first': first,
        'second': second
    }
}