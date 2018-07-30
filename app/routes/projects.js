const app = module.exports = require('express')();

const {loggedIn} = require('app/auth');
const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    projectIdMiddlerware,
    addProjectMembers
    } = require('app/actions').projects;

app.get('/list', loggedIn, (req, res) => {
    getProjects(req.user)
        .then((projects) => res.send({projects}));
});

app.post('/create', loggedIn, (req, res) => {
    createProject(req.body, req.user)
        .then((project) => res.send({project}))
        .catch((err) => {
            res.status(400).send(err);
        });
});

app.put('/:projectId/update', loggedIn, (req, res) => {
    console.log(req.params.projectId);
    getProjectById(req.params.projectId).then((project) => {
        if(project) {
            updateProject(project, req.body, req.user)
                .then(() => res.send({msg: 'Project updated'}))
                .catch((err) => {
                    res.status(400).send(err);
                });
        } else {
            res.status(404).send({msg: 'Project not Found'});
        }
    });
});

app.delete('/:projectId/delete', loggedIn, (req, res) => {
    getProjectById(req.params.projectId).then((project)=> {
        if(project) {
            deleteProject(project, req.user)
                .then(() => res.send({msg: 'Project deleted'}))
                .catch((err) => {
                    res.status(400).send(err);
                });
        } else {
            res.status(404).send({msg: 'Project not found'});
        }
    });
});

app.post('/:projectId/add-members', loggedIn, (req, res) => {
    getProjectById(req.params.projectId).then((project)=> {
        if(project) {
            addProjectMembers(req.body, project, req.user)
                .then(() => res.send({msg: 'Members Added'}))
                .catch((err) => {
                    res.status(400).send(err);
                });
        } else {
            res.status(404).send({msg: 'Project not found'});
        }
    });
});

app.use('/:projectId/tasks', loggedIn, projectIdMiddlerware, require('./tasks'));
