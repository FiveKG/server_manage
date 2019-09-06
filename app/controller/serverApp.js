'use strict';

const Controller = require('egg').Controller;

class ServerAppController extends Controller {
  async index() {
    const {ctx}    = this.ctx
          ctx.body = 'ServerApp'
  }
}

module.exports = ServerAppController;
