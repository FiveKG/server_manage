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
    })

    return ServerApps;
}