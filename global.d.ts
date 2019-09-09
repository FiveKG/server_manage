/** 企业微信 获取 Access Token 接口的响应结构 */
interface WxAccessTokenResp {
    /** 出错返回码，为0表示成功，非0表示调用失败 */
    errcode: number;

    /** 返回码提示语 */
    errmsg:string;

    /** 获取到的凭证，最长为512字节 */
    access_token:string;

    /** 凭证的有效时间（秒） */
    expires_in:number;

    expired_at : Date ;
}

/** 企业微信获取用户信息的响应 */
interface WxUserInfoResp{

    /** 返回码 */
    errcode : number ;

    /** 对返回码的文本描述内容 */
    errmsg:string ;

    /** 成员UserID。若需要获得用户详情信息，可调用通讯录接口 */
    UserId:string ;
}

/** 企业微信获取用户详细信息的响应 */
interface WxUserResp {

    /** 返回码 */
    errcode	:string;

    /** 对返回码的文本描述内容 */
    errmsg :string;	

    /** 成员UserID。对应管理端的帐号，企业内必须唯一。不区分大小写，长度为1~64个字节 */
    userid	:string;

    /** 成员名称 */
    name	:string;

    /** 手机号码，第三方仅通讯录应用可获取 */
    mobile	:string;

    /** 成员所属部门id列表，仅返回该应用有查看权限的部门id */
    department	: Array<number>;

    /** 部门内的排序值，默认为0。数量必须和department一致，数值越大排序越前面。值范围是[0, 2^32) */
    order	: Array<number>;

    /**  职务信息；第三方仅通讯录应用可获取*/
    position	:string;

    /** 性别。0表示未定义，1表示男性，2表示女性 */
    gender	:string;

    /**  邮箱，第三方仅通讯录应用可获取*/
    email	:string;

    /** 表示在所在的部门内是否为上级。；第三方仅通讯录应用可获取 */
    is_leader_in_dept	:bool ;

    /** 头像url。注：如果要获取小图将url最后的”/0”改成”/100”即可。第三方仅通讯录应用可获取 */
    avatar	: string ;

    /** 座机。第三方仅通讯录应用可获取 */
    telephone	:string ;

    /** 成员启用状态。1表示启用的成员，0表示被禁用。注意，服务商调用接口不会返回此字段 */
    enable	: number ;

    /** 别名；第三方仅通讯录应用可获取 */
    alias	 :string;

    /** 扩展属性，第三方仅通讯录应用可获取 */
    extattr	 : object ;

    /** 激活状态: 1=已激活，2=已禁用，4=未激活。已激活代表已激活企业微信或已关注微工作台（原企业号）。未激活代表既未激活企业微信又未关注微工作台（原企业号）。 */
    status	: number;
    
    /** 员工个人二维码，扫描可添加为外部联系人(注意返回的是一个url，可在浏览器上打开该url以展示二维码)；第三方仅通讯录应用可获取 */
    qr_code	: string ;

    /** 成员对外属性，字段详情见对外属性；第三方仅通讯录应用可获取 */
    external_profile	:object;

    /** 对外职务，如果设置了该值，则以此作为对外展示的职务，否则以position来展示。 */
    external_position	: string ;

    /** 地址。 */
    address	 : string;
    

}

/** token 和 key 的 映射 */
interface tokenKeyMap {
    /** 项目名字 */
    project : string ;

    /** key */
    qw_key : string;

}

/** gitlab 推送的消息结构 */
interface gitLabTagMessage{
    object_kind        : string ;
    event_name         : string ;
    before             : string ;
    after              : string ;
    ref                : string ;
    checkout_sha       : string ;
    message            : string ;
    user_id            : number ;
    user_name          : string ;
    user_email         : string ;
    project_id         : number ;
    project            : gitLabProject ;
    commits            : Array<repoCommit> ;
    total_commits_count: number ;
    push_options       : Array<any> ;
    repository         : gitLabRepo ;
}

/** gitlab 的项目结构 */
interface gitLabProject{
    id                 : number ;
    name               : string ;
    description        : string ;
    web_url            : string ;
    avatar_url         : string ;
    git_ssh_url        : string ;
    git_http_url       : string ;
    namespace          : string ;
    visibility_level   : number ;
    path_with_namespace: string ;
    default_branch     : string ;
    ci_config_path     : string ;
    homepage           : string ;
    url                : string ;
    ssh_url            : string ;
    http_url           : string ;
}

/** 项目的 签入的结构 */
interface repoCommit{
    id       : string ;
    message  : string ;
    timestamp: Date ;
    url      : string ;
    author   : authorObj ;
    added    : Array<string> ;
    modified : Array<string>;
    removed  : Array<string>;
}

interface authorObj {
    name : string ;
    email: string ;
}

interface gitLabRepo {
    name            : string ;
    url             : string ;
    description     : string ;
    homepage        : string ;
    git_http_url    : string ;
    git_ssh_url     : string ;
    visibility_level: number ;

}

interface qwTextMessage{
    /** 消息类型，此时固定为text */
    msgtype : string;

    /** 文本内容，最长不超过2048个字节，必须是utf8编码 */
    text : textMessage;    
}

interface textMessage {
    /** 文本内容，最长不超过2048个字节，必须是utf8编码 */
    content : string ;

    /** userid的列表，提醒群中的指定成员(@某个成员)，@all表示提醒所有人，如果开发者获取不到userid，可以使用mentioned_mobile_list */
    mentioned_list? : Array<string>;

    /** 手机号列表，提醒手机号对应的群成员(@某个成员)，@all表示提醒所有人 */
    mentioned_mobile_list? : Array<string>;
}

interface qwMarkdownMessage{
    /** 消息类型，此时固定为markdown */
    msgtype : string ;

    /** markdown内容，最长不超过4096个字节，必须是utf8编码 */
    markdown : markdownMessage ;
}

interface markdownMessage {
    /** markdown内容，最长不超过4096个字节，必须是utf8编码 */
    content : string ;
}


/** 打包服务注册请求 */
interface BuildServerRegisterReq{
    /** 打包服务的主机地址 */
    host : string ;

    /** 打包服务器 的 负载 数 */
    load_rate: number;

    /** 状态的 更新的时间 */
    update_time : string;
}

/** 镜像打包请求的数据结构 */
interface ImageBuildReq{
    
    /** gitlab message 里 after 属性的值  */
    after_commit_id : string;

    /** 项目的名称 */
    project_name :string ;

    /** 项目的 git 地址(ssh 地址) */
    repo_ssh_url: string ;

    /** 打包的分支信息 */
    ref : string;
    /** 类型 */
    type: string;
}

/** 任务分配的数据 */
interface DispatchJob {

    /** 任务缓存的时间 */
    time : string;

    /** 任务的 id */
    id : string ; 

    /** 任务的数据 */
    data : ImageBuildReq;
}


/** 服务器登陆信息 */
interface ServerLoginInfo{
    ip:string ;

    port:number;

    user:string ;

    cert: string ;

    cert_pwd: string;

    pwd? : string ;
}

/** 新生成的登陆信息的返回对象结构 */
interface NewLoginInfoResp{
    /** 私钥的内容 */
    privateKey : string ;

    /** 公钥的 md5 */
    publicKeyMd5 : string ;
}