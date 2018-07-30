const config = require('config');
const {auth} = require('app/actions');

function loggedIn(req, res, next) {
    const authKey = getAuthKeyFromRequest(req);
    auth.check(authKey)
        .then((user) => {
            if (user) {
                req.user = user;
                req.authKey = authKey;
                next();
            } else {
                res.status(401).send({msg: 'unauthorized'});
            }
        })
    ;
}

function loggedOut(req, res, next) {
    const authKey = getAuthKeyFromRequest(req);

    auth.check(authKey)
        .then((user) => {
            if (user) {
                res.status(400).send({msg: 'already logged in'});
            } else {
                next();
            }
        })
    ;
}

function getAuthKeyFromRequest(req) {
    return req.header(config.headers.authToken);
}

module.exports = {
    loggedIn,
    loggedOut
};
