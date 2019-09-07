//@ts-check

const Controller = require('egg').Controller;
const viewOptions = {layout: 'layout.html'};

class ServerController extends Controller {

    async list() {
        //测试， 向 企业微信的用户发送消息
        const { WxUserTag } = require("../service/constantData.js");
        const result = await this.service.qywxApi.sendTextMessage("# 测试 \n  **事项详情** \n 测试测试" ,null ,null,null,WxUserTag.docker);

        this.logger.debug(`发送消息的结果:`, result);
        await this.ctx.render("server/list",this.ctx.user);
    }

    /**
     * 渲染服务器信息页面
     */
    async server_info(){


        let locals = {
            h3_title: '服务器信息',
            h2_title: '查看信息',
        };
    
        await this.ctx.render('server_info.html',locals,viewOptions);
    };

    /**
     * 渲染添加服务器信息页面
     */
    async set_server() {

        let locals = {
            h3_title: '添加服务器',
            h2_title: '填写信息',
            csrf    : this.ctx.csrf,
        };

        await this.ctx.render('set_server.html',locals,viewOptions);
  }
  async server_auth(){
    let locals = {
        h3_title: '添加服务器',
        h2_title: '填写信息',
    };
    await this.ctx.render('server_auth.html',locals,viewOptions)
  }
}



module.exports = ServerController;
