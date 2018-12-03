// kao的函数必须是一个async function
const sha1 = require('sha1');
const getRawBody = require('raw-body');
const util = require('./util');

module.exports = (config) => {
    return async(ctx, next) => {
        console.log(ctx.query)
        const {signature, timestamp, nonce, echostr} = ctx.query
        const token = config.wechat.token
        let str = [token, timestamp, nonce].sort().join('')
        const sha = sha1(str)
        
        if(ctx.method === 'GET'){
            if(sha === signature) {
                ctx.body = echostr;
            }else{
                ctx.body = 'wrong';
            }
        } else if (ctx.method === 'POST') {
            if(sha !== signature) {
                return (ctx.body = 'fail');
            }

            // 接收数据包
            const data = await getRawBody(ctx.req, {
                length: ctx.length,
                limit: '1mb', // 超过1mb的数据包就扔掉
                encoding: ctx.charset
            });

            console.log(data);
            // 解析xml格式，回调方式解析
            const content = await util.parseXML(data);
            const message = util.formatMessage(content.xml);

            ctx.status = 200;
            ctx.type = 'application/xml';
            ctx.body = `
                <xml>
                    <ToUserName>
                        <![CDATA[${message.FromUserName}]]>
                    /ToUserName>
                    <FromUserName>
                        <![CDATA[${message.ToUserName}]]>
                    </FromUserName>
                    <CreateTime>
                        ${parseInt(new Date().getTime()/ 1000, 0)}
                    </CreateTime>
                    <MsgType>
                        <![CDATA[text]]>
                    </MsgType> 
                    <Content>
                        <![CDATA[${message.Content}]]>
                    </Content>
                </xml>`;
        }
        
    }
}