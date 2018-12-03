// 微信回复的业务逻辑

exports.reply = async(ctx, next) => {
    const message = ctx.weixin;

    if(message.MsgType = 'text') {
        let content = message.Content;
        let reply = "sorry, don't understand";

        if(content === '1'){
            reply = "大哥LEO";
            return;
        }

        if(content === '2'){
            reply = '二哥YOUNG';
        }

        ctx.body = reply;

        await next();
    }
}