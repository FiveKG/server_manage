//@ts-check

/**
 * 检查 db 是否已经初始化过. 
 * 从 pg 里获取 表的数量。如果大于0 ， 认为已经初始化过
 * @returns {Promise<boolean>}
 */
async function check_db_is_init() {
    const { Client } = require('pg');
    const { env } =  process ;

    const connOpton = {
        user    : env.DB_USER,
        host    : env.DB_HOST,
        database: env.DB_NAME,
        password: env.DB_PWD,
        port    : parseInt(env.DB_PORT),
    };
    
    const client = new Client(connOpton);
    await client.connect();
    //从 pg 里获取 表的数量。如果大于0 ， 认为已经初始化过。
    const sql = `select count(*) as cnt from pg_tables where tableowner = '${env.DB_USER}';`;  
    const { rows } = await client.query(sql);
    await client.end();
    const count = rows[0]["cnt"];
    console.log(`table count: ${ count }`);
    return count > 0;
}

module.exports = {
    "check_db_is_init" : check_db_is_init
};