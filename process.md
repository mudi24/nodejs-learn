# process

process 是Nodejs操作当前进程和控制当前进程的API，并且是挂载到globalThis下面的全局API

## process.argv
获取执行进程后面的参数 返回是一个数组 后面我们讲到命令行交互工具的时候会很有用，各种cli脚手架也是使用这种方式接受配置参数例如webpack

```js
console.log(process.argv, process.argv.includes('--version') ? '1.0.0': '无');

node index.js --version
```

## process.cwd()

返回当前的工作目录 例如在 F:\project\node> 执行的脚本就返回这个目录 也可以和path拼接。代替__dirname使用（ESM模式下无法使用 __dirname）

## process.memoryUsage

用于获取当前进程的内存使用情况。该方法返回一个对象，其中包含了各种内存使用指标，如 rss（Resident Set Size，常驻集大小）、heapTotal（堆区总大小）、heapUsed（已用堆大小）和 external（外部内存使用量）等

```js
{
  rss: 30932992, // 常驻集大小 这是进程当前占用的物理内存量，不包括共享内存和页面缓存。它反映了进程实际占用的物理内存大小
  heapTotal: 6438912, //堆区总大小 这是 V8 引擎为 JavaScript 对象分配的内存量。它包括了已用和未用的堆内存
  heapUsed: 5678624,  //已用堆大小
  external: 423221, //外部内存使用量 这部分内存不是由 Node.js 进程直接分配的，而是由其他 C/C++ 对象或系统分配的
  arrayBuffers: 17606 //是用于处理二进制数据的对象类型，它使用了 JavaScript 中的 ArrayBuffer 接口。这个属性显示了当前进程中 ArrayBuffers 的数量
}
```

## process.exit

调用 process.exit() 将强制进程尽快退出，即使仍有未完全完成的异步操作挂起

```js
process.on('exit',()=>{
  console.log('退出了')
})
```

## process.kill

与exit类似，kill用来杀死一个进程，接受一个参数进程id可以通过process.pid 获取

```js
process.kill(process.pid)
```

## process.env

用于读取操作系统所有的环境变量，也可以修改和查询环境变量。

> 修改 注意修改并不会真正影响操作系统的变量，而是只在当前线程生效，线程结束便释放。

## 环境变量场景

区分开发环境 和 生产环境

```js
npm install cross-env
```

cross-env 是 跨平台设置和使用环境变量 不论是在Windows系统还是POSIX系统。同时，它提供了一个设置环境变量的脚本，使得您可以在脚本中以unix方式设置环境变量，然后在Windows上也能兼容运行

```json
cross-env NODE_ENV=dev
```

原理就是如果是windows 就调用SET 如果是posix 就调用export 设置环境变量

```js
set NODE_ENV=production  #windows
export NODE_ENV=production #posix
```