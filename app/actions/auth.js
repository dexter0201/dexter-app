const shape = require('shape-errors');
const randToken = require('rand-token');
const bcrypt = require('bcryptjs');
const {isString} = require('lodash');

const authConfig = require('config').auth;
const {cache} = require('app/orm');
const authHash = cache.hash('auth');
const {customErrorShape} = require('app/helper/common');
const {table} = require('app/orm');
const {
    findUserByUsername,
    findUserById,
    getUserProjects
    } = require('./users');

function signup(data) {
    return validateSignupData(data).then((err) => {
        return err ? (
            Promise.reject(err)
        ) : (
            findUserByUsername(data.username).then(async (user) => user ? (
                customErrorShape({username: 'User with this username already exists'})
            ) : (
                table('users').insert({
                    username: data.username,
                    password: await new Promise((resolve) => bcrypt.hash(data.password, 10, (_, hash) => resolve(hash)))
                })
            ))
        );
    });
}

function validateSignupData(data) {
    return shape({
        username: (username) => isString(username) && username.length > 0 ? null : 'Username is invalid',
        password: (password) => isString(password) && password.length >= 6 ?
            null : 'Password is invalid. It should contain min. 6 charcters'
    }).errors(data);
}


function login({username, password}) {
    return findUserByUsername(username).then((user) => user ? (
        bcrypt.compare(password, user.password).then((res) => res ? (
            generateUniqueAuthToken(user).then((token) => ({token, user}))
        ) : (
            Promise.reject(new Error('invalid password'))
        ))
    ) : (
        Promise.reject(new Error('invalid token'))
    )).then(({token, user}) => {
        return getUserProjects(user).then((userProjects) => {
            return authHash.set(token, user.id, authConfig.tokenLifetime).then(() => ({token, user, projects: userProjects}));
        });
    });
}

function check(authKey) {
    return authHash.get(authKey).then((userId) => {
        if (userId === null) {
            return null;
        } else {
            return findUserById(userId);
        }
    });
}

function logout(authKey) {
    return check(authKey).then((user) => {
        if (user === null) {
            return true;
        } else {
            return authHash.del(authKey).then(() => true);
        }
    });
}

function generateUniqueAuthToken(user) {
    const key = randToken.generate(72);

    return authHash.get(key).then((existing) => {
        if (existing === null) {
            return key;
        } else {
            return generateUniqueAuthToken(user);
        }
    });
}

module.exports = {
    login,
    check,
    logout,
    signup
};