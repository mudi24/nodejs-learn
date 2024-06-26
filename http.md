# http

"http" 模块是 Node.js 中用于创建和处理 HTTP 服务器和客户端的核心模块。它使得构建基于 HTTP 协议的应用程序变得更加简单和灵活。

创建 Web 服务器：你可以使用 "http" 模块创建一个 HTTP 服务器，用于提供 Web 应用程序或网站。通过监听特定的端口，服务器可以接收客户端的请求，并生成响应。你可以处理不同的路由、请求方法和参数，实现自定义的业务逻辑。
构建 RESTful API："http" 模块使得构建 RESTful API 变得简单。你可以使用 HTTP 请求方法（如 GET、POST、PUT、DELETE 等）和路径来定义 API 的不同端点。通过解析请求参数、验证身份和权限，以及生成相应的 JSON 或其他数据格式，你可以构建强大的 API 服务。
代理服务器："http" 模块还可以用于创建代理服务器，用于转发客户端的请求到其他服务器。代理服务器可以用于负载均衡、缓存、安全过滤或跨域请求等场景。通过在代理服务器上添加逻辑，你可以对请求和响应进行修改、记录或过滤。
文件服务器："http" 模块可以用于创建一个简单的文件服务器，用于提供静态文件（如 HTML、CSS、JavaScript、图像等）。通过读取文件并将其作为响应发送给客户端，你可以轻松地构建一个基本的文件服务器。

## 创建http服务器

```js
const http = require('node:http'); // 引入 http 模块
const url = require('node:url'); // 引入 url 模块

// 创建 HTTP 服务器，并传入回调函数用于处理请求和生成响应
http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true); // 解析请求的 URL，获取路径和查询参数

  if (req.method === 'POST') { // 检查请求方法是否为 POST
    if (pathname === '/post') { // 检查路径是否为 '/post'
      let data = '';
      req.on('data', (chunk) => {
        data += chunk; // 获取 POST 请求的数据
        console.log(data);
      });
      req.on('end', () => {
        res.setHeader('Content-Type', 'application/json'); // 设置响应头的 Content-Type 为 'application/json'
        res.statusCode = 200; // 设置响应状态码为 200
        res.end(data); // 将获取到的数据作为响应体返回
      });
    } else {
      res.setHeader('Content-Type', 'application/json'); // 设置响应头的 Content-Type 为 'application/json'
      res.statusCode = 404; // 设置响应状态码为 404
      res.end('Not Found'); // 返回 'Not Found' 作为响应体
    }
  } else if (req.method === 'GET') { // 检查请求方法是否为 GET
    if (pathname === '/get') { // 检查路径是否为 '/get'
      console.log(query.a); // 打印查询参数中的键名为 'a' 的值
      res.end('get success'); // 返回 'get success' 作为响应体
    }
  }
}).listen(98, () => {
  console.log('server is running on port 98'); // 打印服务器启动的信息
});
```

使用 VS Code 插件 REST Client 调试


安装完成之后编写简易的代码就可以直接发送请求了

[POST | GET | PUT] [URL] [http版本]

[请求头]

[传递的数据]


目录中的 request.http 就是例子

```
# POST http://localhost:98/post/xxx HTTP/1.1

# Content-Type: application/json

# {
#     "name":"小满zs"
# }


GET http://localhost:98/get?a=1&b=2 HTTP/1.1

```

## 反向代理

反向代理（Reverse Proxy）是一种网络通信模式，它充当服务器和客户端之间的中介，将客户端的请求转发到一个或多个后端服务器，并将后端服务器的响应返回给客户端。

1. 负载均衡：反向代理可以根据预先定义的算法将请求分发到多个后端服务器，以实现负载均衡。这样可以避免某个后端服务器过载，提高整体性能和可用性。
2. 高可用性：通过反向代理，可以将请求转发到多个后端服务器，以提供冗余和故障转移。如果一个后端服务器出现故障，代理服务器可以将请求转发到其他可用的服务器，从而实现高可用性。
3. 缓存和性能优化：反向代理可以缓存静态资源或经常访问的动态内容，以减轻后端服务器的负载并提高响应速度。它还可以通过压缩、合并和优化资源等技术来优化网络性能。
4. 安全性：反向代理可以作为防火墙，保护后端服务器免受恶意请求和攻击。它可以过滤恶意请求、检测和阻止攻击，并提供安全认证和访问控制。
5. 域名和路径重写：反向代理可以根据特定的规则重写请求的域名和路径，以实现 URL 路由和重定向。这对于系统架构的灵活性和可维护性非常有用。

