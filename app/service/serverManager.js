//@ts-check
const path = require("path");
const Service = require('egg').Service;
const execa = require("execa");
const node_ssh = require('node-ssh'); 
const fs = require("fs");
var crypto = require('crypto');
const blankReg = /\n/g;   //匹配所有空白字符串

class ServerManagerService extends Service {
  
    /**
     * 添加服务器登陆信息。
     * 生成一个 公钥私钥对，并 在远程服务器上的 `~/.ssh/authorized_keys` 里追加一个可登陆的公钥内容 
     * @param {ServerLoginInfo} currentUserServerLoginInfo  当前用户的服务器登陆信息 。 其中包含 ip 端口  私钥 私钥密码 
     * @param {string}          newPassphrase               指定的新生成的私钥的密码
     * @param {string}          usesId                      用户的id
     * @param {string}          userName                    用户的名字 ，会写入到 公钥 的备注 里面
     * @returns {Promise<NewLoginInfoResp>}
     */
    async add_server_login(currentUserServerLoginInfo , newPassphrase , usesId, userName) {
        //todo: 调用本函数前 要 检查 当前登陆用户 是否 是当前服务器的创建者.
        this.logger.debug(`add_server_login.`);
        //先构造 好 密钥对的文件名
        const cert_pri_path = path.join(this.app.baseDir , "data", "cert" , usesId );
        const cert_pub_path = path.join(cert_pri_path , ".pub");
        
        //生成 密钥对
        this.logger.info(`生成的文件名: cert_pri_path:[${cert_pri_path}] , cert_pub_path:[${cert_pub_path}`);
        const generateResult = await await execa(`ssh-keygen`, ["-f" , cert_pri_path , '-N' , newPassphrase , '-C' , userName ] );
        if(generateResult.code != 0){
            this.logger.error(`生成密钥对出错.`);
            throw new Error(generateResult.stderr);
        }
        this.logger.debug(`密钥对生成成功。后续将 登陆远程服务器 ， 并追加公钥的内容。`);
        const ssh = new node_ssh();
        
        try {
            //使用 sshOption 登陆 远程服务器
            const sshOption = this._getSshOption(currentUserServerLoginInfo);
            await ssh.connect(sshOption);
            this.logger.debug(`远程 服务器 ssh 已经连接成功。`);
            const pubKey = fs.readFileSync(cert_pub_path).toString().replace(blankReg,"");
            //计算出 公钥的 md5
            const pubKeyMd5 = crypto.createHash('md5').update(pubKey).digest('hex');
            this.logger.debug(`pubKeyMd5:[${pubKeyMd5}]`);

            //追加到  ~/.ssh/authorized_keys 内
            //todo: 要前确保 远程服务器 存在 ~/.ssh/authorized_keys 文件。目前先假设 存在.
            await ssh.execCommand(`echo '${pubKey}' >> ~/.ssh/authorized_keys`);
            this.logger.debug(`在远程服务器上 ~/.ssh/authorized_keys 里，公钥 追加完成.`);
            // 删除本地的 公钥和私钥
            await execa(`rm`, ["-rf" , `${cert_pri_path}*`] );
            this.logger.info(`本地的密钥对已经删除`);
            return {
                privateKey : fs.readFileSync(cert_pri_path).toString(),
                publicKeyMd5 : pubKeyMd5
            }
        } catch (error) {
            throw error;
        }
        finally{
            this.logger.info(`ssh 对象已经丢弃`);
            ssh.dispose();
        }
        /*todo: 调用方后续需要: 
        1. 给被授权的用户 ，发送一个 悦智管理的 应用消息， 告知 加密密钥 和 私钥密码。
        2. 生成 server_auth 记录并插入数据库。  。
        */ 
    }
    
