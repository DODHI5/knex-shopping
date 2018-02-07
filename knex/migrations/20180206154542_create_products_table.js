exports.up = function(knex, Promise) {
  return knex.schema.createTable("products", function(table) {
    table.increments("id");
    table.string("title");
    table.text("description");
    table.integer("inventory");
    table.decimal("price");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("products");
};
