//@ts-check
const path = require("path");
const fs = require("fs");
'use strict';

const Service = require('egg').Service;


class BuildServerService extends Service {
    
    /**
     * 根据 打包服务器的状态， 选择一个合适的打包服务器，分配打包任务.
     * @param {ImageBuildReq} req 镜像打包的请求数据
     * @returns {Promise<boolean>} 任务调度是否成功
     */
    async dispatch_job(req){
        this.logger.debug(`dispatch_job: req: ${JSON.stringify(req)}`);
        /**
         * 调用此方法有两个场景:
         * 1. 由 hookApi 收到了 gitlab 的消息后， 直接调用此函数。
         * 2. 由 定时任务 定时调用
         * 
         * 在第一个场景下， 由于任务肯定是新的， 即 dispatchJob 的缓存文件里肯定没有这个任务
         * 在第二个场景下， 定时任务 首先从 dispatchJob 的缓存文件里 pop 一个 任务，也意味着 dispatchJob 的缓存文件里，肯定没有这个任务
         * 
         * 所以，调用此函数时，dispatchJob里肯定没有这个任务。
         * 所以 ， 本函数的逻辑是: 找到一个 打包服务器， 未找到， 就需要push 到 dispatchJob 文件里
         * 如果找到， 但调用打包接口后返回未调度成功，也需要 push 到 dispatchJob 文件里。
         */
        const item = await this.getOneBuildServer();
        const job = {
            time: this.ctx.helper.nowTimeStr(),
            id  : req.after_commit_id,
            data: req
        };
        if(item == null){
            this.logger.warn(`暂无可用打包服务器.`);
            //todo:  1. 发个消息 给 悦智管理的企业微信应用。 2.  要缓存起来， 后续再调度。
            
            this.service.dispatchJob.push(job);
            return false;
        }
        else {
            //调用 打包服务器的接口。如果调用失败， 那么，也要缓存起来，后续再调度。
            //todo: 实现 build-service 的接口。填写合适的url.
            const result = await this.ctx.curl(`http://${item.host}/api/build-img` , {
                "method"     : "POST",
                "contentType": "json",
                "dataType"   : "json",
                "data"       : req
            });
            //根据状态码判断是否调用成功.如果失败， 也要 push 到缓存里
            if(result.status != 200){
                this.service.dispatchJob.push(job);
                return false;
            }
            else{
                this.logger.info(`任务调度成。任务信息: ${JSON.stringify(req)} \n 打包服务器:${JSON.stringify(item)}\n`);
                /*
                    这个任务可能在后续会失败。但此时又未存储任务信息。即没办法恢复。
                    如果调度失败， 是否需要重新调度？
                    一次失败， 可能不止一次失败， 如果重新调度， 那么是不是会死循环，如何避免？

                    决定： 失败之后， 由打包服务器 通知，然后把通知转发给企业微信的悦智管理应用,由相关人员人工处理。
                */
                return true;
            }
        }
    }

    /**
     * 获取一个 打包服务器
     * @returns {Promise<BuildServerRegisterReq>}
     */
    async getOneBuildServer(){

        /**
         * 根据 load_rate ，比较 两个 对象
         *
         * @param {BuildServerRegisterReq} a
         * @param {BuildServerRegisterReq} b
         * @returns {number}
         */
        function compare(a, b) {
            if(a.load_rate < b.load_rate){
                return -1 ;
            }
            if(a.load_rate > b.load_rate){
                return 1;
            }
            return 0;
        }


        const buildServerList = await this._getAllRegisterState();
        buildServerList.sort(compare);  //排序之后， 最大的在最后面
        const item = buildServerList.shift();
        //保存 buildServerList 对象 . 不论怎样， 这个服务器 暂时是不用了。
        this._saveAllRegisterState(buildServerList);
        return item;
    }

    /**
     * 更新 状态. 状态数据 会 持久化到 文件中。实现 eggjs 各 worker 之间的数据共享
     * @param {BuildServerRegisterReq} registerReq 注册服务的请求对象
     */
    async updateState(registerReq) {
        //先从 文件里 拿出 所有的 打包服务器的状态信息
        const allStateList = await this._getAllRegisterState();
        registerReq.update_time = this.ctx.helper.nowTimeStr();
        const current = allStateList.find( t => {return t.host == registerReq.host});
        if(current == null){
            allStateList.push(registerReq)
        }
        else{
            current.update_time = registerReq.update_time;
            current.load_rate = registerReq.load_rate;
        }
        this._saveAllRegisterState(allStateList);
    }

    /**
     * 所有服务器的状态 的记录文件
     */
    get _registerStateFilePath(){
        return path.join(this.app.baseDir , "data" , "build-server-state.json");
    }


    /**
     * 获取当前的所有服务器的状态
     * @returns {Array<BuildServerRegisterReq>}
     */
    _getAllRegisterState() {
        const filePath = this._registerStateFilePath;
        if(fs.existsSync(filePath)){
            return JSON.parse(fs.readFileSync(filePath).toString());
        }
        else{
            return [];
        }
    }

    /**
     * 保存到文件
     * @param {Array<BuildServerRegisterReq>} allStateList 
     */
    _saveAllRegisterState(allStateList){
        const filePath = this._registerStateFilePath;
        //直接覆盖
        const content = JSON.stringify(allStateList , null ,4);
        fs.writeFileSync(filePath , content);
    }

    
}

module.exports = BuildServerService;
