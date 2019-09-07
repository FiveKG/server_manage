'use strict';

const Controller = require('egg').Controller;

class ServerAuthController extends Controller {
  async index() {
    const {ctx} = this.ctx
    ctx.body = 'server_auth'
  }
}

module.exports = ServerAuthController;
