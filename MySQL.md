# MySQL

MySQL是一种开源的关系型数据库管理系统（RDBMS），它是最受欢迎的数据库系统之一。MySQL广泛用于Web应用程序和其他需要可靠数据存储的应用程序中。
以下是MySQL数据库的一些重要特点和概念：

1. 数据库：MySQL是一个数据库管理系统，用于创建和管理数据库。数据库是一个组织结构，用于存储和管理数据。
2. 表：数据库中的数据被组织成表的形式。表由行和列组成，行表示记录，列表示字段。
3. SQL：MySQL使用结构化查询语言（SQL）进行数据库操作。SQL是一种用于定义、操作和查询数据库的语言。
4. 数据类型：MySQL支持各种数据类型，例如整数、浮点数、字符串、日期和时间等。每个列都有自己的数据类型。
5. 索引：MySQL允许创建索引以加快数据检索速度。索引是对表中一列或多列的值进行排序的数据结构。
6. 主键：主键是表中的唯一标识符。它用于确保表中的每个记录都有唯一的标识。
7. 外键：外键用于建立表与表之间的关联。它定义了一个表中的列与另一个表中的列之间的关系。
8. 触发器：触发器是一种在数据库中定义的操作，它会在特定事件发生时自动执行。例如，当向表中插入新记录时，可以触发一个触发器来执行其他操作。
9. 存储过程：存储过程是一组预编译的SQL语句，可以在数据库中进行重复使用。它可以接受参数并返回结果。
10. 备份和恢复：MySQL提供了备份和恢复数据库的工具和命令，以确保数据的安全性和可靠性。

## 关系型数据库

在关系型数据库中，数据以结构化的方式存储，其中每个表格由一组列（字段）和一组行（记录）组成。每个列定义了数据的类型和属性，而每个行则表示一个特定的数据实例。表格之间的关系通过使用主键和外键进行建立。主键是唯一标识表格中每个行的列，而外键是指向其他表格主键的列，用于建立表格之间的关联关系。

## 安装流程
[www.mysql.com/](https://www.mysql.com/)

默认端口3306
添加mysql服务 把名字记住(MySQL83)

测试Mysql 然后输入密码

```sh
mysql -uroot -p
```
SQL（Structured Query Language）是一种用于管理关系型数据库系统的语言。它是一种标准化语言，用于执行各种数据库操作，包括数据查询、插入、更新和删除等。

## 数据库的操作
### 创建数据库

```
create database 库名
```
如果进行重复的创建就会失败，不允许重复创建，可以使用此命令 if not exists
```js
create database if not exists `xiaoman`
```
添加字符集 utf-8
```
create database `xiaoman`
    default character set = 'utf8mb4';
```

## 数据表

* 创建表
```
CREATE TABLE `user` (
   id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
   name varchar(100) COMMENT '名字',
   age int COMMENT '年龄',
   address varchar(255) COMMENT '地址',
   create_time timestamp DEFAULT CURRENT_TIMESTAMP  COMMENT '创建时间'
) COMMENT '用户表'
```
create table 表名字 (

  id字段名称   int数据类型代表数字类型   NOT NULL(不能为空)  AUTO_INCREMENT(id自增)
  PRIMARY KEY(id为主键)
  name(字段名称) varchar(100)字符串类型100字符 COMMENT(注释)
  age(字段名称) int数据类型代表数字类型  COMMENT(注释)
  create_time(字段名称) timestamp(时间戳) DEFAULT CURRENT_TIMESTAMP(自动填充创建时间)

)

* 修改表名

```
ALTER TABLE `user` RENAME `user2`;
```

* 增加列

```
ALTER TABLE `user` Add COLUMN `hobby` VARCHAR(200) ;
```

* 删除列

```
ALTER TABLE `user` DROP COLUMN `hobby`;
```

* 编辑列

```
ALTER TABLE `user` MODIFY COLUMN `age` VARCHAR(255) NULL COMMENT '年龄2';
```


