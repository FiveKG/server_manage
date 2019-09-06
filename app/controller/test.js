'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
  async index() {
    console.log('asssssss')
    await this.ctx.render('test.html')
  } 
}

module.exports = TestController;
