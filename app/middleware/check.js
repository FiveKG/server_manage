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

const exceptUrl = [""];

/**
 * 
 * @param {Egg.EggAppConfig} config 
 * @param {Egg.Application} app 
 */
function check(config,app) {    
    
    return async function (ctx, next) {
        ctx.logger.debug(`enter check middleware. url: ${ctx.url}`);
        if(ctx.url.indexOf("login") == -1){
            
            let base64Str =  ctx.cookies.get('login', { signed: true, encrypt: true });
            ctx.logger.debug(`login base64Str:${base64Str}`);
            // const loginCookie = JSON.parse(cookieStr);
            if(!base64Str){
                ctx.logger.info(`未获取到 loginCookie. 转向`);
                deny(ctx, "请提供token");
                return;
            }
            else{
                const cookieStr = Buffer.from(base64Str, 'base64').toString();
                ctx.logger.debug(`cookieStr:${cookieStr}`);
                ctx.logger.debug(` 离开 check middleware`);
                ctx.user = JSON.parse(cookieStr);
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