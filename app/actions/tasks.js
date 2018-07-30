const shape = require('shape-errors');
const isUuid = require('is-uuid').v4;
const {isString, map, merge, isArray, isEmpty} = require('lodash');

const {table} = require('app/orm');
const {customErrorShape} = require('app/helper/common');
const {isUserProjectAdmin} = require('./users');
const {membersBelongsToProject} = require('./projects');

function getTasks(user, project, query) {
    const partQuery = table('tasks')
            .where({project_id: project.id})
            .forUser(user)
        ;
    return isEmpty(query) ? partQuery.all() : partQuery.where(query).all();
}

function getTaskById(id) {
    return isUuid(id) ? table('tasks').find(id) : null;
}

function createTask(data={}, project, user) {
    return isUserProjectAdmin(user.id, project.id).then((isAdmin) => {
        return isAdmin ? (
            validateTask(data).then((err) => {
                return err ? (
                    Promise.reject(err)
                ) : (
                    membersBelongsToProject(data.assignToIds, project.id).then((res) => {
                        return res ? (
                            table('tasks').insert(merge(data, {project_id: project.id})).then((task) => {
                                return table('user_tasks').insert(data.assignToIds.map((assignToId) => {
                                    return {
                                        task_id: task.id,
                                        assigned_to: assignToId,
                                        assigned_by: user.id
                                    };
                                }));
                            })
                        ) : (
                            customErrorShape({msg: 'Some User does not belongs to the project, please remove them.'})
                        );
                    })
                );
            })
        ) : (
            customErrorShape({msg: 'User is not the admin of the project, hence create task is not permitted.'})
        );
    });
}

function updateTask(task, data, user, project) {
    return isUserProjectAdmin(user.id, project.id).then((isAdmin) => {
        return isAdmin ? (
            validateTask(data).then((err) => {
                return err ? (
                    Promise.reject(err)
                ) : (
                    membersBelongsToProject(data.assignToIds, project.id).then((res) => {
                        return res ? (
                            Promise.all([
                                table('tasks').update(task.id, merge(data, {project_id: project.id})),
                                table('user_tasks').delete({id: task.id})
                            ]).then(() => {
                                return table('user_tasks').insert(data.assignToIds.map((assignToId) => {
                                    return {
                                        task_id: task.id,
                                        assigned_to: assignToId,
                                        assigned_by: user.id
                                    };
                                }));
                            })
                        ) : (
                            customErrorShape({msg: 'Some User does not belongs to the project, please remove them.'})
                        );
                    })
                );
            })
        ) : (
            customErrorShape({msg: 'User is not the admin of the project, hence create task is not permitted.'})
        );
    });
}

function deleteTask(task, user, project) {
    return isUserProjectAdmin(user.id, project.id).then((isAdmin) => {
        return isAdmin ? (
            Promise.all([
                table('tasks').delete({id: task.id}),
                table('user_tasks').delete({id: task.id})
            ])
        ) : (
            customErrorShape({msg: 'User is not the admin of the project, hence create task is not permitted.'})
        );
    });
}

function validateTask(data) {
    return shape({
        title: (title) => isString(title) && title.length > 0 ? null : 'title is invalid.',
        description: (description) => isString(description) && description.length > 6 ?
            null : 'description is invalid, min 6 character description is must.',
        priority: (priority) => ['low', 'critical', 'medium'].indexOf(priority) > -1 ? null : 'priority is invalid.',
        type: (type) => ['normal', 'impediment', 'issue'].indexOf(type) > -1 ? null : 'type is invalid.',
        assignToIds: (assignToIds) => isArray(assignToIds) ?
            isUserIdsVaildUuid(assignToIds).then((res) => res ? null : 'Some assgin to ids are invaild.') :
            'AssignToIds are expect an array of user ids that have to be added for task',
        status: (status) => ['pending', 'assign', 'to_do', 'completed', 'blocked'].indexOf(status) > -1 ? null : 'status is invalid.'
    }).errors(data);
}

function isUserIdsVaildUuid(ids) {
    if (ids.length === 0) {
        return Promise.resolve(false);
    }
    let vaildity = true;
    map(ids, (id) => {
        if(!isUuid(id)) {
            vaildity = false;
        }
    });
    return Promise.resolve(vaildity);
}

function changeStatus(task, data) {
    return validateStatus(data).then((err) => {
        return err ? Promise.reject(err) : (
            table('tasks').update(task.id, {status: data.status})
        );
    });
}

function validateStatus(data) {
    return shape({
        status: (status) => ['pending', 'assign', 'completed', 'blocked'].indexOf(status) > -1 ? null : 'status is invalid.'
    }).errors(data);
}

module.exports = {
    createTask,
    updateTask,
    deleteTask,
    changeStatus,
    getTaskById,
    getTasks
};