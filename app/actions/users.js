const isUuid = require('is-uuid').v4;
const shape = require('shape-errors');
const {isString} = require('lodash');
const bcrypt = require('bcryptjs');

const {table} = require('app/orm');

function findUserByUsername(username) {
    return table('users').find({username});
}

function findUserById(id) {
    return isUuid(id) ? table('users').find(id) : null;
}

function getUserTasks(user) {
    return table('users').where({id: user.id}).eagerLoad('tasks').first().then((user) => {
        return user.tasks;
    });
}

function getUserProjects(user) {
    return table('users').where({id: user.id}).eagerLoad('projects').first().then((user) => {
        return user.projects;
    });
}

function isUserProjectAdmin(userId, projectId) {
    return table('user_projects').find({user_id: userId, project_id: projectId}).then((userProject) => {
        return userProject.role === 'admin';
    });
}

function validateChangePassData(data, user) {
    bcrypt.compare(data.old_password, user.password).then((res) => console.log(res));
    return shape({
        old_password: (old_password) => isString(old_password) ? (
            bcrypt.compare(old_password, user.password).then((res) => res ? null : 'Old password is wrong.')
        ) : 'Old password is wrong.',
        new_password: (new_password) => isString(new_password) && new_password.length >= 6 ? null : 'New Password is invalid. It should contain min. 6 charcters.'
    }).errors(data);
}

function changePassword(data, user) {
    return validateChangePassData(data, user).then(async (err) => {
        return err ? (
            Promise.reject(err)
        ) : (
            table('users').update(user.id, {
                password: await new Promise((resolve) => bcrypt.hash(data.new_password, 10, (_, hash) => resolve(hash)))
            })
        );
    });
}

module.exports = {
    findUserByUsername,
    findUserById,
    getUserTasks,
    getUserProjects,
    isUserProjectAdmin,
    changePassword
};