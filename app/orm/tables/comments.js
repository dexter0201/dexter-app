export default function loadTables(orm) {
    orm.defineTable({
        name: 'task_comments',

        props: {
            autoId: true,
            timestamps: true
        }
    });
}