### http-proxy-middleware

根目录自定义配置文件

xm.config.js

配置proxy代理

```js
module.exports = {
    server:{
        proxy:{
        //代理的路径
            '/api': {
                target: 'http://localhost:3000', //转发的地址
                changeOrigin: true, //是否有跨域
            }
        }
    }
}
```

index.js 实现层

```js
const http = require('node:http');
const fs = require('node:fs')
const url = require('node:url')
const html = fs.readFileSync('./index.html') //给html文件起个服务
const {createProxyMiddleware} = require('http-proxy-middleware')
const config = require('./xm.config.js')
const server = http.createServer((req, res) => {
    const {pathname} = url.parse(req.url)
    const proxyList = Object.keys(config.server.proxy) //获取代理的路径
    if(proxyList.includes(pathname)){ //如果请求的路径在里面匹配到 就进行代理
        const proxy = createProxyMiddleware(config.server.proxy[pathname]) //代理
        proxy(req,res)
        return
    }
    console.log(proxyList)
    res.writeHead(200, {
        'Content-Type': 'text/html'
    })
    res.end(html) //返回html

})

server.listen(80) //监听端口
```

test.js 因为我们从80端口转发到3000端口

```js
const http = require('node:http')
const url = require('node:url')


http.createServer((req, res) => {
 
    const {pathname} = url.parse(req.url)

    if(pathname === '/api'){
        res.end('success proxy')
    }
    
}).listen(3000)
```

index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    
</head>
<body>
    <script>
          fetch('/api').then(res=>res.text()).then(res=>{
            console.log(res);
          })
    </script>
</body>
</html>
```

这样就从80代理到了3000端口 并且不存在跨域的问题了

## 动静分离

动静分离是一种在Web服务器架构中常用的优化技术，旨在提高网站的性能和可伸缩性。它基于一个简单的原则：将动态生成的内容（如动态网页、API请求）与静态资源（如HTML、CSS、JavaScript、图像文件）分开处理和分发。

通过将动态内容和静态资源存储在不同的服务器或服务上，并使用不同的处理机制，可以提高网站的处理效率和响应速度。这种分离的好处包括：

1. 性能优化：将静态资源与动态内容分离可以提高网站的加载速度。由于静态资源往往是不变的，可以使用缓存机制将其存储在CDN（内容分发网络）或浏览器缓存中，从而减少网络请求和数据传输的开销。
2. 负载均衡：通过将动态请求分发到不同的服务器或服务上，可以平衡服务器的负载，提高整个系统的可伸缩性和容错性。
3. 安全性：将动态请求与静态资源分开处理可以提高系统的安全性。静态资源通常是公开可访问的，而动态请求可能涉及敏感数据或需要特定的身份验证和授权。通过将静态资源与动态内容分离，可以更好地管理访问控制和安全策略。

实现动静分离的方法

* 使用反向代理服务器（如Nginx、Apache）将静态请求和动态请求转发到不同的后端服务器或服务。
* 将静态资源部署到CDN上，通过CDN分发静态资源，减轻源服务器的负载。
* 使用专门的静态文件服务器（如Amazon S3、Google Cloud Storage）存储和提供静态资源，而将动态请求交给应用服务器处理。

代码编写
下面是一个使用Node.js编写的示例代码，演示了如何处理动静分离的请求：

```js
import http from 'node:http' // 导入http模块
import fs from 'node:fs' // 导入文件系统模块
import path from 'node:path' // 导入路径处理模块
import mime from 'mime' // 导入mime模块

const server = http.createServer((req, res) => {
    const { url, method } = req

    // 处理静态资源
    if (method === 'GET' && url.startsWith('/static')) {
        const filePath = path.join(process.cwd(), url) // 获取文件路径
        const mimeType = mime.getType(filePath) // 获取文件的MIME类型
        console.log(mimeType) // 打印MIME类型

        fs.readFile(filePath, (err, data) => { // 读取文件内容
            if (err) {
                res.writeHead(404, {
                    "Content-Type": "text/plain" // 设置响应头为纯文本类型
                })
                res.end('not found') // 返回404 Not Found
            } else {
                res.writeHead(200, {
                    "Content-Type": mimeType, // 设置响应头为对应的MIME类型
                    "Cache-Control": "public, max-age=3600" // 设置缓存控制头
                })
                res.end(data) // 返回文件内容
            }
        })
    }

    // 处理动态资源
    if ((method === 'GET' || method === 'POST') && url.startsWith('/api')) {
        // ...处理动态资源的逻辑
    }
})

