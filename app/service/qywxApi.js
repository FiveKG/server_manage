//@ts-check

const Service = require('egg').Service;
const { isAfter , addSeconds } = require("date-fns");

const { TokenType } = require("./constantData.js");

class QywxApiService extends Service {
  /**
   * 推送消息。 
   * 支持:文本消息 、图片消息、语音消息、视频消息、文件消息、文本卡片消息、
   * 图文消息、图文消息（mpnews）、markdown消息、小程序通知消息、任务卡片消息
   */
  async _sendMessage(msgData ){
    const token = await this.getAccessToken(TokenType.ApiToken);
    const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}`;
    this.logger.debug(`msgData:` , msgData);
    const result = await this.ctx.curl(url , 
      {
        "contentType": 'json',
        "method": "POST",
        "dataType": "json",
        "data": msgData
      });
    return result;
  }



  /**
   * 发送 文本消息
   id转译说明：
    1. 支持的消息类型和对应的字段   文本（text）	content  还有其他类型。忽略
    2.id转译模版语法   $departmentName=DEPARTMENT_ID$      $userName=USERID$    
    其中 DEPARTMENT_ID 是数字类型的部门id，USERID 是成员帐号。譬如，
      将$departmentName=1$替换成部门id为1对应的部门名；
      将$userName=lisi007$替换成userid为lisi007对应的用户名；
   * @param {string} msgText 消息内容，最长不超过2048个字节，超过将截断（支持id转译） 
   * @param {string} [toUserId]  成员ID列表（消息接收者，多个接收者用‘|’分隔，最多支持1000个）。特殊情况：指定为@all，则向该企业应用的全部成员发送
   * @param {string} [fromAppId] 是哪个应用发的， 默认是 悦智管理  这个应用.
   * @param {string} [toParty]  部门ID列表，多个接收者用‘|’分隔，最多支持100个。当touser为@all时忽略本参数
   * @param {string} [toTag] 标签ID列表，多个接收者用‘|’分隔，最多支持100个。当touser为@all时忽略本参数
   */
  async sendTextMessage(msgText, toUserId , fromAppId , toParty , toTag ){
    this.logger.debug(`发送 text 消息`);
    if(!fromAppId){
      fromAppId = this.config.qywx.agentId;
    }
    const msgData = {
      "touser" : toUserId,
      "toparty" : toParty,
      "totag" : toTag,
      "msgtype" : "text",   //消息类型，此时固定为：text
      "agentid" : parseInt(fromAppId),
      "text" : {
          "content" : msgText
      },
      "safe":0,
      "enable_id_trans": 1
    };
    return this._sendMessage(msgData);
  }

  /**
   * 发送 markdown 消息
   支持的markdown语法
   1. 标题 （支持1至6级标题，注意#与文字中间要有空格）
   2. 加粗 **bold**
   3. 链接 [这是一个链接](http://work.weixin.qq.com/api/doc)
   4. 行内代码段（暂不支持跨行） `code`
   5. 引用  > 引用文字
   6. 字体颜色(只支持3种内置颜色) <font color="info|comment|warning">绿色|灰色|橙红色</font>

   * @param {string} markdownContent markdown内容，最长不超过2048个字节，必须是utf8编码 
   * @param {string} [toUserId]  成员ID列表（消息接收者，多个接收者用‘|’分隔，最多支持1000个）。特殊情况：指定为@all，则向该企业应用的全部成员发送
   * @param {string} [fromAppId] 是哪个应用发的， 默认是 悦智管理  这个应用.
   * @param {string} [toParty]  部门ID列表，多个接收者用‘|’分隔，最多支持100个。当touser为@all时忽略本参数
   * @param {string} [toTag] 标签ID列表，多个接收者用‘|’分隔，最多支持100个。当touser为@all时忽略本参数
   */
  async sendMarkdownMessage(markdownContent, toUserId , fromAppId , toParty , toTag){
    this.logger.debug(`发送 markdown 消息`);
    if(!fromAppId){
      fromAppId = this.config.qywx.agentId;
    }
    const msgData = {
      "touser" : toUserId,
      "toparty" : toParty,
      "totag" : toTag,
      "msgtype" : "markdown",   //消息类型，此时固定为：text
      "agentid" : parseInt(fromAppId),
      "markdown" : {
          "content" : markdownContent
      }
    };
    return this._sendMessage(msgData)
  }

  /**
   * 调用 通讯录接口，获取用户的信息
   * @param {string} userId 
   * @returns {Promise<WxUserResp>}
   */
  async getUserDetail( userId){
    const token = await this.getAccessToken(TokenType.ContactToken);
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${token}&userid=${userId}`;
    const userResp = await this.ctx.curl(url ,{ dataType: 'json'});
    return userResp.data;
  }

  /**
   * 调用 user/getuserinfo 接口。 
   * 注意， 本接口响应里只有一个 userId , 还需要调用 通讯录 api ，才能获取 用户信息
   * @param {string} code 
   * @returns {Promise<WxUserInfoResp>}
   */
  async getUserInfo(code){
    const token = await this.getAccessToken(TokenType.ApiToken);
    const url = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${token}&code=${code}`;
    this.logger.info(`获取用户的信息。url:${url}`);
    const userInfo = await this.ctx.curl(url ,{ dataType: 'json'});
    return userInfo.data;
  }

  /**
   * 获取 AccessToken
   * @param {string} [tokenType]  token 类型. 默认是 apiToken
   * @returns {Promise<string>}
   */
  async getAccessToken(tokenType) {
    tokenType = tokenType || TokenType.ApiToken;
    this.logger.debug(`获取 accessToken。`,tokenType);
    let token = await this._getTokenFromCache(tokenType); 
    if(token){
      this.logger.debug(`从 cache 里获取到了 token.返回调用方`);
      return token;
    }
    else{
      const tokenObj = await this._getAccessTokenFromWx(tokenType);
      this.logger.debug(`从微信接口获取token. tokenObj:`, tokenObj);
      if(tokenObj.errcode != 0){
        this.logger.warn(`企业微信的 获取accessToken 接口返回错误。` , tokenObj);
        throw new Error(`企业微信的 获取accessToken 接口返回错误`);
      }
      else{
        this.logger.debug(`设置 token 缓存.`);
        tokenObj.expired_at = addSeconds(Date.now() , tokenObj.expires_in * 0.8 );  //原始是 7200秒过期， 缓存 80% 
        //@ts-ignore
        this.app.cache[`accessToken_${tokenType}`] = tokenObj;
        return tokenObj.access_token;
      }
    }
  }

  /**
   * 从 cache 里获取 AccessToken 。 会检查 是否过期，未过期 ，才返回值。否则返回 null
   * @param {string} tokenType
   * @returns {Promise<string|null>}
   */
  async _getTokenFromCache(tokenType){
    const tokenKey = `accessToken_${tokenType}`;
    //@ts-ignore
    let token = this.app.cache[tokenKey];
    if(token != undefined){
      if(isAfter(Date.now() , token.expired_at)){
        this.logger.info(`当前缓存中的token 已经过期 , tokenKey:${tokenKey}。 不再使用。缓存的 token:`, token);
        //@ts-ignore
        this.app.cache[tokenKey] = null ;
        return null;
      }
      else{
        this.logger.debug(`返回token。当前 tokenKey:${tokenKey} , token.access_token:${token.access_token}`);
        return token.access_token;
      }
    }
    else{
      return null;
    }
  }

  /**
   * 从 微信接口获取 AccessToken
   * @param {string} tokenType
   * @returns {Promise<WxAccessTokenResp>}
   */
  async _getAccessTokenFromWx(tokenType){
    const secret = (tokenType == TokenType.ApiToken ? 
                      this.config.qywx.secret  : this.config.qywx.contact_sync_secret);
    const accessTokenUrl = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${this.config.qywx.corp_id}&corpsecret=${secret}`;
    this.logger.debug(`tokenType:${tokenType} , accessTokenUrl:${accessTokenUrl}`);
    const token = await this.ctx.curl(accessTokenUrl ,{ dataType: 'json'});
    return token.data;
  }

}

module.exports = QywxApiService;
