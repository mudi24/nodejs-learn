# child_process

## exec

exec 是异步的方法，返回 buffer，可以帮我们执行 shell 命令 或者 软件交互

```js
child_process.exec(command, [options], callback)
```

获取nodejs 版本号

```js
 exec('node -v',(err,stdout,stderr)=>{
    if(err){
        return  err
    }
    console.log(stdout.toString())
 })
```

options 配置项

```js
cwd <string> 子进程的当前工作目录。
env <Object> 环境变量键值对。
encoding <string> 默认为 'utf8'。
shell <string> 用于执行命令的 shell。 在 UNIX 上默认为 '/bin/sh'，在 Windows 上默认为 process.env.ComSpec。 详见 Shell Requirements 与 Default Windows Shell。
timeout <number> 默认为 0。
maxBuffer <number> stdout 或 stderr 允许的最大字节数。 默认为 200*1024。 如果超过限制，则子进程会被终止。 查看警告： maxBuffer and Unicode。
killSignal <string> | <integer> 默认为 'SIGTERM'。
uid <number> 设置该进程的用户标识。（详见 setuid(2)）
gid <number> 设置该进程的组标识。（详见 setgid(2)）
```

## execSync

获取node版本号 如果要执行单次shell命令execSync方便一些 options同上

执行较小的 shell 命令，exec 字节上线 200kb

```js
const nodeVersion  = execSync('node -v')
console.log(nodeVersion.toString("utf-8"))
```

打开谷歌浏览器 使用exec可以打开一些软件例如 wx 谷歌 qq音乐等 以下会打开百度并且进入无痕模式

```js
execSync("start chrome http://www.baidu.com --incognito")
```

## execFile

execFile 适合执行可执行文件，例如执行一个node脚本，或者shell文件，windows可以编写cmd脚本，posix，可以编写sh脚本

## spawn

> spawn 用于执行一些实时获取的信息因为spawn返回的是流边执行边返回，exec是返回一个完整的buffer，buffer的大小是200k，如果超出会报错，而spawn是无上限的。
> spawn在执行完成后会抛出close事件监听，并返回状态码，通过状态码可以知道子进程是否顺利执行。exec只能通过返回的buffer去识别完成状态，识别起来较为麻烦

```js
//                       命令      参数  options配置
const {stdout} = spawn('netstat',['-an'],{})

//返回的数据用data事件接受
stdout.on('data',(steram)=>{
    console.log(steram.toString())
})
stdout.on('close',(steram)=>{
    console.log('close')
})
```

> exec是底层通过execFile实现 execFile底层通过spawn实现

## fork

只能接受 js 模块

场景适合大量的计算，或者容易阻塞主进程操作的一些代码，就适合开发fork

```js
// 主进程和子进程之间的通讯
// index.js
const {fork} = require('child_process')

const testProcess = fork('./test.js')

testProcess.send('我是主进程')

testProcess.on("message",(data)=>{
    console.log('我是主进程接受消息111：',data)
})


// test.js
process.on('message',(data)=>{

    console.log('子进程接受消息：',data)
})

process.send('我是子进程')

```

fork底层使用的是IPC通道进行通讯的，IPC 是基于 libuv 实现的
libuv 在 windows 通过 named pipe 来实现，在 unix 系统 通过 domain socket 来实现
