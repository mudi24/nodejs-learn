# fs

在 Node.js 中，fs 模块是文件系统模块（File System module）的缩写，它提供了与文件系统进行交互的各种功能。通过 fs 模块，你可以执行诸如读取文件、写入文件、更改文件权限、创建目录等操作，Node.js 核心API之一。

```js
import fs from 'node:fs'
import fs2 from 'node:fs/promises'
//读取文件
fs2.readFile('./index.txt').then(result => {
    console.log(result.toString())
})
fs.readFile('./index.txt', (err, data) => {
    if (err) {
        return err
    }
    console.log(data.toString())
})
let txt = fs.readFileSync('./index.txt')
console.log(txt.toString())
```

fs支持同步和异步两种模式 增加了Sync fs 就会采用同步的方式运行代码，会阻塞下面的代码，不加Sync就是异步的模式不会阻塞。

fs新增了promise版本，只需要在引入包后面增加/promise即可，fs便可支持promise回调。

fs返回的是一个buffer二进制数据 每两个十六进制数字表示一个字节

```js
import fs2 from 'node:fs/promises'

fs2.readFile('./index.txt',{
    encoding:"utf8",
    flag:"",
}).then(result => {
    console.log(result.toString())
})
```

## 常用API 介绍

## 读取文件 

readFile 第一个参数 读取的路径， 第二个参数是个配置项
encoding 支持各种编码 utf-8之类的
flag 就很多了

* 'a': 打开文件进行追加。 如果文件不存在，则创建该文件。

* 'ax': 类似于 'a' 但如果路径存在则失败。

* 'a+': 打开文件进行读取和追加。 如果文件不存在，则创建该文件。

* 'ax+': 类似于 'a+' 但如果路径存在则失败。

* 'as': 以同步模式打开文件进行追加。 如果文件不存在，则创建该文件。

* 'as+': 以同步模式打开文件进行读取和追加。 如果文件不存在，则创建该文件。

* 'r': 打开文件进行读取。 如果文件不存在，则会发生异常。

* 'r+': 打开文件进行读写。 如果文件不存在，则会发生异常。

* 'rs+': 以同步模式打开文件进行读写。 指示操作系统绕过本地文件系统缓存。

这主要用于在 NFS 挂载上打开文件，因为它允许跳过可能过时的本地缓存。 它对 I/O 性能有非常实际的影响，因此除非需要，否则不建议使用此标志。
这不会将 fs.open() 或 fsPromises.open() 变成同步阻塞调用。 如果需要同步操作，应该使用类似 fs.openSync() 的东西。

* 'w': 打开文件进行写入。 创建（如果它不存在）或截断（如果它存在）该文件。

* 'wx': 类似于 'w' 但如果路径存在则失败。

* 'w+': 打开文件进行读写。 创建（如果它不存在）或截断（如果它存在）该文件。

* 'wx+': 类似于 'w+' 但如果路径存在则失败。

## 使用可读流读取 使用场景适合读取**大文件**

```js
const readStream = fs.createReadStream('./index.txt',{
    encoding:"utf8"
})

readStream.on('data',(chunk)=>{
    console.log(chunk)
})

readStream.on('end',()=>{
    console.log('close')
})
```

## 创建多层文件夹 开启 recursive 可以递归创建多个文件夹

```js
fs.mkdir('path/test/ccc', { recursive: true },(err)=>{

})
```

## 删除多层文件夹 开启recursive 递归删除全部文件夹

```js
fs.rm('path', { recursive: true },(err)=>{

})
```

## 重命名文件 第一个参数原始名称 第二个参数新的名称

```js
fs.renameSync('./test.txt','./test2.txt')
```

## 监听文件的变化 返回监听的事件如change,和监听的内容filename

```js
fs.watch('./test2.txt',(event,filename)=>{
    
    console.log(event,filename)
})
```

## 源码解析
 
