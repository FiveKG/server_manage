'use strict';

const Controller = require('egg').Controller;
const viewOptions = {layout: 'layout.html'};

class ServerController extends Controller {
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
