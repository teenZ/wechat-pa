const Koa = require('koa');
const wechat = require('./wechat-lib/middleware')
const config = require('./config/wechatConfig')

// 生成服务器实例
const app = new Koa()

app.use(wechat(config.wechat))

app.listen(config.port)
console.log('Listen: 3008')