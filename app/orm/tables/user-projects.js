export default function loadTables(orm) {
    orm.defineTable({
        name: 'user_projects',

        props: {
            autoId: true,
            timestamps: true
        },
        relations: {
            projects() {
                return this
                    .belongsTo('projects', 'project_id')
                    ;
            }
        }
    });
}