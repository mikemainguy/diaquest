function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('../client/jslibs/', true, /\.js$/));
requireAll(require.context('../client/components/', true, /\.js$/));