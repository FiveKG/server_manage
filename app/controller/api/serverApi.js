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
   * 更新还没写，插入已完成
   * @method set_server
   * @returns  void
   */
  async set_server() {
    this.logger.debug(`edit_server`);
    let data= this.ctx.request.body;

    
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
        let user = await this.ctx.model.Server.create(data.server_info);
 
        this.ctx.status = 201;
    }
    else{
      // //更新服务器信息
      //   let user = await this.ctx.model.Server.update(data.server_info,{
      //   fields:['server_id','owner','os_info','ip','name','cpu','memory','disk','network','location','tags','remark']
      // });
    }
    this.ctx.body = { "success":true , "msg" : "成功" , "data" : data } ;
    this.ctx.status = 200;
  }


   /**
   * 用于解密登录信息
   * @method unlock
   * @returns  void
   */
  async unlock(){
    this.logger.debug('解密');
    let data = this.ctx.request.body;

    const unlock_pwd = data.unlock_pwd || "";
    const server_id = data.server_id || "";

    let encrypt_info=null;
    
    if(!unlock_pwd || ! server_id){
      this.logger.debug(`未获取到解密密码 , unlock_pwd.length:${unlock_pwd.length} server_id：${server_id}`);
      this.ctx.body = { "success":true , "msg" : "未获取到解密密码 或 服务器id未获取到." } ;    
      this.ctx.status = 200;
    }else{
         //查询数据库
            let result = await this.ctx.model.Server.findOne({
            where : {'server_id':server_id},
            attributes: ['encrypt_info']
          })
          encrypt_info = result.dataValues.encrypt_info
         

          let str = this.ctx.helper.decrypt(unlock_pwd , encrypt_info);
          let login_info = JSON.parse(str);

          this.ctx.body = { "success":true , "msg" : "成功" , "data" : login_info } ;
          this.ctx.status = 200;

  }
    }
  }

module.exports = ServerApiController;
