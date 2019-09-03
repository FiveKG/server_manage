//@ts-check

const Controller = require('egg').Controller;

class SystemPageController extends Controller {
  async login() {
    this.logger.info(`login page controller`);

    //构造 网页授权链接 ，以及 二维码 的连接 ， 显示到页面上。
    const CORPID = this.config.qywx.corp_id ;
    const agentId = this.config.qywx.agentId ;
    const REDIRECT_URI =  `${this.config.site_url}/login_success`;
    const webPageAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${CORPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;

    const obj = {
      "auth_url"    : webPageAuthUrl,
      "appid"       : CORPID,
      "agentid"     : agentId,
      "redirect_uri": REDIRECT_URI,
      "state"       : `=&_csrf=${this.ctx.csrf}`
    };

    await this.ctx.render("systemPage/login" , obj);
  }

  async login_success(){
    
    const code = this.ctx.query.code;
    this.logger.info(`登陆成功.${code}`);
    // 
    const userInfo = await this.service.qywxApi.getUserInfo(code);

    //todo: 从数据库里检查 是否有这个用户的信息， 如果没有， 则需要调用 微信的通讯录接口， 获取用户的详情。

    const userDetail = await this.service.qywxApi.getUserDetail(userInfo.UserId);
    this.ctx.body = userDetail;
    this.logger.debug(`userDetail:`,userDetail);
    //todo: 如果数据库里没有这个用户， 同步到数据库内。

    //todo: 最终 向客户端写入 cookie , 并转向到 后台页面。
    const user =  { "user_id": userDetail.userid , "name": userDetail.name , "avatar": userDetail.avatar} ;
    
    const userStr = JSON.stringify(user);
    // this.logger.debug(`\n userStr:\n` , userStr);
    var b = Buffer.from(userStr);
    this.ctx.cookies.set("login", b.toString('base64'), {  httpOnly: true,  signed: true , encrypt: true});
    this.ctx.redirect(`/server/list`);
    // await this.ctx.render("systemPage/login_success");
  }

}

module.exports = SystemPageController;