server.listen(80) // 监听端口80
```

> 因为每个文件所对应的mime类型都不一样，如果手写的话有很多，不过强大的nodejs社区提供了mime库，可以帮我们通过后缀直接分析出 所对应的mime类型，然后我们通过强缓存让浏览器缓存静态资源

### 常见的mime类型

```txt
-   文本文件：

    -   text/plain：纯文本文件
    -   text/html：HTML 文件
    -   text/css：CSS 样式表文件
    -   text/javascript：JavaScript 文件
    -   application/json：JSON 数据

-   图像文件：

    -   image/jpeg：JPEG 图像
    -   image/png：PNG 图像
    -   image/gif：GIF 图像
    -   image/svg+xml：SVG 图像

-   音频文件：

    -   audio/mpeg：MPEG 音频
    -   audio/wav：WAV 音频
    -   audio/midi：MIDI 音频

-   视频文件：

    -   video/mp4：MP4 视频
    -   video/mpeg：MPEG 视频
    -   video/quicktime：QuickTime 视频

-   应用程序文件：

    -   application/pdf：PDF 文件
    -   application/zip：ZIP 压缩文件
    -   application/x-www-form-urlencoded：表单提交数据
    -   multipart/form-data：多部分表单数据
```

## 邮件服务

邮件服务的功能：

1. 任务分配与跟踪：邮件服务可以用于分配任务、指派工作和跟踪项目进展。通过邮件，可以发送任务清单、工作说明和进度更新，确保团队成员了解其责任和任务要求，并监控工作的完成情况。

2. 错误报告和故障排除：当程序出现错误或异常时，程序员可以通过邮件将错误报告发送给团队成员或相关方。这样可以帮助团队了解问题的性质、复现步骤和相关环境，从而更好地进行故障排除和修复。邮件中可以提供详细的错误消息、堆栈跟踪和其他相关信息，以便其他团队成员能够更好地理解问题并提供解决方案。

3. 自动化构建和持续集成：在持续集成和自动化构建过程中，邮件服务可以用于通知团队成员构建状态、单元测试结果和代码覆盖率等信息。如果构建失败或出现警告，系统可以自动发送邮件通知相关人员，以便及时采取相应措施。


需要用到的第三方库

```
npm install js-yaml
npm install nodemailer
```

我们邮件的账号（密码| 授权码）一般需要存放在yaml文件或者环境变量里面

> js-yaml 用来解析yaml文件

```yaml
pass: 授权码 | 密码
user: xxxxx@qq.com 邮箱账号
```

```js
import nodemailder from 'nodemailer'
import yaml from 'js-yaml'
import fs from 'node:fs'
import http from 'node:http'
import url from 'node:url'
const mailConfig = yaml.load(fs.readFileSync('./mail.yaml', 'utf8'))
const transPort = nodemailder.createTransport({
    service: "qq",
    port: 587,
    host: 'smtp.qq.com',
    secure: true,
    auth: {
        pass: mailConfig.pass,
        user: mailConfig.user
    }
})


http.createServer((req, res) => {
    const { pathname } = url.parse(req.url)
    if (req.method === 'POST' && pathname == '/send/mail') {
        let mailInfo = ''
        req.on('data', (chunk) => {
            mailInfo += chunk.toString()
        })
        req.on('end', () => {
            const body = JSON.parse(mailInfo)
            transPort.sendMail({
                to: body.to,
                from: mailConfig.user,
                subject: body.subject,
                text: body.text
            })
            res.end('ok')
        })
    }
}).listen(3000)

```

nodemailder.createTransport 创建邮件服务这里用qq举例


[QQ邮件服务文档 POP3/IMAP/SMTP 服务](https://wx.mail.qq.com/list/readtemplate?name=app_intro.html#/agreement/authorizationCode)

POP3/SMTP 设置方法
用户名/帐户：  你的QQ邮箱完整的地址
密码：  生成的授权码
电子邮件地址：  你的QQ邮箱的完整邮件地址
接收邮件服务器：  pop.qq.com，使用SSL，端口号995
发送邮件服务器：  smtp.qq.com，使用SSL，端口号465或587

