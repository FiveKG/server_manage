'use strict';

const Service = require('egg').Service;

class ServerService extends Service {
  /**
   * 获取所有服务器信息 
   * @method get_server_info
   * @returns {Array} data 所有服务器信息
   */
  async get_servers_info(){
    this.logger.debug(`edit_server`);
    let data=[]
    const res_objs = await this.ctx.model.Server.findAll({
      attributes:['server_id','owner','os_info','ip','name','cpu','memory','disk','network','location','tags','remark'],
    })
    
    for(let obj of res_objs){
      data.push(obj.dataValues)
    }
    return data
  }

}

module.exports = ServerService;
