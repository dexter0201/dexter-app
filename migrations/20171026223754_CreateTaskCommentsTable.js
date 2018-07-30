function up(knex) {
  return knex.schema.createTable('task_comments', (t) => {
    t.uuid('id').primary();
    t.uuid('task_id');
    t.text('comment');
    t.timestamps();
  });
}

function down(knex) {
  return knex.schema.dropTable('task_comments');
}

module.exports = {up, down};
