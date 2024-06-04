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

const {execSync, spawn} = require('child_process')
// execSync("open Google Chrome http://www.baidu.com")

const {stdout} = spawn('netstat',['-an'],{})

//返回的数据用data事件接受
stdout.on('data',(steram)=>{
    console.log(steram.toString())
})
stdout.on('close',(steram)=>{
    console.log('close')
})