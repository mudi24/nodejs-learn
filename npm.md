# npm 
npm（全称 Node Package Manager）是 Node.js 的包管理工具，它是一个基于命令行的工具，用于帮助开发者在自己的项目中安装、升级、移除和管理依赖项。

## npm 命令

* **npm config list 查看当前 npm 和 node 信息**
* **npm get register  获取 npm 源**
* **npm config set register http://taobao.xxx.com  设置 npm 源**
* **npm ls -g** 查看当前全局可执行命令  **npm ls**查看当前项目可执行命令

* npm init：初始化一个新的 npm 项目，创建 package.json 文件。
* npm install：安装一个包或一组包，并且会在当前目录存放一个node_modules。
* npm install <package-name>：安装指定的包。
* npm install <package-name> --save：安装指定的包，并将其添加到 package.json 文件中的依赖列表中。
* npm install <package-name> --save-dev：安装指定的包，并将其添加到 package.json 文件中的开发依赖列表中。
* npm install -g <package-name>：全局安装指定的包。
* npm update <package-name>：更新指定的包。
* npm uninstall <package-name>：卸载指定的包。
* npm run <script-name>：执行 package.json 文件中定义的脚本命令。
* npm search <keyword>：搜索 npm 库中包含指定关键字的包。
* npm info <package-name>：查看指定包的详细信息。
* npm list：列出当前项目中安装的所有包。
* npm outdated：列出当前项目中需要更新的包。
* npm audit：检查当前项目中的依赖项是否存在安全漏洞。
* npm publish：发布自己开发的包到 npm 库中。
* npm login：登录到 npm 账户。
* npm logout：注销当前 npm 账户。
* npm link: 将本地模块链接到全局的 node_modules 目录下
* npm config list 用于列出所有的 npm 配置信息。执行该命令可以查看当前系统和用户级别的所有 npm 配置信息，以及当前项目的配置信息（如果在项目目录下执行该命令）
* npm get registry 用于获取当前 npm 配置中的 registry 配置项的值。registry 配置项用于指定 npm 包的下载地址，如果未指定，则默认使用 npm 官方的包注册表地址
* npm set registry npm config set registry <registry-url> 命令，将 registry 配置项的值修改为指定的 <registry-url> 地址


## Package json
执行npm init 便可以初始化一个package.json

* name：项目名称，必须是唯一的字符串，通常采用小写字母和连字符的组合。
* version：项目版本号，通常采用语义化版本号规范。
* description：项目描述。
* main：项目的主入口文件路径，通常是一个 JavaScript 文件。
* keywords：项目的关键字列表，方便他人搜索和发现该项目。
* author：项目作者的信息，包括姓名、邮箱、网址等。
* license：项目的许可证类型，可以是自定义的许可证类型或者常见的开源许可证（如 MIT、Apache 等）。
* dependencies：项目所依赖的包的列表，这些包会在项目运行时自动安装。
* devDependencies：项目开发过程中所需要的包的列表，这些包不会随项目一起发布，而是只在开发时使用。
* peerDependencies：项目的同级依赖，即项目所需要的模块被其他模块所依赖。(开发插件时需要用到)
* scripts：定义了一些脚本命令，比如启动项目、运行测试等。
* repository：项目代码仓库的信息，包括类型、网址等。
* bugs：项目的 bug 报告地址。
* homepage：项目的官方网站地址或者文档地址。


> version 三段式版本号一般是1.0.0 大版本号 次版本号 修订号， 大版本号一般是有重大变化才会升级， 次版本号一般是增加功能进行升级， 修订号一般是修改bug进行升级

## npm install 原理

首先安装的依赖都会存放在根目录的node_modules,**默认采用扁平化**的方式安装，并且排序规则.bin第一个然后@系列，再然后按照首字母排序abcd等，并且使用的算法是**广度优先遍历**，在遍历依赖树时，npm会首先处理项目根目录下的依赖，然后逐层处理每个依赖包的依赖，直到所有依赖都被处理完毕。在处理每个依赖时，npm会检查该依赖的版本号是否符合依赖树中其他依赖的版本要求，如果不符合，则会尝试安装适合的版本

