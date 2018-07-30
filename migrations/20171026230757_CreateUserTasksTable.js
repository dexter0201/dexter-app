function up(knex) {
  return knex.schema.createTable('user_tasks', (t) => {
    t.uuid('id').primary();
    t.uuid('assigned_to').index();
    t.uuid('assgined_by').index();
    t.uuid('task_id');
    t.timestamps();
  });
}

function down(knex) {
  return knex.schema.dropTable('user_tasks');
}

module.exports = {up, down};
