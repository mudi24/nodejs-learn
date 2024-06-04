# os

* os.platform() 返回操作系统平台。 'mac'、'darwin'、'windows'、'linux'、'win32'
* os.release() 返回操作系统的版本 例如10.xxxx win10
* os.homedir() 返回用户目录 例如c:\user\xiaoman 原理就是 windows echo %USERPROFILE% posix echo $HOME
* os.arch()	返回cpu的架构 可能的值为 'arm'、'arm64'、'ia32'、'mips'、'mipsel'、'ppc'、'ppc64'、's390'、's390x'、以及 'x64'
* os.cpus() 获取CPU的线程以及详细信息, length 表示线程数量
  * model: 表示CPU的型号信息，其中 "Intel(R) Core(TM) i7 CPU 860 @ 2.80GHz" 是一种具体的型号描述。
  * speed: 表示CPU的时钟速度，以MHz或GHz为单位。在这种情况下，速度为 2926 MHz 或 2.926 GHz。
  * times: 是一个包含CPU使用时间的对象，其中包含以下属性：
    * user: 表示CPU被用户程序使用的时间（以毫秒为单位）。
    * nice: 表示CPU被优先级较低的用户程序使用的时间（以毫秒为单位）。
    * sys: 表示CPU被系统内核使用的时间（以毫秒为单位）。
    * idle: 表示CPU处于空闲状态的时间（以毫秒为单位）。
    * irq: 表示CPU被硬件中断处理程序使用的时间（以毫秒为单位）。
* os.networkInterfaces() 获取网络信息
  * address: 表示本地回环接口的IP地址，这里是 '127.0.0.1'。
  * netmask: 表示本地回环接口的子网掩码，这里是 '255.0.0.0'。
  * family: 表示地址族（address family），这里是 'IPv4'，表示IPv4地址。
  * mac: 表示本地回环接口的MAC地址，这里是 '00:00:00:00:00:00'。请注意，本地回环接口通常不涉及硬件，因此MAC地址通常为全零。
  * internal: 表示本地回环接口是否是内部接口，这里是 true，表示它是一个内部接口。
  * cidr: 表示本地回环接口的CIDR表示法，即网络地址和子网掩码的组合，这里是 '127.0.0.1/8'，表示整个 127.0.0.0 网络。

```js
{
  address: '192.168.1.108',
  netmask: '255.255.255.0',
  family: 'IPv4',
  mac: '01:02:03:0a:0b:0c',
  internal: false,
  cidr: '192.168.1.108/24'
},
```

## 案例

webpack rollup vite open:true 打开浏览器  

判断不同的操作系统 分别调用对应的 shell 命令


```js
const { exec } = require('child_process');
const os = require('os');

function openBrowser(url) {
  if (os.platform() === 'darwin') {  // macOS
    exec(`open ${url}`); //执行shell脚本
  } else if (os.platform() === 'win32') {  // Windows
    exec(`start ${url}`); //执行shell脚本
  } else {  // Linux, Unix-like
    exec(`xdg-open ${url}`); //执行shell脚本
  }
}

// Example usage
openBrowser('https://www.juejin.cn');
```