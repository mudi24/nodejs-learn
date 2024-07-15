# express

Express是一个流行的Node.js Web应用程序框架，用于构建灵活且可扩展的Web应用程序和API。它是基于Node.js的HTTP模块而创建的，简化了处理HTTP请求、响应和中间件的过程。

1. 简洁而灵活：Express提供了简单而直观的API，使得构建Web应用程序变得简单快捷。它提供了一组灵活的路由和中间件机制，使开发人员可以根据需求定制和组织应用程序的行为。
2. 路由和中间件：Express使用路由和中间件来处理HTTP请求和响应。开发人员可以定义路由规则，将特定的URL路径映射到相应的处理函数。同时，中间件允许开发人员在请求到达路由处理函数之前或之后执行逻辑，例如身份验证、日志记录和错误处理。
3. 路由模块化：Express支持将路由模块化，使得应用程序可以根据不同的功能或模块进行分组。这样可以提高代码的组织性和可维护性，使得多人协作开发更加便捷。
4. 视图引擎支持：Express可以与各种模板引擎集成，例如EJS、Pug（以前称为Jade）、Handlebars等。这使得开发人员可以方便地生成动态的HTML页面，并将数据动态渲染到模板中。
5. 中间件生态系统：Express有一个庞大的中间件生态系统，开发人员可以使用各种中间件来扩展和增强应用程序的功能，例如身份验证、会话管理、日志记录、静态文件服务等。

## 启动一个 http 服务

```js
import express from 'express';

const app = express() //express 是个函数

app.listen(3000, () => console.log('Listening on port 3000'))

app.get('/', (req, res) => {
    res.send('get')
})

app.post('/create', (req, res) => {
    res.send('post')
})

// 接受前端的参数
app.use(express.json()) //如果前端使用的是post并且传递json 需要注册此中间件 不然是undefined

app.get('/', (req, res) => {
    console.log(req.query) //get 用query
    res.send('get')
})

app.post('/create', (req, res) => {
    console.log(req.body) //post用body
    res.send('post')
})

//如果是动态参数用 params
app.get('/:id', (req, res) => {
    console.log(req.params)
    res.send('get id')
})

```

## 模块化

> 我们正常开发的时候肯定不会把代码写到一个模块里面，Express允许将路由处理程序拆分为多个模块，每个模块负责处理特定的路由。通过将路由处理程序拆分为模块，可以使代码逻辑更清晰，易于维护和扩展

```txt
src
 --user.js
 --list.js
app.js
```

user.js

```js
import express from 'express'

const router = express.Router() //路由模块


router.post('/login', (req, res) => {
    res.send('login')
})

router.post('/register', (req, res) => {
    res.send('register')
})


export default router
```

app.js

```js
import express from 'express';
import User from './src/user.js'
const app = express()
app.use(express.json())
app.use('/user', User)
app.get('/', (req, res) => {
    console.log(req.query)
    res.send('get')
})

app.get('/:id', (req, res) => {
    console.log(req.params)
    res.send('get id')
})

app.post('/create', (req, res) => {
    console.log(req.body)
    res.send('post')
})


app.listen(3000, () => console.log('Listening on port 3000'))
```

## 中间件

中间件是一个关键概念。中间件是处理HTTP请求和响应的函数，它位于请求和最终路由处理函数之间，可以对请求和响应进行修改、执行额外的逻辑或者执行其他任务。
中间件函数接收三个参数：req（请求对象）、res（响应对象）和next（下一个中间件函数）。通过调用next()方法，中间件可以将控制权传递给下一个中间件函数。如果中间件不调用next()方法，请求将被中止，不会继续传递给下一个中间件或路由处理函数

实现一个日志中间件

```sh
npm install log4js
```

log4js是一个用于Node.js应用程序的流行的日志记录库，它提供了灵活且可配置的日志记录功能。log4js允许你在应用程序中记录不同级别的日志消息，并可以将日志消息输出到多个目标，如控制台、文件、数据库等

