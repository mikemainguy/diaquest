const dirTree = require("directory-tree");
const fs= require('fs');
const {v4: uuidv4} = require('uuid');

function createUUID() {
    return uuidv4();
}



const tree= dirTree('.', {exclude: /node_modules|[\.].+/, attributes: ['type'], depth: 3});
const nodes = {};
;

function buildShape(node, x, y, z) {
    const template = node.type==='directory'?'#sphere-template':'#box-template';
    const color = node.type==='directory'?'#0ff':'#ccc';
    return {
        'text': node.name,
        'id': 'id' + createUUID(),
        'template': template,
        'scale': '.1 .1 .1',
        'color': color,
        'position': {'x': x, 'y': y, 'z': z}
    }
}
function buildConnector(node, first, second) {
    return {
        'id': 'idc' + createUUID(),
        'template': '#connector-template',
        'color': '#f00',
        'first': first,
        'second': second
    }

}
const base = buildShape(tree, 0, 10, 0);
nodes[base.id] = base;

if (tree.children) {
    let x =1;
    for (const c in tree.children) {
        const me = buildShape(c, x++, 9, 0);
        nodes[me.id] = me;
        if (c.children) {
            let z = 1;
            for (const c2 in c.children) {
                const me2 = buildShape(c2, x, 8, z++);
                nodes[me2.id] = me2;
            }
        }
    }
}




fs.writeFileSync('data.json', JSON.stringify(nodes, null, 2));