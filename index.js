const path = require("node:path")

console.log(path.posix.basename('\\foo\\bar\\xm.html'));
// \foo\bar\xm.html
console.log(path.win32.basename('\\foo\\bar\\xm.html'));
// xm.html

console.log(path.dirname('/aaaa/bbbb/cccc/index.html'));
// /aaaa/bbbb/cccc

console.log(path.join('/foo','/cxk','/ikun','..'));
console.log(path.join('/foo','/cxk','/ikun','./'));

console.log(path.sep);