# events

## EventEmitter

Node.js 核心 API 都是采用异步事件驱动架构，简单来说就是通过有效的方法来监听事件状态的变化，并在变化的时候做出相应的动作。

## 事件模型

Nodejs事件模型采用了，发布订阅设计模式

```js
const EventEmitter = require('events');

const event = new EventEmitter()
//监听test
event.on('test',(data)=>{
    console.log(data)
})

event.emit('test','xmxmxmxmx') //派发事件
```

监听消息数量默认是10个

如何解除限制 调用 setMaxListeners 传入数量

```js
event.setMaxListeners(20)
```

只想监听一次 once 即使emit派发多次也只触发一次once
```js
event.once('test', (data) => {
    console.log(data)
})
```

取消监听 off

```js
event.off('test', fn)
```

process 也可以使用 on、emit、once、off 的 api，这是为什么呢？

打开nodejs 源码 搜索 setupProcessObject 这个函数

[setupProcessObject](./img/setupProcessObject.png)

1. 它首先引入 event模块
2. 获取process 的原型对象
3. 将evnet的原型对象设给了process 的原型对象
4. 并且重新绑定上下文
5. 将process 挂载到globalThis 所以我们可以全局访问这个API