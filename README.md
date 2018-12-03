# wechat-pa
试一试公众号开发吧  
微信公众号分类：订阅号、服务号(多支付功能)、企业号

ref:  
1 https://mp.weixin.qq.com/wiki  
2 廖雪峰《koa入门》


安装 mongodb  
安装 内网穿透工具 花生壳-魔法隧道-Ngrok  
微信接口测试号申请：微信公众平台技术文档 -> 开始开发 -> 申请


wechat-lib：和wechat api调用的相关的中间件

微信接收的信息类型及内容： 
第一类 普通消息   
1、文本消息  
2、图片消息  
3、语音消息  
4、视频消息  
5、小视频消息  
6、地理位置消息  
7、链接消息   

第二类 用户主动触发的一些事件

微信推消息是POST，数据包格式是xml  
处理方式：  
1、拿到xml包
2、解析成json
3、把解析之后的内容拼装成一个xml格式的数据片段？？？？  
4、把数据片段交给koa框架的ctx



koa
===
“通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。”   
emmm....

### 1. 基础  
```js
// app.js

const Koa = require('koa');

// 创建一个Koa对象表示web app本身
const app = new Koa(); 

// 对于任何请求，Koa都将用异步函数处理
app.use(async(ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});

app.listen(3000);
```
  * `ctx`是由koa传入的封装了request和response的变量  
  * `middleware`："中间件"（middleware），因为它处在 HTTP Request 和 HTTP Response 中间，用来实现某种中间功能。app.use()用来加载中间件。可以做一些自己的事情，然后通过`await next()`来调用下一个async函数。  
  * koa把很多async函数组成一个处理链，每个async函数都成为一个中间件，Koa 所有的功能都是通过中间件实现的；多个中间件会形成一个栈结构（middle stack），以“先进后出”的顺序执行

### 2. `koa-router`,  `koa-bodyparser`
通过`router.get('/path', async fn)`来注册一个GET请求。请求路径中的变量通过`ctx.params.name`访问  
```js 
// app.js

const router = require('koa-router')(); 
const bodyParser = require('koa-bodyparser');
// get请求
router.get('/:name', async (ctx, next) => {
    ctx.response.body = `
        <form action="/action1">
        </form>
    `;
});

// post请求
router.post('/action1', async(ctx, next) => {

});

app.use(bodyParser()); // 一定要先router注册到app上
app.use(router.routes());
```

### 3.  
```js

```