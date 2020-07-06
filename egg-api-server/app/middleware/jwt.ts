const { outLoginTokenKey } = require('../utils');

const JWT = require('jsonwebtoken');

module.exports = (options, app) => {
  return async function(ctx, next) {
    // 拿到传会数据的header 中的token值
    const token = ctx.request.header.authorization;

    // 当前请求时get请求，执行接下来的中间件
    if (!token || ctx.path === '/login/account') {
      if (ctx.path === '/login/account') {
        if (token) {
          // await app.controller.login.outLogin();
        }
        await next();
      } else {
        ctx.throw(401, '未登录， 请先登录');
      }
    } else { // 当前token值存在
      const redisOutLogin = await app.redis.get(outLoginTokenKey);
      const arrToken = redisOutLogin.split(',').filter(item => item);

      if (arrToken.indexOf(token) !== -1) {
        ctx.status = 401;
        ctx.body = {
          message: 'Token已失效',
        };
        return;
      }

      let decode;
      try {
        // 验证当前token
        decode = JWT.verify(token, options.secret);
        console.info('decode', decode);
        if (!decode || !decode.userId) {
          ctx.status = 401;
          ctx.body = {
            message: '401 没有权限，请登录',
          };
          return;
        }
        if (Date.now() - decode.expire > 0) {
          ctx.status = 401;
          ctx.body = {
            message: 'Token已过期',
          };
          return;
        }
        const user = await ctx.service.user.currentUser({
          userId: decode.userId,
        });
        if (user) {
          await next();
        } else {
          ctx.status = 401;
          ctx.body = {
            message: '用户信息验证失败',
          };
          return;
        }
      } catch (e) {
        console.log(e);
        ctx.status = 401;
        ctx.body = {
          message: '用户信息验证失败',
        };
        return;
      }
    }
  };
};
