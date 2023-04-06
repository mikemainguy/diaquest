export function debug(value) {
    const debug = document.getElementById("debug");
    let data = [];
    if (debug) {
        let lines = debug.getAttribute('text').value;
        if (lines) {
            data = lines.split('\n').slice(-20);
            data.push(value);
        }
        debug.setAttribute('text', 'value', data.join('\n'));
        console.log(value);
    }
}