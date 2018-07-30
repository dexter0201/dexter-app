const app = module.exports = require('express')();

const {omit} = require('lodash');

const {loggedIn, loggedOut} = require('app/auth');

const {login, logout, refresh, forgetPassword, signup} = require('app/actions').auth;

app.post('/signup', (req, res) => {
    signup(req.body)
        .then((user) => res.send({
            user: omit(user, 'password')
        }))
        .catch((err) => {
            res.status(400).send({msg: 'Signup failed', err});
        })
    ;
});


app.post('/login', loggedOut, (req, res) => {
    login(req.body)
        .then(({token, user, projects}) => res.send({
            token,
            user: omit(user, 'password'),
            projects
        }))
        .catch(() => {
            res.status(400).send({err: 'login failed'});
        })
    ;
});

app.get('/logout', loggedIn, (req, res) => {
    logout(req.authKey).then(() => res.send({msg: 'logged out'}));
});
