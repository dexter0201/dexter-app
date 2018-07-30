export default function loadTables(orm) {
    orm.defineTable({
        name: 'users',

        props: {
            autoId: true,
            timestamps: true
        },

        relations: {
            tasks() {
                return this
                    .manyToMany('tasks', 'user_tasks', 'assigned_to', 'task_id')
                    ;
            },
            projects() {
                return this
                    .manyToMany('projects', 'user_projects', 'user_id', 'project_id')
                    .withPivot('role')
                    ;
            }
        }
    });
}
