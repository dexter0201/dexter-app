module.exports = {
    server: {
        host: '0.0.0.0',
        port: 3000
    },

    orm: {
        db: {
            client: 'postgresql',
            connection: {
                database: 'task_management_db',
                host: 'localhost',
                user: 'findquad',
                password: 'findquad@123'
            },
            pool: {
                min: 2,
                max: 10
            },
            migrations: 'knex_migrations'
        },

        redis: {
            host: 'localhost',
            port: '6379',
            keyPrefix: 'finalquad.api.'
        }
    },

    emailConfiguration: {
        api: 'key-3ef53d3ccae055acd63e6c4421d3cfed',
        domain: 'convfy.com'
    },

    backend: {
        url: 'http://localhost:3000'
    },

    auth: {
        // 180 days in ms
        tokenLifetime: 365 * 24 * 3600 * 1000
    },

    headers: {
        authToken: 'auth-token'
    }
};