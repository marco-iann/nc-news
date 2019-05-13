exports.up = function(knex, Promise) {
  console.log('Creating articles table');
  return knex.schema.createTable('articles', articlesTable => {
    articlesTable.increments('article_id').primary();
    articlesTable.string('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').defaultsTo(0);
    articlesTable
      .string('topic')
      .references('topics.slug')
      .notNullable();
    articlesTable
      .string('author')
      .references('users.username')
      .notNullable();
    articlesTable.timestamp('created_at').notNullable();
  });
};

exports.down = function(knex, Promise) {
  console.log('Removing articles table');
  return knex.schema.dropTable('articles');
};
