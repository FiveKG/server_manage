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
    })

    return ServerAuth;
}