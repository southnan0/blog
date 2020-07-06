const Koa = require('koa');
const app = new Koa();
const config = require('./project.config').default
const chalk = require('chalk')

app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(config.port);
console.info(chalk.green(`当前端口：${config.port}`));
