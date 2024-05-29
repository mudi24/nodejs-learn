## nodejs 全局api

node.js 定义全局变量

在nodejs中使用global定义全局变量，定义的变量，可以在引入的文件中也可以访问到该变量

```js
// index.js
global.name = "index.js"
require('./child.js')
```

在浏览器中我们定义的全局变量都在window，nodejs在global，不同的环境还需要判断，于是在ECMAScript 2020 出现了一个**globalThis**全局变量，在nodejs环境会自动切换成global ，浏览器环境自动切换window非常方便

其他全局 api

由于nodejs中没有DOM和BOM，除了这些API，其他的ECMAscriptAPI基本都能用

> setTimeout setInterval Promise Math  console  Date fetch(node v18) 等...

### nodejs内置全局API

```js
__dirname
```

它表示当前模块的所在目录的绝对路径

```js
__filename
```

它表示当前模块文件的绝对路径，包括文件名和文件扩展名

### process

* process.argv: 这是一个包含命令行参数的数组。第一个元素是Node.js的执行路径，第二个元素是当前执行的JavaScript文件的路径，之后的元素是传递给脚本的命令行参数。
* process.env: 这是一个包含当前环境变量的对象。您可以通过process.env访问并操作环境变量。
* process.cwd(): 这个方法返回当前工作目录的路径。
* process.on(event, listener): 用于注册事件监听器。您可以使用process.on监听诸如exit、uncaughtException等事件，并在事件发生时执行相应的回调函数。
* process.exit([code]): 用于退出当前的Node.js进程。您可以提供一个可选的退出码作为参数。
* process.pid: 这个属性返回当前进程的PID（进程ID）。

### Buffer

创建 Buffer 实例：

Buffer.alloc(size[, fill[, encoding]]): 创建一个指定大小的新的Buffer实例，初始内容为零。fill参数可用于填充缓冲区，encoding参数指定填充的字符编码。
Buffer.from(array): 创建一个包含给定数组的Buffer实例。
Buffer.from(string[, encoding]): 创建一个包含给定字符串的Buffer实例。

读取和写入数据：

buffer[index]: 通过索引读取或写入Buffer实例中的特定字节。
buffer.length: 获取Buffer实例的字节长度。
buffer.toString([encoding[, start[, end]]]): 将Buffer实例转换为字符串。

转换数据：

buffer.toJSON(): 将Buffer实例转换为JSON对象。
buffer.slice([start[, end]]): 返回一个新的Buffer实例，其中包含原始Buffer实例的部分内容。

其他方法：

Buffer.isBuffer(obj): 检查一个对象是否是Buffer实例。
Buffer.concat(list[, totalLength]): 将一组Buffer实例或字节数组连接起来形成一个新的Buffer实例。

请注意，从Node.js 6.0版本开始，Buffer构造函数的使用已被弃用，推荐使用Buffer.alloc()、Buffer.from()等方法来创建Buffer实例。
Buffer类在处理文件、网络通信、加密和解密等操作中非常有用，尤其是在需要处理二进制数据时

