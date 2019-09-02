# yuezhi-manage-web

[悦智管理系统](http://git.isecsp.com/yuezhi/manage/web)

本系统有如下两部分功能：

1. 管理悦智公司的各个服务器信息
2. 提供一个 hook-api . 由 gitlab 调用。 
    当有 hook 调用时， 根据配置， 向 企业微信推送消息。
    另外，如果是 release 的 hook 调用， 那么会分发docker打包请求到打包服务器.

整个解决方案， 除了本网站之外，还有:

1. [docker-build-service](http://git.isecsp.com/yuezhi/manage/docker-build-service)
    用于接受本网站提供打包任务，执行打包操作。  

2. [dev-tool](http://git.isecsp.com/yuezhi/manage/dev-tool)
    用于开发过程中辅助开发工具

## 本网站 主要接入 企业微信。
    本网站， 使用 企业微信扫码 / 或者 企业微信网页授权 方式，实现登陆。
    本网站定时从  企业微信的通讯录 API 获取 所有员工，并写入到系统里的账户信息表里。
    企业微信里， 需要维护一些标签。标签名 是 项目的名字， 然后，参与项目的员工， 都打上 此项目名的 标签
    需要发送消息的时候，根据标签， 给相应的员工发送消息。
      

## 服务器管理功能

    列表显示当前登陆用户的 服务器。
    1. 用户自己添加的服务器。
    2. 被授权的 服务器。

    查看/下载 服务器的登陆信息 ， 需要再次验证当前用户的密码。

### 添加服务器

    1. 服务器的信息。
        a. 名称， 所处机房，
        b. 配置 ，
        c. 部署的模块
         c.1 业务代码 相关git 仓库 ，部署位置
         c.2 基础组件 例如 redis , pg , rabbitmq ，以及相关修改过的配置

    2. 服务器的登陆信息
        a. IP 、端口 。 
        b. 用户名 密码 ， 或者 用户名 证书
        c. 其他需要备注的信息

    3. 服务器的用户授权

## 技术选型

    使用 egg-js 作为服务器框架。
    1. 非敏感数据， 使用服务器渲染的形式， 渲染页面。
    2. 前端 提交的数据 ， 以及敏感数据，使用 ajax 从接口获取。
    3. 敏感数据在保存时，客户端 要先输入 加密密码， 在接口， 要使用密码，解码用于存储数据的数据加密的密码，然后对提交的信息进行加密， 并存储到 数据库 里。
    4. 每次查看 敏感 信息， 都需要提交 加密密码密码 ，接口使用密码解开用于存储数据的数据加密的密码，然后对数据进行解密。



## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.

- Use `npm test` to run unit test.

- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

  


[egg]: https://eggjs.org