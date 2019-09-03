//@ts-check

const Service = require('egg').Service;

class QywxBotApiService extends Service {
  
  /**
   * 推送 构造的消息到 企业微信的聊天机器人
   * @param {string} pushKey
   * @param {qwTextMessage | qwMarkdownMessage} qwMessage 
   */
  async push(pushKey,  qwMessage) {
    const result = await this.app.curl(`${this.config.qw_push_url}?key=${pushKey}`, {
      method: 'POST',
      contentType: 'json',
      data: qwMessage,
      // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
      dataType: 'json',
    });
    return result;
  }

  /**
   * 推送 markdown消息到 企业微信的聊天机器人
   * @param {string} pushKey 
   * @param {string} markdownContent 
   */
  async pushMarkDown(pushKey , markdownContent){
    const pushData = {
        "msgtype": "markdown",
        "markdown": { "content": markdownContent}
    }
    return this.push(pushKey , pushData);
  }
  
  /**
   * 推送 text 消息到 企业微信的聊天机器人
   * @param {string} pushKey 
   * @param {string} textContent 
   * @param {Array<string>} [mentioned_list]
   * @param {Array<string>} [mentioned_mobile_list]
   */
  async pushText(pushKey , textContent , mentioned_list , mentioned_mobile_list){
    const pushData = {
      "msgtype": "text",
      "text": { "content": textContent , "mentioned_list": mentioned_list , "mentioned_mobile_list":mentioned_mobile_list}
  }
  return this.push(pushKey , pushData);
  }

  /**
   * 推送 gitlab 的事件 到 企业微信的聊天机器人
   * @param {tokenKeyMap} tokenProject 
   * @param {gitLabTagMessage} gitLabPushInfo 
   */
  async pushGitLabMsg(tokenProject,  gitLabPushInfo){
    //如果 gitLabPushInfo 的内容过多， 回导致 企业微信对 推送消息拒绝。
    //对 commits 字段的内容处理一下， 生成简短的文本
    let commitMsg = gitLabPushInfo.commits.map( (t ,i ) => { 
      return `> commit ${i+1}. ${t.message }
>> 添加了:
${t.added.map( file => { return ">>> "+ file ;}).join('\n')}
--------
>> 修改了:
${t.modified.map( file => { return ">>> "+ file ;}).join('\n')}
--------
>> 删除了:
${t.removed.map( file => { return ">>> "+ file ;}).join('\n')}
`;
    }).join('\n-----\n');
        const pushData = {
          "msgtype": "markdown",
          "markdown": {
              "content": 
`## ${gitLabPushInfo.user_name} 对 ${gitLabPushInfo.project.name} 进行了 ${gitLabPushInfo.event_name} 操作 

[查看](${gitLabPushInfo.project.web_url})
message : ${gitLabPushInfo.message || "null"}
详情:
${gitLabPushInfo.total_commits_count == 0 ? "" : commitMsg}`
        }
      }
      let result = await this.push(tokenProject.qw_key , pushData);
      return result;
  }
}

module.exports = QywxBotApiService;
