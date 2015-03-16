'use strict';

exports.up = function(knex, p) {
    return knex.schema.createTable('expenses', function(table) {
        table.increments();
        table.date('date').notNullable();
        table.time('time');
        table.string('description').notNullable();
        table.decimal('amount').notNullable();
        table.string('comment', 1024);
        table.integer('user_id').references('id').inTable('users');
        table.timestamps();
    });
  
};

exports.down = function(knex, p) {
    return knex.schema.dropTableIfExists('expenses');
};
