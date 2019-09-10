'use strict';

const Service = require('egg').Service;

class ServerService extends Service {
  /**
   * 获取所有服务器信息 
   * @method get_server_info
   * @returns {Array} data 所有服务器信息
   */
  async get_servers_info(){
    this.logger.debug(`获取所有服务器信息`);
    let data=[]
    let res_objs = await this.ctx.model.Server.findAll({
      attributes:['server_id','owner','os_info','ip','name','cpu','memory','disk','network','location','tags','remark'],
    })
    
    for(let obj of res_objs){
      data.push(obj.dataValues)
    }
    return data
  }

  /**
   * 获取一个指定服务器信息 
   * @param {String} server_id 服务器id
   * @method get_server_by_id
   * @returns {Json} data 所有服务器信息
   */
  async get_server_by_id(server_id){
    this.logger.debug('获取一个指定服务器信息 ');

    let res_obj = await this.ctx.model.Server.findOne({
      where:{'server_id':server_id},
      attributes:['server_id','owner','os_info','ip','name','cpu','memory','disk','network','location','tags','remark'],
    })
    return res_obj.dataValues
  }

}

module.exports = ServerService;
