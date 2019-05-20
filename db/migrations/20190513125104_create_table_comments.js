exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', commentsTable => {
    commentsTable.increments('comment_id').primary();
    commentsTable
      .string('author')
      .references('users.username')
      .notNullable()
      .onDelete('CASCADE');
    commentsTable
      .integer('article_id')
      .references('articles.article_id')
      .notNullable()
      .onDelete('CASCADE');
    commentsTable.text('body').notNullable();
    commentsTable.integer('votes').defaultsTo(0);
    commentsTable.timestamp('created_at').defaultTo(knex.fn.now(6));
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};
