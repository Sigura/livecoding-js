module.exports = {

  development: {
    client: 'postgres',
    connection: 'postgres://vagrant@localhost/expenses',
    pool: {
        max: 1
    },
    migrations: {
        tableName: 'knex_migrations'
    }
  },

  test: {
    client: 'postgres',
    connection: 'postgres://vagrant@localhost/expenses_test',
    pool: {
        max: 1
    },
    migrations: {
        tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgres',
    connection: 'postgres://USER@DBSERVER/expenses',
    pool: {
        max: 1
    },
    migrations: {
        tableName: 'knex_migrations'
    }
  }
};
