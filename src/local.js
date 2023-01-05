function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('../client/localdb/', true, /\.js$/));