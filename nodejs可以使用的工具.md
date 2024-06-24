# nodejs可以使用的工具

## ffmpeg

FFmpeg 是一个开源的跨平台多媒体处理工具，可以用于处理音频、视频和多媒体流。它提供了一组强大的命令行工具和库，可以进行视频转码、视频剪辑、音频提取、音视频合并、流媒体传输等操作。
FFmpeg 的主要功能和特性：

格式转换：FFmpeg 可以将一个媒体文件从一种格式转换为另一种格式，支持几乎所有常见的音频和视频格式，包括 MP4、AVI、MKV、MOV、FLV、MP3、AAC 等。
视频处理：FFmpeg 可以进行视频编码、解码、裁剪、旋转、缩放、调整帧率、添加水印等操作。你可以使用它来调整视频的分辨率、剪辑和拼接视频片段，以及对视频进行各种效果处理。
音频处理：FFmpeg 可以进行音频编码、解码、剪辑、混音、音量调节等操作。你可以用它来提取音频轨道、剪辑和拼接音频片段，以及对音频进行降噪、均衡器等处理。
流媒体传输：FFmpeg 支持将音视频流实时传输到网络上，可以用于实时流媒体服务、直播和视频会议等应用场景。
视频处理效率高：FFmpeg 是一个高效的工具，针对处理大型视频文件和高分辨率视频进行了优化，可以在保持良好质量的同时提供较快的处理速度。
跨平台支持：FFmpeg 可以在多个操作系统上运行，包括 Windows、MacOS、Linux 等，同时支持多种硬件加速技术，如 NVIDIA CUDA 和 Intel Quick Sync Video。

下载链接：[https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)

安装完成以后，输入 ffmpeg -version 

1. demo 视频转gif -i 表示输入的意思

```js
const {execSync} = require('child_process')
execSync(`ffmpeg -i test.mp4 test.gif`,{stdio:'inherit'})
execSync(`ffmpeg -i test.mp4 test.avi`,{stdio:'inherit'})
```

2. 提取视频的音频

```js
const {execSync} = require('child_process')
execSync(`ffmpeg -i test.mp4 test.mp3`,{stdio:'inherit'})
```

3. 视频裁剪 + 控制大小

-ss 起始时间

-to 结束事件

> ss写在 -i的前面可能会导致精度问题，因为视频还没解析就跳转到了相关位置，但是解析速度快
> ss写在 -i后面精度没问题，但是解析速度会变慢

```js
const {execSync} = require('child_process')

execSync(`ffmpeg -ss 10 -to 20 -i test.mp4  test3.mp4`,{stdio:'inherit'})
```

4. 添加水印

-vf 就是video filter  过滤器

drawtext 添加文字 fontsize 大小 xy垂直水平方向 fontcolor 颜色 text 水印文案 全部小写

```js
const {execSync} = require('child_process')

execSync(`ffmpeg -i test.mp4 -vf drawtext=text="XMZS":fontsize=30:fontcolor=white:x=10:y=10 test2.mp4`,{stdio:'inherit'})
```

5. 去掉水印
w h 宽高 xy 垂直 水平坐标 delogo使用的过滤参数删除水印

```js
const {execSync} = require('child_process')

execSync(`ffmpeg -i  test2.mp4 -vf delogo=w=120:h=30:x=10:y=10 test3.mp4`,{stdio:'inherit'})
```

## pngquant

pngquant 是一个用于压缩 PNG 图像文件的工具。它可以显著减小 PNG 文件的大小，同时保持图像质量和透明度。通过减小文件大小，可以提高网页加载速度，并节省存储空间。pngquant 提供命令行接口和库，可轻松集成到各种应用程序和脚本中。

