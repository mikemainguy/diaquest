function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('../client/firebase/', true, /\.js$/));