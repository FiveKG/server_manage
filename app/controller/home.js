'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;

  
    const viewOptions = {
      layout: 'layout.html'
    };
    const local = {
      data: 'layout.html'
    };
    
    
    await ctx.render('index.html',local,viewOptions);

  }
}

module.exports = HomeController;
