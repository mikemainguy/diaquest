exports.id = 'api';
const glob = require('glob');
const {requiresAuth} = require('express-openid-connect');
const wire = async (app) => {
    const options = {cwd: __dirname };
    glob("**/*.js", options, function(er, files) {
       for (const f of files){
           if (f != 'index.js') {
               const api = require('./' + f);
               app.all('/api/' + f.replace('.js', ''),
                   requiresAuth(),
                   api
                   )
               console.log(f);
           }
       }

    });
}
module.exports = wire;