express\middleware\logger.js

```js
import log4js from 'log4js';

// 配置 log4js
log4js.configure({
  appenders: {
    out: {
      type: 'stdout', // 输出到控制台
      layout: {
        type: 'colored' // 使用带颜色的布局
      }
    },
    file: {
      type: 'file', // 输出到文件
      filename: './logs/server.log', // 指定日志文件路径和名称
    }
  },
  categories: {
    default: {
      appenders: ['out', 'file'], // 使用 out 和 file 输出器
      level: 'debug' // 设置日志级别为 debug
    }
  }
});

// 获取 logger
const logger = log4js.getLogger('default');

// 日志中间件
const loggerMiddleware = (req, res, next) => {
  logger.debug(`${req.method} ${req.url}`); // 记录请求方法和URL
  next();
};

export default loggerMiddleware;
```

app.js

```js
import express from 'express';
import User from './src/user.js'
import loggerMiddleware from './middleware/logger.js';
const app = express()
app.use(loggerMiddleware)
```

## 防盗链

防盗链（Hotlinking）是指在网页或其他网络资源中，通过直接链接到其他网站上的图片、视频或其他媒体文件，从而显示在自己的网页上。这种行为通常会给被链接的网站带来额外的带宽消耗和资源浪费，而且可能侵犯了原始网站的版权。
为了防止盗链，网站管理员可以采取一些措施：

1. 通过HTTP引用检查：网站可以检查HTTP请求的来源，如果来源网址与合法的来源不匹配，就拒绝提供资源。这可以通过服务器配置文件或特定的脚本实现。
2. 使用Referrer检查：网站可以检查HTTP请求中的Referrer字段，该字段指示了请求资源的来源页面。如果Referrer字段不符合预期，就拒绝提供资源。这种方法可以在服务器配置文件或脚本中实现。
3. 使用访问控制列表（ACL）：网站管理员可以配置服务器的访问控制列表，只允许特定的域名或IP地址访问资源，其他来源的请求将被拒绝。
4. 使用防盗链插件或脚本：一些网站平台和内容管理系统提供了专门的插件或脚本来防止盗链。这些工具可以根据需要配置，阻止来自未经授权的网站的盗链请求。
5. 使用水印技术：在图片或视频上添加水印可以帮助识别盗链行为，并提醒用户资源的来源。


初始化静态资源目录 express.static

```js
import express from 'express'

const app = express()
        //自定义前缀   初始化目录
app.use('/assets',express.static('static'))


app.listen(3000,()=>{
    console.log('listening on port 3000')
})
```

防盗链一般主要就是验证host 或者 referer

```js
import express from 'express';

const app = express();

const whitelist = ['localhost'];

// 防止热链中间件
const preventHotLinking = (req, res, next) => {
  const referer = req.get('referer'); // 获取请求头部中的 referer 字段
  if (referer) {
    const { hostname } = new URL(referer); // 从 referer 中解析主机名
    if (!whitelist.includes(hostname)) { // 检查主机名是否在白名单中
      res.status(403).send('Forbidden'); // 如果不在白名单中，返回 403 Forbidden
      return;
    }
  }
  next(); // 如果在白名单中，继续处理下一个中间件或路由
};

app.use(preventHotLinking); // 应用防止热链中间件
app.use('/assets', express.static('static')); // 处理静态资源请求

app.listen(3000, () => {
  console.log('Listening on port 3000'); // 启动服务器，监听端口3000
});
```

## 响应头和请求头

### 响应头

```js
Access-Control-Allow-Origin:*
Cache-Control:public, max-age=0, must-revalidate
Content-Type:text/html; charset=utf-8
Server:nginx
Date:Mon, 08 Jan 2024 18:32:47 GMT
```
响应头和跨域之间的关系

cors

跨域资源共享（Cross-Origin Resource Sharing，CORS）是一种机制，用于在浏览器中实现跨域请求访问资源的权限控制。当一个网页通过 XMLHttpRequest 或 Fetch API 发起跨域请求时，浏览器会根据同源策略（Same-Origin Policy）进行限制。同源策略要求请求的源（协议、域名和端口）必须与资源的源相同，否则请求会被浏览器拒绝

