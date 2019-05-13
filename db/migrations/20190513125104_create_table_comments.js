exports.up = function(knex, Promise) {
  console.log('Creating comments table');
  return knex.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id').primary();
    commentsTable
      .string('author')
      .references('users.username')
      .notNullable();
    commentsTable
      .integer('article_id')
      .references('articles.article_id')
      .notNullable();
    commentsTable.text('body').notNullable();
    commentsTable.integer('votes').defaultsTo(0);
    commentsTable.timestamp('created_at').notNullable();
  });
};

exports.down = function(knex, Promise) {
  console.log('Removing comments table');
  return knex.schema.dropTable('comments');
};
