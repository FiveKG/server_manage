//@ts-check

/**
 * 
 * @param {*} app 
 */
function define(app) {
    const { TEXT,DATE,INTEGER } = app.Sequelize;
    const Server = app.model.define('server',{
        server_id        : { type:TEXT, primaryKey: true },
        owner            : { type:TEXT },
        os_info          : { type:TEXT },
        ip               : { type:TEXT },
        name             : { type:TEXT },
        cpu              : { type:INTEGER, defaultValue : "1" },
        memory           : { type:INTEGER, defaultValue : "512" },
        disk             : { type:TEXT },
        network          : { type:TEXT },
        location         : { type:TEXT },
        tags             : { type:TEXT },
        remark           : { type:TEXT },
        encrypt_info     : { type:TEXT },
        create_time      : { type:DATE, defaultValue: app.Sequelize.fn('now')  /** /defaultValue: Sequelize.literal("NOW()")*/ },
        create_account_id: { type:TEXT, },
        state            : { type:TEXT, defaultValue:"normal" },
        odr_idx          : { type:INTEGER, defaultValue:"100" },
    },{
        createdAt: false,//创建时间戳
        updateAt: false, //更新时间戳
        freezeTableName: true,//禁止表名后边加s
        classMethods:{
            associate(){
                app.model.Server.hasMany(app.model.ServerAuth, { foreignKey:'server_id',targetKey: 'id'} );
            }
        }
    });
    
    // Server.associate = function(){
    //     app.model.Server.hasMany(app.model.ServerAuth);
    // };

     return Server;
}
module.exports = define;