浏览器的同源策略要求我们的协议、域名、端口号必须完全一致，否则就会请求就会被浏览器拒绝

这个时候就需要后端支持一下，也是一个常见的处理跨域的办法：
```js
Access-Control-Allow-Origin: * | Origin
```

增加以下响应头 允许localhost 5500 访问

```js
app.use('*',(req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','http://localhost:5500') //允许localhost 5500 访问
    next()
})
```

## 请求头
默认情况下cors仅支持客户端向服务器发送如下九个请求头

> 没有application/json

1. Accept：指定客户端能够处理的内容类型。
2. Accept-Language：指定客户端偏好的自然语言。
3. Content-Language：指定请求或响应实体的自然语言。
4. Content-Type：指定请求或响应实体的媒体类型。
5. DNT (Do Not Track)：指示客户端不希望被跟踪。
6. Origin：指示请求的源（协议、域名和端口）。
7. User-Agent：包含发起请求的用户代理的信息。
8. Referer：指示当前请求的源 URL。
9. Content-type: application/x-www-form-urlencoded | multipart/form-data |  text/plain

如果客户端需要支持额外的请求那么我们需要在客户端支持

```js
'Access-Control-Allow-Headers','Content-Type' //支持application/json
```

请求方法支持
我们服务端默认只支持 GET POST HEAD OPTIONS 请求

例如我们遵循restFui 要支持PATCH 或者其他请求

支持 patch 和 delete
```js
'Access-Control-Allow-Methods','POST,GET,OPTIONS,DELETE,PATCH'
```

### 预检请求 OPTIONS
预检请求的主要目的是确保跨域请求的安全性 它需要满足一定条件才会触发

1. 自定义请求方法：当使用非简单请求方法（Simple Request Methods）时，例如 PUT、DELETE、CONNECT、OPTIONS、TRACE、PATCH 等，浏览器会发送预检请求。
2. 自定义请求头部字段：当请求包含自定义的头部字段时，浏览器会发送预检请求。自定义头部字段是指不属于简单请求头部字段列表的字段，例如 Content-Type 为 application/json、Authorization 等。
3. 带凭证的请求：当请求需要在跨域环境下发送和接收凭证（例如包含 cookies、HTTP 认证等凭证信息）时，浏览器会发送预检请求。


### 自定义响应头
在我们做需求的时候肯定会碰到后端自定义响应头

```js
app.get('/info', (req, res) => {
    res.set('xmzs', '1')
    res.setHeader('Access-Control-Expose-Headers', 'xmzs')
    res.json({
        code: 200
    })
})
```
前端读取请求头
```js
 fetch('http://localhost:3000/info').then(res=>{
    const headers = res.headers 
    console.log(headers.get('xmzs')) //读取自定义响应头
    return res.json()
}).then(res=>{
    console.log(res)
})
```

### SSE 
Server-Sent Events（SSE）是一种在客户端和服务器之间实现单向事件流的机制，允许服务器主动向客户端发送事件数据。在 SSE 中，可以使用自定义事件（Custom Events）来发送具有特定类型的事件数据。
webSocket属于全双工通讯，也就是前端可以给后端实时发送，后端也可以给前端实时发送，SSE属于单工通讯，后端可以给前端实时发送

express 增加该响应头text/event-stream就变成了sse，event 事件名称 data 发送的数据

```js
app.get('/sse',(req,res)=>{
    res.setHeader('Content-Type', 'text/event-stream')
    res.status(200)
    setInterval(() => {
        res.write('event: test\n')
        res.write('data: ' + new Date().getTime() + '\n\n')
    }, 1000)
})
```

前端接受
```js
const sse = new EventSource('http://localhost:3000/sse')
sse.addEventListener('test', (event) => {
    console.log(event.data)
})
```



