//@ts-check

const Controller = require('egg').Controller;

class SystemPageController extends Controller {
  async login() {
    this.logger.info(`login page controller`);

    //构造 网页授权链接 ，获取 二维码 ， 显示到页面上。
    const CORPID = this.config.qywx.corp_id ;
    const REDIRECT_URI = ``;
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${CORPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
    await this.ctx.render("systemPage/login");
  }
}

module.exports = SystemPageController;
