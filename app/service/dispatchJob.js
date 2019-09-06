//@ts-check
const path = require("path");
const fs = require("fs");
const Service = require('egg').Service;

class DispatchJobService extends Service {
  
    /**
     * 弹出一个 job
     * @returns {DispatchJob}
     */
    pop() {
        const allJob = this._getAllJob();
        const last = allJob.pop();
        this._saveAll(allJob);
        return last ;
    }
    

    /**
     * 压入一个 job
     * @param {DispatchJob} job 
     */
    push(job){
        const allJob = this._getAllJob();
        allJob.push(job);
        this._saveAll(allJob);
    }
    
    get _dispatchJobFile(){
        return path.join(this.app.baseDir , "data" , "dispatch-job.json");
    }

    /**
     * 获取所有job
     * @returns {Array<DispatchJob>}
     */
    _getAllJob() {
        const filePath = this._dispatchJobFile;
        if(fs.existsSync(filePath)){
            return JSON.parse(fs.readFileSync(filePath).toString());
        }
        else{
            return [];
        }
    }

     /**
     * 保存到文件
     * @param {Array<DispatchJob>} allJob 
     */
    _saveAll(allJob){
        const filePath = this._dispatchJobFile;
        //直接覆盖
        const content = JSON.stringify(allJob , null ,4);
        fs.writeFileSync(filePath , content);
    }
}

module.exports = DispatchJobService;
