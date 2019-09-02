//@ts-check

const Controller = require('egg').Controller;

class ServerController extends Controller {
    async list() {
        //测试， 向 企业微信的用户发送消息
        const { WxUserTag } = require("../service/constantData.js");
        const result = await this.service.qywxApi.sendTextMessage("# 测试 \n  **事项详情** \n 测试测试" ,null ,null,null,WxUserTag.docker);

        this.logger.debug(`发送消息的结果:`, result);
        await this.ctx.render("server/list",this.ctx.user);
    }
}

module.exports = ServerController;
