//@ts-check
'use strict';

const Service = require('egg').Service;
const { WxUserTag } = require("../service/constantData.js");

/**
 * 打包的服务， 分布在 其他各个公有云的 服务器上。
 * 打包 启动之后 ， 需要先向本接口注册，本接口记录 打包服务器 的信息
 * 
 * 在 git hook 的api 里， 判断需要进行打包的操作之后， 则根据本接口记录的 打包服务器的信息(性能，是正在打包 等等)
 * 把打包任务分发给合适的 打包服务。
 * 
 * 打包服务 在打包工作进行的过程中， 把进度信息 提交到 进度通知的接口，进度通知的接口，设置 打包服务 的状态信息，为后续的打包请求做准备
 */

class BuildServerService extends Service {
    
    /**
     * 打包服务注册接口
     * @memberof BuildServerService
     */
    async register() {
        //接受打包服务器的注册消息。记录打包服务器的信息。
        const { logger , ctx , service } = this;
        const body = ctx.request.body;
        logger.debug(`regisger:`, body);

        // build-server 定时调用本接口 ， 本接口把build-server 的信息缓存起来。
        await service.buildServer.updateState(body);
        ctx.body = {
            "code" : 0 ,
            "yuezhi_manage_url":this.config.site_url ,
            "msg" : "success"
        };
        ctx.status = 200;
    }

    /**
     * 打包服务的进度通知
     *
     * @memberof BuildServerService
     */
    async notify(){
        // 接受打包服务的状态通知，然后把通知通过 “悦智管理”  企业微信的 应用 ， 发送通知消息。通知的内容有如下几类:
        // 1. 任务接受。例如: 任务的简要描述，使用什么账户，打包哪个分支的代码 等等  。此时：  转发消息  设置 打包服务器的状态
        // 2. 任务中间消息，例如: 开始从 git 下载分支。 开始打包， 打包中的日志 等等 。此时 ，转发消息
        // 3. 任务完成，例如： 打包完成 ， 打包失败 。     设置 打包服务器的状态      此时， 转发消息  设置 打包服务器的状态
        const { ctx , logger , service } = this;
        const { prj_name , state , content } = ctx.request.body ;  
        /** state: accept 任务确认接受 ,  processing 正在处理任务 , success 任务成功处理 ， failed 任务处理失败 */
        logger.debug(`收到消息 prj_name:[${prj_name}] , state:[${state}] , content:${content}`);
        const markdownContent= `
## ${prj_name} 的镜像打包任务消息通知
### 类型: ${state} .
### 详情:${content}
`;
        await service.qywxApi.sendMarkdownMessage(markdownContent ,null ,null,null, WxUserTag.docker);

        switch (state) {
            case "accept":
                
                break;
            case "processing":
                
                    break;
            case "success":
                    const successMsg = `<font color=\"warning\">${prj_name}</font> <font color=\"warning\">可以部署了</font>  `;
                    await service.qywxApi.sendMarkdownMessage(successMsg ,null ,null,null, WxUserTag.docker);
                    break;
             case "failed":
                    const warningMsg = `<font color=\"info\">${prj_name}</font> \`打包失败。\`  `;
                    await service.qywxApi.sendMarkdownMessage(warningMsg ,null ,null,null, WxUserTag.docker);
                    break;
            default:
                break;
        }

        ctx.status = 204;
    }
}

module.exports = BuildServerService;
