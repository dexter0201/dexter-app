const users = require('./users');
const projects = require('./projects');
const userProjects = require('./userProjects');
const tasks = require('./tasks');
const userTasks = require('./userTasks');
const comments = require('./comments');

export default function loadTables(orm) {
    users(orm);
    projects(orm);
    userProjects(orm);
    tasks(orm);
    userTasks(orm);
    comments(orm);
}
