# CommonJS 和 ES Module

## CommonJS 规范

引入模块（require）支持四种格式

1. 支持引入内置模块例如 http os fs child_process 等nodejs内置模块
2. 支持引入第三方模块express md5 koa 等
3. 支持引入自己编写的模块 ./ ../ 等
4. 支持引入addon C++扩展模块 .node文件
5. 引入 json 文件

```js
const fs = require('node:fs');  // 导入核心模块
const express = require('express');  // 导入 node_modules 目录下的模块
const myModule = require('./myModule.js');  // 导入相对路径下的模块
const nodeModule = require('./myModule.node');  // 导入扩展模块
const data = require('./data.json') // 导入 json 文件
```

导出模块exports 和 module.exports

```js
module.exports = {
  hello: function() {
    console.log('Hello, world!');
  }
};
// 或者
module.exports = 123
```

## ES Module  规范

引入模块 import 必须写在头部

> 注意使用ESM模块的时候必须开启一个选项 打开package.json 设置 type:module

```js
import fs from 'node:fs'
```

### 模块导入

ESM  默认不支持引入 json 文件
> 如果要引入json文件需要特殊处理 需要增加断言并且指定类型json node低版本不支持

```js
import data from './data.json' assert { type: "json" };
console.log(data);
```

加载模块的整体对象

```js
import * as all from 'xxx.js'
console.log(all )
```

动态导入模块

import静态加载不支持掺杂在逻辑中如果想动态加载请使用import函数模式

```js
if(true){
    import('./test.js').then()
}
```

### 模块导出

导出一个默认对象 default只能有一个不可重复export default
```js
export default {
    name: 'test',
}
```

导出变量

```js
export const a = 1
```

### Cjs 和 ESM 的区别

* Cjs是基于运行时的同步加载，esm是基于编译时的异步加载
* Cjs是可以修改值的，esm值并且不可修改（可读的）
* Cjs不可以tree shaking，esm支持tree shaking
* commonjs中顶层的this指向这个模块本身，而ES6中顶层this指向undefined
