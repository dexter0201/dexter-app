export default function loadTables(orm) {
    orm.defineTable({
        name: 'tasks',

        props: {
            autoId: true,
            timestamps: true
        },

        relations: {
            comments() {
                return this
                    .hasMany('comments', 'task_id')
                    ;
            }
        },
        scopes: {
            forUser(user) {
                return this.scope((query) => {
                    query
                        .join('user_tasks', (j) => j.on('tasks.id', '=', 'user_tasks.task_id'))
                        .join('users', (j) => j.on('users.id', '=', 'user_tasks.assigned_to'))
                        .where({
                            'users.id': user.id
                        }
                    );
                });
            }
        }
    });
}
