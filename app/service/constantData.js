//@ts-check

/** token 类型 */
const TokenType = {
    /** 调用普通Api 的 accessToken */
    ApiToken: "apiToken" ,
  
    /** 通讯录 接口的 accessToken */
    ContactToken : "contactToken"
};

/** 对应 企业微信里的 用户标签 */
const WxUserTag = {

    /** docker 标签 id。  */
    "docker" : "2" 
}

module.exports = {
    /** token 类型 */
    "TokenType": TokenType ,

    /** 对应 企业微信里的 用户标签 */
    "WxUserTag" : WxUserTag
};