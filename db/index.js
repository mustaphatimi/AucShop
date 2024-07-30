const { pool, createUsersTable } = require("./db")

const runDBMigrations = async () => {
    const client = await pool.connect();

    try {
        await client.query(createUsersTable).then((res) => {
            console.log('Database conn successful; Users table created!')
        })
    } catch (error) {
        await client.query('ROLLBACK').then(() => {
            console.log('DB Migration failed!')
        })
        throw new Error(error)
    } finally {
        client.release()
    }
}

module.exports = runDBMigrations;