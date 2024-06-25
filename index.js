// const path = require("node:path")

// console.log(path.posix.basename('\\foo\\bar\\xm.html'));
// // \foo\bar\xm.html
// console.log(path.win32.basename('\\foo\\bar\\xm.html'));
// // xm.html

// console.log(path.dirname('/aaaa/bbbb/cccc/index.html'));
// // /aaaa/bbbb/cccc

// console.log(path.join('/foo','/cxk','/ikun','..'));
// console.log(path.join('/foo','/cxk','/ikun','./'));

// console.log(path.sep);

// const os = require("node:os")

// console.log(os.cpus());
// console.log(os.networkInterfaces())

// console.log(process.argv, process.argv.includes('--version') ? '1.0.0': '无');


// console.log(process.memoryUsage());

// console.log(process.env);

// const {execSync, spawn} = require('child_process')
// // execSync("open Google Chrome http://www.baidu.com")

// const {stdout} = spawn('netstat',['-an'],{})

// //返回的数据用data事件接受
// stdout.on('data',(steram)=>{
//     console.log(steram.toString())
// })
// stdout.on('close',(steram)=>{
//     console.log('close')
// })

// const crypto = require('node:crypto');

// // 生成一个随机的 16 字节的初始化向量 (IV)
// const iv = Buffer.from(crypto.randomBytes(16));

// // 生成一个随机的 32 字节的密钥
// const key = crypto.randomBytes(32);

// // 创建加密实例，使用 AES-256-CBC 算法，提供密钥和初始化向量
// const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

// // 对输入数据进行加密，并输出加密结果的十六进制表示
// cipher.update("小满zs", "utf-8", "hex");
// const result = cipher.final("hex");
// console.log('result', result);
// // 解密
// const de = crypto.createDecipheriv("aes-256-cbc", key, iv);
// de.update(result, "hex");
// const decrypted = de.final("utf-8");

// console.log("Decrypted:", decrypted);

