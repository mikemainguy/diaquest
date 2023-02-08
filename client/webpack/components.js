function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('../jslibs/', true, /\.js$/));
requireAll(require.context('../components/', true, /\.js$/));