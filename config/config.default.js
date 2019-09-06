/* eslint valid-jsdoc: "off" */

'use strict';
const path = require("path");

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = 'adfasdfasdf_1566994071635_5316';

  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'DEBUG',
    // allowDebugAtProd: true
  };

  config.security = {
    csrf: {
      ignore : [ "/api/"  ]
    }
  };

  // add your middleware config here
  config.middleware = [ 'check' ];

  config.view = {
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.nj',
    mapping: { '.nj': 'nunjucks', },
    root: path.join(appInfo.baseDir, 'app/view')
  };

  //配置数据库
  config.sequelize = {
    dialect : 'postgres',
    database:  process.env.DB_NAME , //'yue_manage',
    host    :  process.env.DB_HOST , //'127.0.0.1',
    port    :  process.env.DB_PORT , //5432,
    username:  process.env.DB_USER , //'dbuser',
    password:  process.env.DB_PWD ,  //'pass_2019',
  };

  //模板渲染
  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    "site_url": "https://git-hook.isecsp.com",

    /** 企业微信 悦智管理 app 的配置 */
    "qywx":{
      
      /** 企业id */
      "corp_id":"ww14b5a9d19e4f719a",

      /** 企业微信 通讯录 secret */
      "contact_sync_secret": "sIrLSVSFKoBBSM4NDege8u1Vn0VydlS_D5s2G9Oi9WM"   , 

      /** 应用的id */
      "agentId": "1000003" ,

      /** 应用的 secret */
      "secret": "w5IlWWXJD8e0-mFv4PibSGInH5mCbhTaZmCeHGbb4F0"                  
    },

    /** x-gitlab-token 与 企业微信 群之间的对应关系 */
    tokenKeyMap: {
      "lingduzhe"      : { "project": "领读者项目",    "qw_key":"dbed4697-d204-491f-9edc-2f62d943ab46" },
      "tbg"            : { "project": "tbg项目",      "qw_key":"77d42c42-6c75-4484-a8a2-8adaccb9e1c7" },
      "eos_information": {"project": "EOS资讯网项目",  "qw_key":"e2946249-c008-4d21-8da5-9fba0d3af446" }
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
