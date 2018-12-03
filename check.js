const Koa = require('koa');
const wechat = require('./wechat-lib/middleware')
const config = require('./config/wechatConfig')

// 生成服务器实例
const app = new Koa();

// 最外层的中间件，负责所有中间件的错误处理
const handler = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
        message: err.message
        };
    }
};

// app.use(handler);
app.use(wechat(config.wechat))

app.listen(config.port)
console.log('Listen: ' + config.port)