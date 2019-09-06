//@ts-check

const Controller = require('egg').Controller;

class HookApiController extends Controller {

  /**
   *接受 gitlab 的 推送消息，并转发到 对应的 企业微信聊天机器人的接口
   * @memberof HookApiController
   */
  async gitHook() {
    const { ctx , logger  } = this;
    const request = ctx.request;
    // logger.info(JSON.stringify(request.body));
    try {
      const gitlab_token = ctx.get("X-Gitlab-Token");
      const gitlab_event = ctx.get("X-Gitlab-Event");
      logger.debug("headers: ",JSON.stringify(ctx.headers));
      logger.debug(`gitlab_token:${gitlab_token} . gitlab_event:${gitlab_event}`);
      if(!gitlab_token){
        ctx.status = 403;
        ctx.body = "request invalid. please provide X-Gitlab-Token . ";
        return ;
      }
      const gitlabMsg = request.body;
      const tokenProject = this.config.tokenKeyMap[gitlab_token];
      logger.debug(`tokenProject:` , tokenProject);
      if(tokenProject == undefined){
        logger.info(`gitlab_token : ${gitlab_token} 不合法。未找到对应的企业微信机器人的配置.`);
        // ctx.status = 403;
        // ctx.body = `gitlab_token : ${gitlab_token} 不合法。未找到对应的企业微信机器人的配置. `;
        // return ;
      }
      else{
        const result = await this.service.qywxBotApi.pushGitLabMsg(tokenProject , gitlabMsg);
        logger.info(`push over.`, result);
      }
     
      //判断是否是 release 分支的 事件， 如果是， 那么 要调用 buildServer 进行打包的操作。
      let ref   = gitlabMsg.ref   || "";
      let after = gitlabMsg.after || "";
      this.logger.info(`ref:[${ref}] , after:[${after}]`);

      if( ref.indexOf('release/') > 0 && after != "0000000000000000000000000000000000000000" ){
          //ref 不包含 release 或者 after == 0000000000000000000000000000000000000000 ， 代表不用打包镜像
          //根据 打包服务启动之后， 注册到本系统里的状态， 调度一个合适的打包服务器 进行打包操作。
          const imageBuildReq = {
            "after_commit_id" : after ,
            "project_name": gitlabMsg.project.name,
            "repo_ssh_url": gitlabMsg.project.git_ssh_url,
            "ref"         : gitlabMsg.ref
          };
          await  this.service.buildServer.dispatch_job(imageBuildReq);
      }
      ctx.body = {"success":true};

    } catch (err) {
      logger.error(err);
      ctx.body = {"success":false};
    }
  }
}

module.exports = HookApiController;
