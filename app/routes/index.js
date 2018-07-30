const app = module.exports = require('express')();

app.get('/', (req, res) => {
    res.send({msg: 'hello! Server is up and running'});
});

app.use('/auth', require('./auth'));
app.use('/users', require('./users'));
app.use('/projects', require('./projects'));
app.use('/tasks', require('./tasks'));

// the catch all route
app.all('*', (req, res) => {
    res.status(404).send({msg: 'not found'});
});
