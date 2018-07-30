function up(knex) {
  return knex.schema.createTable('user_projects', (t) => {
    t.uuid('id').primary();
    t.uuid('user_id').index();
    t.uuid('project_id').index();
    t.enum('role', ['admin', 'employee']);
    t.timestamps();
  });
}

function down(knex) {
  return knex.schema.dropTable('user_projects');
}

module.exports = {up, down};
