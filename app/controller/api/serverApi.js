'use strict';

const Controller = require('egg').Controller;
const shortid = require('shortid');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class ServerApiController extends Controller {

  /**
   * 设置服务器信息,插入/更新数据库
   * @method set_server
   * @returns  void
   */
  async set_server() {
    this.logger.debug(`edit_server`);
    const data = this.ctx.request.body;

    data.server_info.cpu    = toInt(data.server_info.cpu);
    data.server_info.memory = toInt(data.server_info.memory);
    //这个需要后面修改，现在测试用
    data.server_info.create_account_id = data.server_info.ip;

    //加密
    data.server_info.encrypt_info = this.ctx.helper.encrypt(data.encrypt_code,JSON.stringify(data.server_info.encrypt_info));
    if(!data.server_id){//新增服务器信息 
      
        //插入数据库
        //创建新id
        data.server_info.server_id = shortid.generate()
        const user = await this.ctx.model.Server.create(data.server_info)
        this.ctx.status = 201;
    }
    else{
      //更新服务器信息
    }
    this.ctx.body={
      result:data
    }
  }

  
}

module.exports = ServerApiController;
