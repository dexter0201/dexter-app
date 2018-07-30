const app = module.exports = require('express')();

const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    changeStatus
    } = require('app/actions').tasks;

app.get('/list', (req, res) => {
    getTasks(req.user, req.project, req.query)
        .then((tasks) => res.send({tasks}));
});

app.post('/create', (req, res) => {
    createTask(req.body, req.project, req.user)
        .then((task) => res.send({task}))
        .catch((err) => {
            res.status(400).send(err);
        });
});

app.put('/:taskId/update', (req, res) => {
    getTaskById(req.params.taskId).then((task) => {
        if(task) {
            updateTask(task, req.body, req.user, req.project)
                .then((task) => res.send({task}))
                .catch((err) => {
                    res.status(400).send(err);
                });
        } else {
            res.status(404).send({msg: 'Task not Found'});
        }
    });
});

app.delete('/:taskId/delete', (req, res) => {
    getTaskById(req.params.taskId).then((task)=> {
        if(task) {
            deleteTask(task, req.user, req.project)
                .then(() => res.send({msg: 'done'}))
                .catch((err) => {
                    res.status(400).send(err);
                });
        } else {
            res.status(404).send({msg: 'Task not found'});
        }
    });
});

app.patch('/:taskId/change-status', (req, res) => {
    getTaskById(req.params.taskId).then((task)=> {
        if(task) {
            changeStatus(task, req.body, req.user)
                .then(() => res.send({msg: 'done'}))
                .catch((err) => {
                    res.status(400).send(err);
                });
        } else {
            res.status(404).send({msg: 'Task not found'});
        }
    });
});
