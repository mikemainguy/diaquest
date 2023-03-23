function parseUrl() {
    return window.location.pathname.split('/');
}
const getEntityPath = function  (id) {
    return buildPath('entities', id);
}
function getSessionPath(id) {
    return buildPath('sessions', id);
}
function getAnimationPath(id) {
    return buildPath('animations', id);
}
function getMediaPath() {
    return buildPath('media', null);
}
const buildPath = function(name, id) {
    const loc = parseUrl();
    const pathId = id == null ? '' : '/' + id;
    if (loc.length < 3) {
        return `worlds/public/${name}${pathId}`;
    }
    switch (loc[1]) {
        case 'public':
            return `worlds/public/${name}${pathId}`;
        case 'worlds':
            if (loc.length === 3) {
                const myLoc = decodeURIComponent(window.location).split('/').pop()
                return `worlds/${myLoc}/${name}${pathId}`;
            } else {
                return `worlds/public/${name}${pathId}`;
            }
        default:
            return `worlds/public/${name}${pathId}`;
    }

}
module.exports = {buildPath: buildPath,
    getEntityPath: getEntityPath,
    getSessionPath: getSessionPath,
    getAnimationPath: getAnimationPath,
    getMediaPath: getMediaPath};