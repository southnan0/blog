import { Controller } from 'egg';
import { outLoginTokenKey } from '../utils';
const JWT = require('jsonwebtoken');

export default class LoginController extends Controller {
  public async account() {
    const { ctx } = this;
    // const rule = {
    //   userName: { type: 'string', required: true, message: '必填项' },
    //   password: { type: 'string', required: true, message: '必填项' },
    // };
    // const loginMsg = ctx.request.body;
    // await ctx.validate(rule, loginMsg); // 验证登陆信息是否合法
    // // 为当前输入的密码加密
    // loginMsg.password = ctx.helper.encrypt(loginMsg.password);
    // // 从service文件中拿到返回结果
    // const result = await ctx.service.user.login(loginMsg);
    // ctx.body = result;

    console.info(ctx.request.body);
    ctx.body = await ctx.service.login.doLogin(ctx.request.body);
  }

  public async currentUser() {
    const { ctx } = this;

    let decode = {};
    try {
      decode = JWT.verify(ctx.request.header.authorization, this.config.jwt.secret);
    } catch (e) {
      console.info('currentUser error:', e);
    }

    ctx.body = await ctx.service.user.currentUser(decode);
  }

  public async outLogin() {
    const { ctx } = this;

    const str = await this.app.redis.get(outLoginTokenKey) || [];

    const arr = str.split(',').filter(item => item);
    console.info(111, arr);
    arr.push(ctx.request.header.authorization);


    await this.app.redis.set(outLoginTokenKey, arr.join(','));

    ctx.body = { data: {}, success: true };
  }
}
