# path

> path模块在不同的操作系统是有差异的(windows | posix)

posix（Portable Operating System Interface of UNIX）
posix表示可移植操作系统接口，也就是定义了一套标准，遵守这套标准的操作系统有(unix,like unix,linux,macOs,windows wsl)，为什么要定义这套标准，比如在Linux系统启动一个进程需要调用fork函数,在windows启动一个进程需要调用creatprocess函数，这样就会有问题，比如我在linux写好了代码，需要移植到windows发现函数不统一，posix标准的出现就是为了解决这个问题。
Windows 并没有完全遵循 POSIX 标准。Windows 在设计上采用了不同于 POSIX 的路径表示方法。
在 Windows 系统中，路径使用反斜杠（\）作为路径分隔符。这与 POSIX 系统使用的正斜杠（/）是不同的。这是 Windows 系统的历史原因所致，早期的 Windows 操作系统采用了不同的设计选择。

## windows posix 差异

* path.basename() 方法返回的是给定路径中的最后一部分

在posix处理windows路径

```js
console.log(path.posix.basename('\\foo\\bar\\xm.html'));
// \foo\bar\xm.html
```

结果返回的并不对 应该返回 xm.html

如果要在posix系统处理windows的路径需要调用对应操作系统的方法应该修改为

```js
console.log(path.win32.basename('\\foo\\bar\\xm.html'));
// xm.html
```

* path.dirname() 返回除了最后一个路径的其他路径

```js
console.log(path.dirname('/aaaa/bbbb/cccc/index.html'));
// /aaaa/bbbb/cccc
```

* path.extname() 返回扩展名

```js
path.extname('/aaaa/bbbb/cccc/index.html.ccc.ddd.aaa')
//.aaa
```

> 如果有多个 . 返回最后一个 如果没有扩展名返回空

* path.join() 拼接路径

```js
path.join('/foo','/cxk','/ikun')
// /foo/cxk/ikun
```

> 可以支持 .. ./ ../操作符

```js
path.join('/foo','/cxk','/ikun','../')
// /foo/cxk/
```

* path.resolve()

用于将相对路径解析并且返回绝对路径

如果传入了多个绝对路径 它将返回最右边的绝对路径

```js
path.resolve('/aaa','/bbb','/ccc')
//   /ccc
```

传入绝对路径 + 相对路径

```js
path.resolve(__dirname,'./index.js')
//  /User/xiaoman/DeskTop/node/index.js
```

如果只传入相对路径

```js
path.resolve('./index.js')
// 返回工作目录 + index.js
```

* path.parse path.format
path.format 和 path.parse 正好互补

path.parse

用于解析文件路径。它接受一个路径字符串作为输入，并返回一个包含路径各个组成部分的对象

```js
path.parse('/home/user/dir/file.txt')

{
  root: '/',
  dir: '/home/user/dir',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}

```

* root：路径的根目录，即 /。
* dir：文件所在的目录，即 /home/user/documents。
* base：文件名，即 file.txt。
* ext：文件扩展名，即 .txt。
* name：文件名去除扩展名，即 file。

path.format 正好相反 在把对象转回字符串

```js
path.format({
    root: '/',
    dir: '/home/user/documents',
    base: 'file.txt',
    ext: '.txt',
    name: 'file'
 })
 // /home/user/dir/file.txt
```

* path.sep  windows返回的是 \，posix 返回的是 / 