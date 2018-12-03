// koa的函数必须是一个async function
const sha1 = require('sha1');
const getRawBody = require('raw-body');
const util = require('./util');

module.exports = (config) => {
    return async(ctx, next) => {
        // console.log(ctx.query);
        const {signature, timestamp, nonce, echostr} = ctx.query;
        const token = config.token;
        let str = [token, timestamp, nonce].sort().join('')
        const sha = sha1(str);
        if(ctx.method === 'GET'){
            // console.log("get");
            if(sha === signature) {
                ctx.body = echostr;
            }else{
                ctx.body = 'failed';
            }
        } else if (ctx.method === 'POST') {
            // console.log("post")
            if(sha !== signature) {
                console.log("what ??? not equal????")
                return (ctx.body = 'failed');
            }

            // 接收数据包
            const data = await getRawBody(ctx.req, {
                length: ctx.length,
                limit: '1mb', // 超过1mb的数据包就扔掉
                encoding: ctx.charset
            });

            // console.log(">>>>>>>>>>>>>>>");
            // console.log(data);
            // 解析xml格式，回调方式解析
            const content = await util.parseXML(data);
            // console.log("content: >>>>>>>>")
            // console.log(content)
            const message = util.formatMessage(content.xml);
            // console.log("message: >>>>>>>>>>>>>>>>>")
            // console.log(message);
            ctx.status = 200;
            ctx.type = 'application/xml'; // 返回的格式
            let xml = `<xml>
                <ToUserName>
                    <![CDATA[${message.FromUserName}]]>
                /ToUserName>
                <FromUserName> 
                    <![CDATA[${message.ToUserName}]]>
                </FromUserName>
                <CreateTime>
                    ${parseInt(new Date().getTime()/ 1000, 0) + ''}
                </CreateTime>
                <MsgType>
                    <![CDATA[text]]>
                </MsgType> 
                <Content>
                    <![CDATA[${message.Content}]]>
                </Content>
            </xml>`;
            // console.log(xml);
            ctx.body = `<xml><ToUserName><![CDATA[${message.FromUserName}]]></ToUserName><FromUserName><![CDATA[${message.ToUserName}]]></FromUserName><CreateTime>${parseInt(new Date().getTime()/ 1000, 0) + ''}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${message.Content}]]></Content></xml>`;
            console.log(ctx.body);
        }
        
    }
}