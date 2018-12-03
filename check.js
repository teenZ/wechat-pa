const Koa = require('koa');
const sha1 = require('sha1');
const config = {
    wechat:{
        appID: 'wx093716081ea28c7e',
        appSecret: 'a8b0fb3c74496b3676bc3af45b07bf45',
        token: 'getyourfingersoutofmypie'
    }
}

const app = new Koa()

app.use(async(ctx, next) => {
    console.log(ctx.query)
    const {signature, timestamp, nonce, echostr} = ctx.query
    const token = config.wechat.token
    let str = [token, timestamp, nonce].sort().join('')
    const sha = sha1(str)

    if(sha === signature) {
        ctx.body = echostr
    }else{
        ctx.body = 'wrong'
    }
})

app.listen(3008)
console.log('Listen: 3008')