/** 企业微信 获取 Access Token 接口的响应结构 */
interface WxAccessTokenResp{
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
interface WxUserResp{

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