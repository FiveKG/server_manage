
/**
 * 
 * @param {Egg.Application} app 
 */
function eggApp(app){
    
    //@ts-ignore
    app.cache = {};
    app.ready( async () =>{
        app.logger.info(` eggjs app ready`);
        const { check_db_is_init } = require("./app/service/db-common");
        const flag = await check_db_is_init();
        app.logger.info(` db flag:${flag} `);
        if(!flag){
            //执行数据库的初始化操作
            await app.model.sync({force: true});
            app.logger.info(`之前未初始化，现数据库初始化完成.`);
        }
        else{
            app.logger.info(`数据库已经初始化.`);
        }
    });
}
module.exports = eggApp;
