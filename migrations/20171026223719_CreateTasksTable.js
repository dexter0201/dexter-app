function up(knex) {
  return knex.schema.createTable('tasks', (t) => {
    t.uuid('id').primary();
    t.uuid('project_id').index();
    t.string('title');
    t.text('description');
    t.date('finished_by');
    t.enum('priority', ['low', 'critical', 'medium']);
    t.enum('type', ['normal', 'impediment', 'issue']);
    t.enum('status', ['pending', 'assign', 'to_do', 'completed', 'blocked']);
    t.timestamps();
  });
}

function down(knex) {
  return knex.schema.dropTable('tasks');
}

module.exports = {up, down};
