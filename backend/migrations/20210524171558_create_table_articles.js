
exports.up = function (knex) {
  return knex.schema.createTable('articles', table => {
    table.increments('id').primary()
    table.string('name').notNull()
    table.string('description', 1000).notNull()
    table.string('imageUrl', 1000)
    table.binary('content').notNull()
    table.integer('userId').unsigned().notNull()
    table.foreign('userId').references('id').inTable('users')
    table.integer('categoryId').unsigned().notNull()
    table.foreign('categoryId').references('id').inTable('categories')
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('articles')
};