    /**
     * 根据传递的 currentUserServerLoginInfo 参数的 信息， 构造 ssh 的 option
     *
     * @param {ServerLoginInfo} currentUserServerLoginInfo
     * @memberof ServerManagerService
     */
    _getSshOption(currentUserServerLoginInfo){
        //#region 返回对象类似
        /**         
        {
            host      : '117.48.228.173',
            username  : 'root',
            port      : 22,
            privateKey: '/root/code/test-execa/com_common_rsa',
            passphrase: "13622228504"
        } */
        //#endregion

        //sshOption 的公用信息
        const sshOption = {
            host : currentUserServerLoginInfo.ip ,
            username : currentUserServerLoginInfo.user,
            port : currentUserServerLoginInfo.port 
        };
        this.logger.debug(`sshOption: [${currentUserServerLoginInfo.user}@${currentUserServerLoginInfo.ip}:${currentUserServerLoginInfo.port}.]`);

        // sshOption 的敏感信息。 根据 currentUserServerLoginInfo 的登陆方式，对 sshOption 的属性赋值
        if(currentUserServerLoginInfo.cert != ""){
            sshOption.privateKey = currentUserServerLoginInfo.cert ;
            this.logger.debug(`sshOption.privateKey.length:${sshOption.privateKey.length}`);
        }
        if(currentUserServerLoginInfo.cert_pwd != ""){
            sshOption.passphrase = currentUserServerLoginInfo.cert_pwd ;
            this.logger.debug(`sshOption.cert_pwd.length:${sshOption.cert_pwd.length}`);
        }
        if(currentUserServerLoginInfo.pwd != ""){
            sshOption.password = currentUserServerLoginInfo.pwd;
            this.logger.debug(`sshOption.pwd.length:${sshOption.pwd.length}`);
        }
        return  sshOption;
    }

    /**
     * 在远程服务器上的 `~/.ssh/authorized_keys` 里 删除曾经 追加的、可登陆的公钥内容 
     *
     * @param {ServerLoginInfo} currentUserServerLoginInfo  当前用户的服务器登陆信息 。 其中包含 ip 端口  私钥 私钥密码
     * @param {string}          pubKeyMd5                   要在远程服务器上删除的 公钥的md5 值
     * @memberof ServerManagerService
     * @returns {Promise<boolean>}
     */
    async delLoginPublicKey(currentUserServerLoginInfo , pubKeyMd5){
        //todo: 调用本函数前 要 检查 当前登陆用户 是否 是当前服务器的创建者.
        
        const ssh = new node_ssh();
        try {
            //使用 sshOption 登陆 远程服务器
            const sshOption = this._getSshOption(currentUserServerLoginInfo);
            await ssh.connect(sshOption);
            this.logger.debug(`远程 服务器 ssh 已经连接成功。`);

            //从远程 服务器 拿到 ~/.ssh/authorized_keys 的内容，计算每一行的 md5 ， 找到匹配 与 当前公钥md5 匹配的行，删除掉此行并写入 。
            const catResult = await ssh.execCommand(`cat ~/.ssh/authorized_keys`);
            this.logger.debug(`远程 服务器 ~/.ssh/authorized_keys 的 catResult:\n ${JSON.stringify(catResult)}\n`);

            const ary = catResult.stdout.split('\n');
            if(ary.length <= 1){
                //远程服务器上可登录的公钥内容 只剩 1个或没有， 那么不用继续执行了.
                this.logger.warn(`${currentUserServerLoginInfo.ip}:${currentUserServerLoginInfo.port}上 可登录的公钥只剩一个或者没有，需人工检查.`);
                return false;
            }
            for (let i = 0; i < ary.length; i++) {
                const line = ary[i].replace(blankReg,"");
                this.logger.debug(`line:\n${line}\n`);
                const lineMd5 = crypto.createHash('md5').update(line).digest('hex');
                this.logger.debug(`pubKeyMd5:[${pubKeyMd5}]\n  lineMd5:[${lineMd5}]`);
                if(pubKeyMd5 === lineMd5){
                    this.logger.debug(`第 [${i+1}] 行 ，远程服务器 ~/.ssh/authorized_keys 里，匹配到了 md5 为${pubKeyMd5} 的公钥了，`);
                    const sedResult = await ssh.execCommand(`sed -i '${i+1}d' ~/.ssh/authorized_keys`);
                    this.logger.info(`sedResult:${JSON.stringify(sedResult)}. 指定md5 值的公钥已经删除.`);
                    break;
                }
            }
            ssh.dispose();
            this.logger.info(`ssh 对象已经丢弃`);
        } catch (error) {
            throw error()
        }
        /*todo: 调用方后续需要: 
        1. 给 这个 用户 ，发送一个 悦智管理的 应用消息， 告知 登陆信息已经被删除。
        2. 删除对应的  server_auth 记录  。
        */ 

    }
}

module.exports = ServerManagerService;
