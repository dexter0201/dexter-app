function up(knex) {
  return knex.schema.createTable('projects', (t) => {
    t.uuid('id').primary();
    t.string('name');
    t.string('description');
    t.timestamps();
  });
}

function down(knex) {
  return knex.schema.dropTable('projects');
}

module.exports = {up, down};
