'use strict';

exports.up = function(knex/*, Promise*/) {
    return knex.schema.createTable('users', function(table) {
        table.increments();
        table.string('name').notNullable();
        table.string('password_hash').notNullable();
        table.string('token');
        table.timestamp('last_accessed_at');
        table.timestamps();
    });
};

exports.down = function(knex/*, Promise*/) {
    return knex.schema.dropTableIfExists('users');
};
