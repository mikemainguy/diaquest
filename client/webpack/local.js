function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('../localdb/', true, /\.js$/));