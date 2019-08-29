# yuezhi-manage-web

[悦智管理系统](http://git.isecsp.com/yuezhi/manage/web)

本系统有如下两部分功能：

1. 管理悦智公司的各个服务器信息
2. 提供一个 hook-api . 由 gitlab 调用。 
    当有 hook 调用时， 根据配置， 向 企业微信推送消息。
    另外，如果是 release 的 hook 调用， 那么会分发docker打包请求到打包服务器.

整个管理系统， 除了本网站之外，还有:

1. [docker-build-service](http://git.isecsp.com/yuezhi/manage/docker-build-service)
    用于接受本网站提供打包任务，执行打包操作。  

2. [dev-tool](http://git.isecsp.com/yuezhi/manage/dev-tool)
    用于开发过程中辅助开发工具

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