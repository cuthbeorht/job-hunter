/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    

    pgm.createTable('job_experiences', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        company_name: {
            type: 'text',
            notNull: true,
        },
        position_title: {
            type: 'text',
            notNull: true,
        },
        start_date: {
            type: 'date',
            notNull: true,
        },
        end_date: {
            type: 'date',
        },
        
    });

    pgm.createTable('experience_items', {
        id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        details: {
            type: 'text',
            notNull: true,
        },
        job_experience_id: {
            type: 'uuid',
            references: '"job_experiences"',
            onDelete: 'cascade',
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('experience_items');
    pgm.dropTable('job_experiences');
};
