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

        let datas = await this.service.server.get_servers_info()

        let locals = {
            h3_title: '服务器信息',
            h2_title: '查看信息',
            datas:datas,
        };
        
        await this.ctx.render('server_info.html',locals,viewOptions);
    };

    /**
     * 渲染添加服务器信息页面
     */
    async set_server() {
        
        let data = this.ctx.query
        let locals = {
            h3_title: '添加服务器',
            h2_title: '填写信息',
            csrf    : this.ctx.csrf,
            server_id: '',
            owner: '',
            os_info: '',
            ip: '',
            name: '',
            another_disk_style:'hd',
            current_disk_style:'ssd',
            cpu: '1',
            memory: '512',
            disk: '50',
            network: '',
            location: '',
            tags: '无标签',
            remark: '' 
        };

        if(data.server_id){//如果点编辑进来
            //获取这个服务器信息
            let server_info =await this.service.server.get_server_by_id(data.server_id); 
            Object.assign(locals,server_info);

            //格式化disk
            let disk = server_info.disk.split('/');
            let disk_size = disk[0].replace('G','');
            let disk_style = disk[1];

            locals.disk = disk_size;
            locals.current_disk_style = disk_style
            if (locals.current_disk_style == 'hd'){
                locals.another_disk_style = 'ssd';
            }
            else{
                locals.current_disk_style = 'ssd';
                locals.another_disk_style = 'hd';
            }
        };
        await this.ctx.render('set_server.html',locals,viewOptions);
  }

  async server_auth(){
    let locals = {
        h3_title: 'server_auth',
        h2_title: '填写信息',
    };
    await this.ctx.render('server_auth.html',locals,viewOptions)
  }
}

module.exports = ServerController;
