# crypto

crypto模块的目的是为了提供通用的加密和哈希算法。用纯JavaScript代码实现这些功能不是不可能，但速度会非常慢。nodejs用C/C++实现这些算法后，通过crypto这个模块暴露为JavaScript接口，这样用起来方便，运行速度也快。

## 对称加密

```js
const crypto = require('node:crypto');

// 生成一个随机的 16 字节的初始化向量 (IV)
const iv = Buffer.from(crypto.randomBytes(16));

// 生成一个随机的 32 字节的密钥
const key = crypto.randomBytes(32);

// 创建加密实例，使用 AES-256-CBC 算法，提供密钥和初始化向量
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

// 对输入数据进行加密，并输出加密结果的十六进制表示
cipher.update("小满zs", "utf-8", "hex");
const result = cipher.final("hex");
console.log('result', result);
// 解密
const de = crypto.createDecipheriv("aes-256-cbc", key, iv);
de.update(result, "hex");
const decrypted = de.final("utf-8");

console.log("Decrypted:", decrypted);
```

对称加密是一种简单而快速的加密方式，它使用相同的密钥（称为对称密钥）来进行加密和解密。这意味着发送者和接收者在加密和解密过程中都使用相同的密钥。对称加密算法的加密速度很快，适合对大量数据进行加密和解密操作。然而，对称密钥的安全性是一个挑战，因为需要确保发送者和接收者都安全地共享密钥，否则有风险被未授权的人获取密钥并解密数据。

## 非对称加密

```js
const crypto = require('node:crypto')
// 生成 RSA 密钥对
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// 要加密的数据
const text = '小满zs';

// 使用公钥进行加密
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(text, 'utf-8'));

// 使用私钥进行解密
const decrypted = crypto.privateDecrypt(privateKey, encrypted);

console.log(decrypted.toString());
```

非对称加密使用一对密钥，分别是公钥和私钥。发送者使用接收者的公钥进行加密，而接收者使用自己的私钥进行解密。公钥可以自由分享给任何人，而私钥必须保密。非对称加密算法提供了更高的安全性，因为即使公钥泄露，只有持有私钥的接收者才能解密数据。然而，非对称加密算法的加密速度相对较慢，不适合加密大量数据。因此，在实际应用中，通常使用非对称加密来交换对称密钥，然后使用对称加密算法来加密实际的数据。


## 哈希函数

```js

const crypto = require('node:crypto');

// 要计算哈希的数据
let text = '123456';

// 创建哈希对象，并使用 MD5 算法
const hash = crypto.createHash('md5'); // SHA-256

// 更新哈希对象的数据
hash.update(text);

// 计算哈希值，并以十六进制字符串形式输出
const hashValue = hash.digest('hex');

console.log('Text:', text);
console.log('Hash:', hashValue);
````

哈希函数具有以下特点：

1. 固定长度输出：不论输入数据的大小，哈希函数的输出长度是固定的。例如，常见的哈希函数如 MD5 和 SHA-256 生成的哈希值长度分别为 128 位和 256 位。
2. 不可逆性：哈希函数是单向的，意味着从哈希值推导出原始输入数据是非常困难的，几乎不可能。即使输入数据发生微小的变化，其哈希值也会完全不同。
3. 唯一性：哈希函数应该具有较低的碰撞概率，即不同的输入数据生成相同的哈希值的可能性应该非常小。这有助于确保哈希值能够唯一地标识输入数据。

使用场景

1. 我们可以避免密码明文传输 使用md5加密或者sha256
2. 验证文件完整性，读取文件内容生成md5 如果前端上传的md5和后端的读取文件内部的md5匹配说明文件是完整的
