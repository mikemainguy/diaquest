const env = require('./env');
const pageHandler = async (req, res) => {
    let user = false;
    let admin = false;

    if (req.oidc && req.oidc.isAuthenticated()) {
        user = req.oidc.user.email;
        const roles = req.oidc.user.immersiveRoles;
        if (roles && roles.includes('admin')) {
            admin = true;
        }
    }

    res.render('pages/' + req.params['page'], {
        html: true, version: env.VERSION, page: req.params['page'], nonVr: true,
        user: user, admin: admin
    });
}
module.exports = {pageHandler: pageHandler}