[github.com/libuv/libuv](https://github.com/libuv/libuv)

fs的源码是通过 C++ 层的 FSReqCallback 这个类 对libuv 的uv_fs_t 的一个封装，其实也就是将我们fs 的参数透传给 libuv 层

![fs 源码](./img/fsOriginCode)

```js
// 创建目录的异步操作函数，通过uv_fs_mkdir函数调用
// 参数：
// - loop: 事件循环对象，用于处理异步操作
// - req: 文件系统请求对象，用于保存操作的状态和结果
// - path: 要创建的目录的路径
// - mode: 目录的权限模式 777 421
// - cb: 操作完成后的回调函数
int uv_fs_mkdir(uv_loop_t* loop,
                uv_fs_t* req,
                const char* path,
                int mode,
                uv_fs_cb cb) {
  INIT(MKDIR);
  PATH;
  req->mode = mode;
  if (cb != NULL)
    if (uv__iou_fs_mkdir(loop, req))
      return 0;
  POST;
}
```

### 注意

```js
const fs = require('node:fs')

fs.readFile('./index.txt', {
    encoding: 'utf-8',
    flag: 'r'
}, (err, dataStr) => {
    if (err) throw err
    console.log('fs')
})

setImmediate(() => {
    console.log('setImmediate')
})
```

为什么先走setImmediate 呢，而不是fs

Node.js 读取文件的时候是使用libuv进行调度的

而setImmediate是由V8进行调度的，在 V8 的事件循环中

文件读取完成后 libuv 才会将 fs的结果 推入V8的队列


## 写入内容

```js
const fs = require('node:fs')

fs.writeFileSync('index.txt', 'java之父\n余胜军')
```

1. 第一个参数写入的文件
2. 第二个参数写入的内容
3. 第三个是options可选项 encoding编码 mode权限 flag (flag 参数及含义与readFile 相同，上面有)

### 追加内容

第一种方式 设置flag 为 a 也可以追内容

```js
fs.writeFileSync('index.txt', '\nvue之父\n鱿鱼须',{
    flag: 'a'
})
```

第二种方式

```js
const fs = require('node:fs')

fs.appendFileSync('index.txt', '\nunshift创始人\n麒麟哥')
```

## 可写流

```js
const fs = require('node:fs')

let verse = [
    '待到秋来九月八',
    '我花开后百花杀',
    '冲天香阵透长安',
    '满城尽带黄金甲'
]

let writeStream = fs.createWriteStream('index.txt')

verse.forEach(item => {
    writeStream.write(item + '\n')
})

writeStream.end()

writeStream.on('finish',()=>{
    console.log('写入完成')
})
```

我们可以创建一个可写流 打开一个通道，可以一直写入数据，用于处理大量的数据写入，写入完成之后调用end 关闭可写流，监听finish 事件 写入完成

## 硬链接 和 软连接

```js
fs.linkSync('./index.txt', './index2.txt') //硬链接

fs.symlinkSync('./index.txt', './index3.txt' ,"file") //软连接
```

硬链接的作用和用途如下：

1. 文件共享：硬链接允许多个文件名指向同一个文件，这样可以在不同的位置使用不同的文件名引用相同的内容。这样的共享文件可以节省存储空间，并且在多个位置对文件的修改会反映在所有引用文件上。
2. 文件备份：通过创建硬链接，可以在不复制文件的情况下创建文件的备份。如果原始文件发生更改，备份文件也会自动更新。这样可以节省磁盘空间，并确保备份文件与原始文件保持同步。
3. 文件重命名：通过创建硬链接，可以为文件创建一个新的文件名，而无需复制或移动文件。这对于需要更改文件名但保持相同内容和属性的场景非常有用。

软链接的一些特点和用途如下：

1. 软链接可以创建指向文件或目录的引用。这使得你可以在不复制或移动文件的情况下引用它们，并在不同位置使用不同的文件名访问相同的内容。
2. 软链接可以用于创建快捷方式或别名，使得你可以通过一个简短或易记的路径来访问复杂或深层次的目录结构。
3. 软链接可以用于解决文件或目录的位置变化问题。如果目标文件或目录被移动或重命名，只需更新软链接的目标路径即可，而不需要修改引用该文件或目录的其他代码。
