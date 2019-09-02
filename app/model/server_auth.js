module.exports = app =>{
    const {TEXT,DATE} = app.Sequelize;
    
    const ServerAuth = app.model.define('server_auth',{
        id:{
            type:TEXT,
            primaryKey: true
        },
        server_id:{
            type:TEXT
        },
        account_id:{
            type:TEXT
        },
        auth_by:{
            type:TEXT
        },
        auth_reason:{
            type:TEXT
        },
        create_time:{
            type:DATE,
            defaultValue: app.Sequelize.fn('now')
        },
    },{
        createdAt: false,//创建时间戳
        updateAt: false,//更新时间戳
        freezeTableName: true,//禁止表名后边加s
        classMethods:{
            associate(){
                app.model.ServerAuth.belongsTo(app.model.Server,{foreignKey: 'server_id',targetKey: 'id'});
            }
        }
    })
    return ServerAuth;
}