'use strict';

const Controller = require('egg').Controller;

class HookApiController extends Controller {
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

    //   const tokenProject = this.config.tokenKeyMap[gitlab_token];
    //   logger.debug(`tokenProject:` , tokenProject);
    //   if(tokenProject == undefined){
    //     ctx.status = 403;
    //     ctx.body = `gitlab_token : ${gitlab_token} 不合法。未找到对应的企业微信机器人的配置. `;
    //     return ;
    //   }

    //   const result = await this.service.qwHook.pushGitLabMsg(tokenProject , request.body);  
    //   logger.info(`push over.`, result);
     
    //   // 判断是否是 Tag Push Hook . 如果是 ， 那么 意味着 要在服务器上进行打包 docker 镜像。
    //   if(gitlab_event === "Tag Push Hook") {
    //     logger.info(`start Tag Push Hook.`);
    //     this.app.runInBackground( async () => {
    //       const build_result = this.service.git.buildDockerImage(tokenProject , request.body);
    //       logger.info(`Tag Push Hook over. build_result :${build_result}`);
    //     })
    //   }

      ctx.body = {"success":true};

    } catch (err) {
      logger.error(err);
      ctx.body = {"success":false};
    }
  }
}

module.exports = HookApiController;