[pngquant.com/](http://pngquant.com/)

## Nodejs 中 调用pngquant

我们同样还是可以用exec命令调用

```js
import { exec } from 'child_process'
exec('pngquant 73kb.png --output test.png')
```

```js
import { exec } from 'child_process'
exec('pngquant 73kb.png --quality=82 --output test.png')
```

quality表示图片质量0-100值越大图片越大效果越好

```js
import { exec } from 'child_process'
exec('pngquant 73kb.png --speed=1 --quality=82 --output test.png')
```


* --speed=1: 最慢的速度，产生最高质量的输出图像。
* --speed=10: 最快的速度，但可能导致输出图像质量稍微降低。****

## markdown 转换为 html

需要使用到的库：

1. EJS：一款强大的JavaScript模板引擎，它可以帮助我们在HTML中嵌入动态内容。使用EJS，您可以轻松地将Markdown转换为美观的HTML页面  
2. Marked：一个流行的Markdown解析器和编译器，它可以将Markdown语法转换为HTML标记。Marked是一个功能强大且易于使用的库，它为您提供了丰富的选项和扩展功能，以满足各种转换需求。
3. BrowserSync：一个强大的开发工具，它可以帮助您实时预览和同步您的网页更改。当您对Markdown文件进行编辑并将其转换为HTML时，BrowserSync可以自动刷新您的浏览器，使您能够即时查看转换后的结果。

### ejs 语法

1. 纯脚本标签
`<% code %>`

里面可以写任意的 js，用于流程控制，无任何输出。

```js
<% alert('hello world') %> // 会执行弹框
```

2. 输出经过 HTML 转义的内容

<%= value %> 可以是变量
<%= a ? b : c %> 也可以是表达式
<%= a + b %>
即变量如果包含 '<'、'>'、'&'等HTML字符，会被转义成字符实体，像&lt; &gt; &amp;
因此用<%=，最好保证里面内容不要有HTML字符

```xml
const text = '<p>你好你好</p>'
<h2><%= text %></h2> // 输出 &lt;p&gt;你好你好&lt;/p&gt; 插入 <h2> 标签中
```

3. 输出非转义的内容(原始内容)

<%- 富文本数据 %> 通常用于输出富文本，即 HTML内容
上面说到<%=会转义HTML字符，那如果我们就是想输出一段HTML怎么办呢？
<%-不会解析HTML标签，也不会将字符转义后输出。像下例，就会直接把 <p>我来啦</p> 插入  

标签中
 
```js
const content = '<p>标签</p>'
<h2><%- content %></h2>
```

4. 引入其他模版

<%- include('***文件路径') %>
将相对于模板路径中的模板片段包含进来。
用<%- include指令而不是<% include，为的是避免对输出的 HTML 代码做转义处理。

```js
// 当前模版路径：./views/tmp.ejs
// 引入模版路径：./views/user/show.ejs
<ul>
  <% users.forEach(function(user){ %>
    <%- include('user/show', {user: user}); %>
  <% }); %>
</ul>
```

5. 条件判断

```js
<% if (condition1) { %>
  ... 
<% } %>

<% if (condition1) { %>
  ... 
<% } else if (condition2) { %>
  ... 
<% } %>

// 举例
<% if (a && b) { %>
  <p>可以直接放 html 内容</p>
<% } %>

<% if (a && b) { %>
  <% console.log('也可以嵌套任意ejs模版语句') %>
<% } %>
```

6. 循环

```js
<% for(var i = 0; i < target.length; i++){ %>
  <%= i %> <%= target[i] %>
<% } %>

<% for(var i in jsArr) { %>
  <script type="text/javascript" src="<%= jsArr[i] %>" ref="preload"></script>
<% } %>

// 推荐
<% for(var css of cssArr) { %>
  <link rel="stylesheet" href="<%= css %>" />
<% } %>
```

template.ejs

初始化模板 到时候会转换成html代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link rel="stylesheet" href="./index.css">
</head>
<body>
    <%- content %>
</body>
</html>
```

### marked

编写一个简易的md文档

```js
 ### 标题
 - test
```

将md 转换成html

```js
const marked = require('marked')
marked.parse(readme.toString()) //调用parse即可
```

### browserSync

支持多设备预览，多设备同步滚动

创建browser 并且开启一个服务 设置根目录和 index.html 文件

```js
const browserSync = require('browser-sync')
const openBrowser =  () => {
    const browser = browserSync.create()
    browser.init({
        server: {
            baseDir: './',
            index: 'index.html',
        }
    })
    return browser
}    
```

index.css
html代码有了 但是没有通用的markdown的通用css

```css
/* Markdown通用样式 */

/* 设置全局字体样式 */
body {
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
  }
  
  /* 设置标题样式 */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 1.3em;
    margin-bottom: 0.6em;
    font-weight: bold;
  }
  
  h1 {
    font-size: 2.2em;
  }
  
  h2 {
    font-size: 1.8em;
  }
  
  h3 {
    font-size: 1.6em;
  }
  
  h4 {
    font-size: 1.4em;
  }
  
  h5 {
    font-size: 1.2em;
  }
  
  h6 {
    font-size: 1em;
  }
  
  /* 设置段落样式 */
  p {
    margin-bottom: 1.3em;
  }
  
  /* 设置链接样式 */
  a {
    color: #337ab7;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  /* 设置列表样式 */
  ul,
  ol {
    margin-top: 0;
    margin-bottom: 1.3em;
    padding-left: 2em;
  }
  
  /* 设置代码块样式 */
  pre {
    background-color: #f7f7f7;
    padding: 1em;
    border-radius: 4px;
    overflow: auto;
  }
  
  code {
    font-family: Consolas, Monaco, Courier, monospace;
    font-size: 0.9em;
    background-color: #f7f7f7;
    padding: 0.2em 0.4em;
    border-radius: 4px;
  }
  
  /* 设置引用样式 */
  blockquote {
    margin: 0;
    padding-left: 1em;
    border-left: 4px solid #ddd;
    color: #777;
  }
  
  /* 设置表格样式 */
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1.3em;
  }
  
  table th,
  table td {
    padding: 0.5em;
    border: 1px solid #ccc;
  }
  
  /* 添加一些额外的样式，如图片居中显示 */
  img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    height: auto;
  }
  
  /* 设置代码行号样式 */
  pre code .line-numbers {
    display: inline-block;
    width: 2em;
    padding-right: 1em;
    color: #999;
    text-align: right;
    user-select: none;
    pointer-events: none;
    border-right: 1px solid #ddd;
    margin-right: 0.5em;
  }
  
  /* 设置代码行样式 */
  pre code .line {
    display: block;
    padding-left: 1.5em;
  }
  
  /* 设置代码高亮样式 */
  pre code .line.highlighted {
    background-color: #f7f7f7;
  }
  
  /* 添加一些响应式样式，适应移动设备 */
  @media only screen and (max-width: 768px) {
    body {
      font-size: 14px;
      line-height: 1.5;
    }
    
    h1 {
      font-size: 1.8em;
    }
    
    h2 {
      font-size: 1.5em;
    }
    
    h3 {
      font-size: 1.3em;
    }
    
    h4 {
      font-size: 1.1em;
    }
    
    h5 {
      font-size: 1em;
    }
    
    h6 {
      font-size: 0.9em;
    }
    
    table {
      font-size: 14px;
    }
  }    
```

完整代码

```js
const ejs = require('ejs'); // 导入ejs库，用于渲染模板
const fs = require('node:fs'); // 导入fs模块，用于文件系统操作
const marked = require('marked'); // 导入marked库，用于将Markdown转换为HTML
const readme = fs.readFileSync('README.md'); // 读取README.md文件的内容
const browserSync = require('browser-sync'); // 导入browser-sync库，用于实时预览和同步浏览器
const openBrowser =  () => {
    const browser = browserSync.create()
    browser.init({
        server: {
            baseDir: './',
            index: 'index.html',
        }
    })
    return browser
}
ejs.renderFile('template.ejs', {
    content: marked.parse(readme.toString()),
    title:'markdown to html'
},(err,data)=>{
    if(err){
        console.log(err)
    }
    let writeStream = fs.createWriteStream('index.html')
    writeStream.write(data)
    writeStream.close()
    writeStream.on('finish',()=>{
        openBrowser()
    })
})     
```