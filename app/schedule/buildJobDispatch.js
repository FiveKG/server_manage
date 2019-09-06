//@ts-check


module.exports = {
    schedule: {
        interval : '30s',      // 30秒间隔
        immediate: true,
        type     : 'worker',   // 只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
    },

    /**
     * 
     * @param {Egg.Context} ctx 
     */
    async task(ctx) {
        //每隔30秒 调用一次， 从 文件里 读取哪些 任务 还没有调度，拿到一个还未调度的任务之后，
        //调用 buildService.dispatch_job 方法， 如果返回调度失败， 那么还要继续放入文件。如果返回调度成功， 
        const lastJob = ctx.service.dispatchJob.pop();
        if(lastJob != null){
            const flag = await ctx.service.buildServer.dispatch_job(lastJob.data);
            if(flag){
                ctx.logger.info(`调度成功.job:[${JSON.stringify(lastJob)}]`);
            }
        }
        else{
            ctx.logger.debug(`当前没有任务需要调度`);
        }
    },
};