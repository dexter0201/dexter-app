export default function loadTables(orm) {
    orm.defineTable({
        name: 'projects',

        props: {
            autoId: true,
            timestamps: true
        }
    });
}