* 理想状态下的扁平化
安装某个二级模块时，若发现第一层级有相同名称，相同版本的模块，便直接复用那个模块

因为A模块下的C模块被安装到了第一级，这使得B模块能够复用处在同一级下；且名称，版本，均相同的C模块

* 非理想状态下的扁平化
因为B和A所要求的依赖模块不同，（B下要求是v2.0的C，A下要求是v1.0的C ）所以B不能像2中那样复用A下的C v1.0模块 所以如果这种情况还是会出现模块冗余的情况，他就会给B继续搞一层node_modules，就是非扁平化了。

![npm install](./img/npm%20install.png)

> 如果 package.json 和 package-lock.json 文件版本不一致，会根据 package.json 中的版本号以及语义去下载包，并更新 lock 文件；
> 如果版本号一直，则会根据 package-lock.json 中的版本号去下载


### package-lock.json 的作用
可以锁定版本记录依赖树详细信息

* version 该参数指定了当前包的版本号
* resolved 该参数指定了当前包的下载地址
* integrity 用于验证包的完整性
* dev 该参数指定了当前包是一个开发依赖包
* bin 该参数指定了当前包中可执行文件的路径和名称
* engines 该参数指定了当前包所依赖的Node.js版本范围

> package-lock.json 帮我们做了缓存，他会通过 name + version + integrity 信息生成一个唯一的key，这个key能找到对应的index-v5 下的缓存记录 也就是npm cache 文件夹（npm config list 或者 npm config ls -l 的 cache）下的
> 如果发现有缓存记录，就会找到tar包的hash值，然后将对应的二进制文件解压到node_modeules

### npmrc

npmrc 配置项

```sh
registry=http://registry.npmjs.org/
# 定义npm的registry，即npm的包下载源

proxy=http://proxy.example.com:8080/
# 定义npm的代理服务器，用于访问网络

https-proxy=http://proxy.example.com:8080/
# 定义npm的https代理服务器，用于访问网络

strict-ssl=true
# 是否在SSL证书验证错误时退出

cafile=/path/to/cafile.pem
# 定义自定义CA证书文件的路径

user-agent=npm/{npm-version} node/{node-version} {platform}
# 自定义请求头中的User-Agent

save=true
# 安装包时是否自动保存到package.json的dependencies中

save-dev=true
# 安装包时是否自动保存到package.json的devDependencies中

save-exact=true
# 安装包时是否精确保存版本号

engine-strict=true
# 是否在安装时检查依赖的node和npm版本是否符合要求

scripts-prepend-node-path=true
# 是否在运行脚本时自动将node的路径添加到PATH环境变量中

```

## npm run 原理

```json
// package.json
"scripts":{
  "dev": "vite"
}
```
运行 npm run dev 

读取package json 的scripts 对应的脚本命令(dev:vite),vite是个可执行脚本，他的查找规则是：

* 先从当前项目的node_modules/.bin去查找可执行命令vite
* 如果没找到就去全局的node_modules 去找可执行命令vite
* 如果还没找到就去环境变量查找
* 再找不到就进行报错

### npm 可执行命令

因为nodejs 是跨平台的所以可执行命令兼容各个平台

.sh 是给Linux unix Macos 使用
.cmd 给windows的cmd使用
.ps1 给windows的powerShell 使用

### npm 生命周期

```json
"predev": "node prev.js",
"dev": "node index.js",
"postdev": "node post.js"
```

执行 npm run dev 命令的时候 predev 会自动执行 他的生命周期是在dev之前执行，然后执行dev命令，再然后执行postdev，也就是dev之后执行

运用场景例如npm run build 可以在打包之后删除dist目录等等

post例如你编写完一个工具发布npm，那就可以在之后写一个ci脚本顺便帮你推送到git等等

