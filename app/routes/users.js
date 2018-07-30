const app = module.exports = require('express')();

const {loggedIn} = require('app/auth');
const {changePassword} = require('app/actions').users;

app.patch('/change-password', loggedIn, (req, res) => {
    changePassword(req.body, req.user)
        .then(() => res.send({msg: 'Password changed'}))
        .catch((err) => {
            res.status(400).send({msg: 'Change password failed', err});
        })
    ;
});
