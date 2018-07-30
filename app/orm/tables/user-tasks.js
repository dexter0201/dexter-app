export default function loadTables(orm) {
    orm.defineTable({
        name: 'user_tasks',

        props: {
            autoId: true,
            timestamps: true
        },
        relations: {
            tasks() {
                return this
                    .belongsTo('tasks', 'task_id')
                    ;
            }
        }
    });
}
