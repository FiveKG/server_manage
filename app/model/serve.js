
module.exports = app =>{
    const {TEXT,DATE,INTEGER} = app.Sequelize;
    const Server = app.model.define('server',{
        server_id:{
            type:TEXT,
            primaryKey: true
        },
        owner:{
            type:TEXT
        },
        os_info:{
            type:TEXT
        },
        ip:{
            type:TEXT
        },
        name:{
            type:TEXT
        },
        cpu:{
            type:INTEGER,
            defaultValue : "1"
        },
        memory:{
            type:INTEGER,
            defaultValue : "512"
        },
        disk:{
            type:TEXT
        },
        network:{
            type:TEXT
        },
        location:{
            type:TEXT
        },
        tags:{
            type:TEXT
        },
        remark:{
            type:TEXT
        },
        encrypt_info:{
            type:TEXT
        },
        create_time:{
            type:DATE,
            defaultValue: app.Sequelize.fn('now')
            //defaultValue: Sequelize.literal("NOW()")
        },
        create_account_id:{
            type:TEXT,
        },
        state:{
            type:TEXT,
            defaultValue:"normal"
        },
        odr_idx:{
            type:INTEGER,
            defaultValue:"100"
        },
    });
     return Server;
}

