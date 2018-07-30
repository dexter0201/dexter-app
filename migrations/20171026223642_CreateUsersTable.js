function up(knex) {
  return knex.schema.createTable('users', (t) => {
    t.uuid('id').primary();
    t.string('username').unique();
    t.string('password');
    t.jsonb('meta');
    t.timestamps();
  });
}

function down(knex) {
  return knex.schema.dropTable('users');
}

module.exports = {up, down};
