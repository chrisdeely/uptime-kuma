exports.up = function (knex) {
    return knex.schema
        .createTable("zod_schema", function (table) {
            table.increments("id");
            table.string("name", 255).notNullable();
            table.text("schema").notNullable();
            table.integer("user_id").unsigned();
        })
        .alterTable("monitor", function (table) {
            // Add new column monitor.remote_browser
            table
                .integer("zod_schema")
                .nullable()
                .defaultTo(null)
                .unsigned()
                .index()
                .references("id")
                .inTable("zod_schema");
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTable("zod_schema")
        .alterTable("monitor", function (table) {
            table.dropColumn("zod_schema");
        });
};
