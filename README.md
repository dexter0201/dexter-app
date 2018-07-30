# dexter-app
Dexter's nodeJS application structure

Structure

1. `app` - main app (details below)
2. `docs` - documentation
3. `lib` - the complied app code goes which is used for production env
4. `migrations` - all the table schema. (e.g, use knex.js or any ORM written on top of it
5. `node_modules`
6. `tests` - all unit tests
7. `config` and `config.sample.js` - configuration related to database, authentication, external api keys etc are stored
8. `eslintrc` - the lint logic
9. `migrate` is the file that pass the configuration from config.js to ORM and help to run migration from CLI
10. `gitignore` - path to folder or filename that don’t want to push on repository
11. `package.json`

The app Structure
1. `server.js` - the file that start the server and will have all middleware that is required for request parsing like `bodyparser`, `cors`, `multer` and `errorhandlers` etc and finally add routes middleware
2. `routes` - have sub-files or sub-folders made as per the entities in project. Note: We can abstract a big entity like teams in a folder and can call it as teams which can then have sub sub-folder like members, contacts, dashboard etc. under routes. A file under routes is where all request handler or sub-routes are written and the only purpose of them is to either call the action that is responsible for that route or the sub-route folder
3. `actions` - most of the times actions folder will have same the same structuring as the routes folder. Each file in actions is for business logic i.e all code that store, get, change real entities either in database tables or doing queuing function like enqueue and dequeue etc all happen here. Note: Actions can call other actions too
4. `middlewares, utils, helpers, tasks` - follow the same way of structuring as action or routes do i.e main entity will act as a root folder and then will can have sub-folder as per sub-entities and repeat
5. `tasks.js` - used for running tasks from CLI created under task folder like database seed, clean database etc
6. nsqd - use case specific for distributed messaging. Note: NSQ - https://nsq.io/ is one the best for distributed messaging it works great with no pain in production

