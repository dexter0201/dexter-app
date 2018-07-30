const shape = require('shape-errors');
const isUuid = require('is-uuid').v4;
const {isString, map, filter, merge} = require('lodash');

const {table} = require('app/orm');
const {isUserProjectAdmin} = require('./users');
const {customErrorShape} = require('app/helper/common');

function getProjects(user) {
    return table('user_projects').where({user_id: user.id}).eagerLoad('projects').all();
}

function getProjectById(id) {
    return isUuid(id) ? table('projects').find(id) : null;
}

function projectIdMiddlerware(req, res, next) {
    getProjectById(req.params.projectId).then((project) => {
        if(project) {
            req.project = project;
            next();
        } else {
            res.stats(401).send({msg: 'Project Id is not valid'});
        }
    });
}

function createProject(data={}, user) {
    return validateProject(data).then((err) => {
        return err ? (
            Promise.reject(err)
        ) : (
            table('projects').insert(data).then((project) => {
                return table('user_projects').insert({
                    user_id: user.id,
                    project_id: project.id,
                    role: 'admin'
                });
            })
        );
    });
}

function updateProject(project, data, user) {
    return validateProject(data).then((err) => {
        return err ? (
            Promise.reject(err)
        ) : (
            isUserProjectAdmin(user.id, project.id).then((isAdmin) => {
                isAdmin ? (
                    table('projects').update(project.id, data)
                ):(
                    customErrorShape({msg: 'User is not the admin of the project, hence cannot edit it.'})
                );
            })
        );
    });
}

function deleteProject(project, user) {
    return isUserProjectAdmin(user.id, project.id).then((isAdmin) => {
        isAdmin ? (
            Promise.all([
                table('projects').delete({id: project.id}),
                table('user_projects').delete({user_id: user.id, project_id: project.id}),
                table('tasks').where({project_id: project.id}).all()
            ]).then(([dp, dup, tasks]) => {
                const taskIds = map(tasks, (task) => task.id);
                return Promise.all([
                    table('tasks').whereIn('id', taskIds).delete(),
                    table('user_tasks').whereIn('task_id', taskIds).delete(),
                    table('task_comments').whereIn('task_id', taskIds).delete()
                ]);
            })
        ):(
            customErrorShape({msg: 'User is not the admin of the project, hence cannot delete it.'})
        );
    });
}

function validateProject(data) {
    return shape({
        name: (name) => isString(name) && name.length > 3 ? null : 'Name is invalid, min 3 character name is must.',
        description: (description) => isString(description) && description.length > 6 ?
            null : 'description is invalid, min 6 character description is must.'
    }).errors(data);
}


function addProjectUser(users, projectId) {
    return table('user_projects').insert(users.map((user) => {
        return {
            user_id: user.id,
            project_id: projectId,
            role: user.role
        };
    }));
}

function addProjectMembers(data = [], project, user) {
    return isUserProjectAdmin(user.id, project.id).then((isAdmin) => {
        return isAdmin ? (
            isMembersDataVaild(data).then((isVaild) => {
                return isVaild ? addMember(data, project) : customErrorShape({members: 'Members role or username are not valid.'});
            })
        ) : customErrorShape({user: 'User is not admin or project does not exists'});
    });
}

function isMembersDataVaild(data) {
    let vaildity = true;
    map(data, (user) => {
        if(!isString(user.username) || user.username.length < 0 ||
            ['admin', 'employee'].indexOf(user.role) === -1) {
            vaildity = false;
        }
    });
    return Promise.resolve(vaildity);
}

function addMember(data, project) {
    const userNames = map(data, (user) => user.username);
    return table('users').whereIn('username', userNames).all().then((users) => {
        const userIds = map(users, (existUser) => existUser.id);
        if(userIds.length !== data.length) {
            return customErrorShape({members: 'Some member does not exists added, please ask member to signup.'});
        }
        return table('user_projects')
            .whereIn('user_id', userIds)
            .where({project_id: project.id})
            .all()
            .then((userProjects) => {
                const alreadyAddedUserIds = map(userProjects, (userProject) => userProject.user_id);
                if(alreadyAddedUserIds.length === data.length) {
                    return customErrorShape({members: 'All member member already added.'});
                }
                const newData = merge(filter(users, (userObj) => alreadyAddedUserIds.indexOf(userObj.id) === -1), data);
                return addProjectUser(newData, project.id);
            });
    });
}

function membersBelongsToProject(userIds, projectId) {
    return table('user_projects').whereIn('user_id', userIds).where({project_id: projectId}).all().then((userProjects) => {
        return Promise.resolve(userProjects.length === userIds.length);
    });
}


module.exports = {
    createProject,
    updateProject,
    deleteProject,
    addProjectMembers,
    getProjectById,
    projectIdMiddlerware,
    getProjects,
    membersBelongsToProject
};