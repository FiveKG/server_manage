module.exports = app =>{
    const {TEXT} = app.Sequelize;
    
    const ServerApps = app.model.define('server_apps',{
        id:{
            type:TEXT,
            primaryKey: true
        },
        server_id:{
            type:TEXT
        },
        app_name:{
            type:TEXT
        },
        version:{
            type:TEXT
        },
        deploy_dir:{
            type:TEXT
        },
        remark:{
            type:TEXT
        },
    },{
        createdAt      : false,   //创建时间戳
        updateAt       : false,   //更新时间戳
        freezeTableName: true,    //禁止表名后边加s
        classMethods   : {
            associate(){
                app.model.ServerApps.belongsTo(app.model.Server);
            }
        }
    })
    return ServerApps;
}