//@ts-check


/**
 * 拒绝服务 。 如果 url 里 包含 api ， 那么响应一个 json 。 否则， 重定向到 login
 * @param {Egg.Context} ctx 
 * @param {string} msg
 */
function deny(ctx, msg){
    if(ctx.url.indexOf("api") > -1){
        ctx.logger.info(`deny . api . json`);
        ctx.body = { "success": false , "msg":msg };
        ctx.status = 200;
        return;
    }
    else{
        ctx.logger.info(`deny . page . redirect`);
        ctx.redirect('/login');
    }
}

/**
 * 
 * @param {Egg.EggAppConfig} config 
 * @param {Egg.Application} app 
 */
function check(config,app) {    
    
    return async function (ctx, next) {
        ctx.logger.info(`enter check middleware. url: ${ctx.url}`);
        if(ctx.url.indexOf("login") == -1){
            
            let loginCookie =  ctx.cookies.get('login-cookie', { signed: true, encrypt: true });
            if(!loginCookie){
                ctx.logger.info(`未获取到 loginCookie. 转向`);
                deny(ctx, "请提供token");
                return;
            }
            else{
                ctx.logger.info(` 离开 check middleware`);
                await next();
            }
        }
        else{
            ctx.logger.info(`login page , api ....`);
            await next();
        }
        
        
        // let token = ctx.cookies.get("token");
        // ctx.logger.info(`enter check middleware. url: ${ctx.url}`);
        // if(!token){
        //     ctx.logger.info(`请提供token`);
        //     deny(ctx, "请提供token");
        //     return;
        // }
        // try {
        //     // ctx.logger.info(`验证 token . jwt_secret:${app.config.jwt_token}`);
        //     let user = ctx.helper.verifyJwt(token);
        //     ctx.user = user;
        //     ctx.logger.info(`验证 token .  success`);
        //     await next();
        // }
        // catch (error) {
        //     if(error.message.indexOf("jwt") > -1){
        //         ctx.logger.error("verify token error :",error);
        //         ctx.logger.info(`token 已失效或已过期`);
        //         deny(ctx, "token 已失效或已过期");
        //     }
        //     else{
        //         throw error;
        //     }
        // }
        // ctx.logger.info(`结束 catch . 离开 check middleware`);
    };
}

module.exports = check;