vue-cli 就用到了， [https://github.com/vuejs/vue-cli/blob/dev/package.json](https://github.com/vuejs/vue-cli/blob/dev/package.json)
```json
"scripts": {
    "test": "node --experimental-vm-modules scripts/test.js",
    "pretest": "yarn clean",
    "lint": "eslint --fix packages/**/*.js packages/**/bin/*",
    "lint-without-fix": "eslint packages/**/*.js packages/**/bin/*",
    "check-links": "node scripts/checkLinks.js",
    "clean": "rimraf packages/test/* packages/**/temp/*",
    "clean-e2e": "rimraf /tmp/verdaccio-workspace",
    "sync": "node scripts/syncDeps.js",
    "boot": "node scripts/bootstrap.js",
    "release": "yarn --pure-lockfile && yarn clean && node scripts/release.js",
    "version": "node scripts/genChangelog.js && node scripts/genDocs.js && git add CHANGELOG.md && git add docs",
    "docs": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "patch-chromedriver": "node scripts/patchChromedriver.js"
},
```

## npx

npx是一个命令行工具，它是npm 5.2.0版本中新增的功能。它允许用户在不安装全局包的情况下，运行已安装在本地项目中的包或者远程仓库中的包。

npx的作用是在命令行中运行node包中的可执行文件，而不需要全局安装这些包。这可以使开发人员更轻松地管理包的依赖关系，并且可以避免全局污染的问题。它还可以帮助开发人员在项目中使用不同版本的包，而不会出现版本冲突的问题。

### npx 的优势

避免全局安装：npx允许你执行npm package，而不需要你先全局安装它。
总是使用最新版本：如果你没有在本地安装相应的npm package，npx会从npm的package仓库中下载并使用最新版。
执行任意npm包：npx不仅可以执行在package.json的scripts部分定义的命令，还可以执行任何npm package。
执行GitHub gist：npx甚至可以执行GitHub gist或者其他公开的JavaScript文件。

### npm 和 npx 区别

npx侧重于执行命令的，执行某个模块命令。虽然会自动安装模块，但是重在执行某个命令
npm侧重于安装或者卸载某个模块的。重在安装，并不具备执行某个模块的功能。


### npm 可能存在的问题

例如创建一个react项目 在之前需要安装到全局
```sh
npm install -g create-react-app
```

然后执行  `create-react-app my-app` 这样的话会有两个问题

* 首先需要全局安装这个包占用磁盘空间
* 并且如果需要更新还得执行更新命令


### npx 的执行流程

npx 的运行规则和npm 是一样的 本地目录查找.bin 看有没有 如果没有就去全局的node_moduels 查找，如果还没有就去下载这个包然后运行命令，然后删除这个包

> 如果全局环境中没有 vite 且没有配置环境变量，此时执行运行 vite 命令会报错，就可以使用 npx vite 命令运行

## 发布 npm 包

1. 创建一个npm账号
  
```sh
npm adduser
```

2. 登录账号（记得切换为 npm官方源）

```sh
npm login
```

3. 发布npm包

```sh
npm publish 
```
如果出现403说明包名被占用了

## npm 搭建私服

构建私服有什么收益吗？

* 可以离线使用，你可以将npm私服部署到内网集群，这样离线也可以访问私有的包。
* 提高包的安全性，使用私有的npm仓库可以更好的管理你的包，避免在使用公共的npm包的时候出现漏洞。
* 提高包的下载速度，使用私有 npm 仓库，你可以将经常使用的 npm 包缓存到本地，从而显著提高包的下载速度，减少依赖包的下载时间。这对于团队内部开发和* 持续集成、部署等场景非常有用

### 如何搭建npm 私服

[https://verdaccio.org/zh-cn/](https://verdaccio.org/zh-cn/)

Verdaccio 是可以帮我们快速构建npm私服的一个工具

```sh
npm install verdaccio -g
```

verdaccio 直接运行即可，然后访问4873默认端口即可

```sh
#创建账号
npm adduser --registry http://localhost:4873/
# 账号 密码 邮箱
```

```sh
# 发布npm
npm publish --registry http://localhost:4873/

```

```sh
#指定开启端口 默认 4873
verdaccio --listen 9999

```

```sh
# 指定安装源
npm install --registry http://localhost:4873
```

```sh
# 从本地仓库删除包
npm unpublish <package-name> --registry http://localhost:4873
```