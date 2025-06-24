---
layout: post
title: "PostgreSQL使用安装"
date: 2017-05-08
author: 大头
desc: "PostgreSQL使用安装..."
categories: ["数据库"]
tags: ["database"]
permalink: "/database/postgresql.html"
--- 

# PostgreSQL使用安装

# 一. 安装

ubuntu安装：

```
# 安装客户端
sudo apt-get install postgresql-client
# 安装服务器
sudo apt-get install postgresql
# 安装图形界面
sudo apt-get install pgadmin3
```

安装后默认生成一个名为postgres的数据库和一个名为postgres的数据库用户。这里需要注意的是，同时还生成了一个名为postgres的Linux系统用户。

# 二. 登录

```
# 先切换到postgres用户
sudo su postgres
```

以下命令相当于系统用户postgres以同名数据库用户的身份

```
psql
```

完整登录命令

```
psql -U dbuser -d exampledb -h 127.0.0.1 -p 5432
```

上面命令的参数含义如下：-U指定用户，-d指定数据库，-h指定服务器，-p指定端口。

# 三. 授权其他用户

授权其他用户登录：

```
# 新建系统用户
sudo adduser superpika

# 进入控制台
psql
```

先改下命令：

```
\password postgres
```

创建用户，和新建系统用户一样：

```
CREATE USER superpika WITH PASSWORD 'password';
```

新建数据库并授权：

```
CREATE DATABASE exampledb OWNER superpika;
GRANT ALL PRIVILEGES ON DATABASE exampledb to superpika;
```

控制台输入\q退出：

```
\q
```

退出后,重新登录，命令需完整！

```
exit
psql -U superpika -d exampledb -h 127.0.0.1 -p 5432
```

# 四. 远程登录

```
vim /etc/postgresql/9.5/main/postgresql.conf

listen_addresses = '*'  

vim /etc/postgresql/9.5/main/pg_hba.conf

host    all             all             127.0.0.1/32            md5
host all all 0.0.0.0/0  md5

# 如果想指定数据库的话，需要修改第一个 all，如果需要指定用户的话，修改第二个all

sudo /etc/init.d/postgresql restart
```

# 五. 命令

除了前面已经用到的`\password`命令（设置密码）和`\q`命令（退出）以外，控制台还提供一系列其他命令。

        \h：查看SQL命令的解释，比如\h select。
        \?：查看psql命令列表。
        \l：列出所有数据库。
        \c [database_name]：连接其他数据库。
        \d：列出当前数据库的所有表格。
        \d [table_name]：列出某一张表格的结构。
        \du：列出所有用户。
        \e：打开文本编辑器。
        \conninfo：列出当前数据库和连接的信息。

基本的数据库操作，就是使用一般的SQL语言。

    # 创建新表
    CREATE TABLE user_tbl(name VARCHAR(20), signup_date DATE);

    # 插入数据
    INSERT INTO user_tbl(name, signup_date) VALUES('张三', '2013-12-22');

    # 选择记录
    SELECT * FROM user_tbl;

    # 更新数据
    UPDATE user_tbl set name = '李四' WHERE name = '张三';

    # 删除记录
    DELETE FROM user_tbl WHERE name = '李四' ;

    # 添加栏位
    ALTER TABLE user_tbl ADD email VARCHAR(40);

    # 更新结构
    ALTER TABLE user_tbl ALTER COLUMN signup_date SET NOT NULL;

    # 更名栏位
    ALTER TABLE user_tbl RENAME COLUMN signup_date TO signup;

    # 删除栏位
    ALTER TABLE user_tbl DROP COLUMN email;

    # 表格更名
    ALTER TABLE user_tbl RENAME TO backup_tbl;

    # 删除表格
    DROP TABLE IF EXISTS backup_tbl;

备份：

1.只导出结构

```
    #!/usr/bin/env bash
    ## -h 主机名
    ## -U 用户名
    ## -W 强制输入密码
    ## -d 数据库名字
    ## -t 表名字
    ## -s 导出schema，不导出数据
    ## -C 创建数据库并连接数据库
    ## -f 数据文件
    pg_dump -v -h 127.0.0.1 -U postgres -W -d postgres1 -t public.job -s -C -f init_pg.sql
    
    
    #!/usr/bin/env bash
    psql -v -h 127.0.0.1 -U postgres -W -d postgres -t public.job  -f init_pg.sql
```

2.正常备份:将osdba数据库整个导出

```
    pg_dump -v -h 127.0.0.1 -U postgres osdba -Fc > osdba.dump
    
    #  -C表示通过-d后面的数据库进入，然后创建osdba数据库。。。
    pg_restore -v -h 127.0.0.1 -U postgres -C -d postgres osdba.dump
    
    # 从模板创建数据库，并导入
    createdb -T template0 osdba2
    pg_restore -d osdba2 osdba.dump
```
 
# 六. 连接数爆了


Connection could not be allocated because: FATAL: sorry, too many clients alread

查找配置文件还有连接数:

```
postgres=# SHOW config_file;
               config_file                
------------------------------------------
 /etc/postgresql/9.5/main/postgresql.conf
(1 row)

postgres=# select count(1) from pg_stat_activity;
 count 
-------
    74
(1 row)
```

编辑

```
vim  /etc/postgresql/9.5/main/postgresql.conf

max_connections=6000

sudo /etc/init.d/postgresql restart
```

扩大linux的文件描述符

```
一，通过ulimit命令修改
 
//显示当前文件描述符
ulimit -n
 
//修改当前用户环境下的文件描述符为65536
ulimit -HSn 65536
 
echo "ulimit -HSn 65536" >> /etcrc.local
 
使用ulimit命令的缺点：
 
1，只能修改当前登录用户环境下的文件描述符，如果此用户来另外打开一个连接，此链接环境的文件描述符依然是没改前的
2，如果系统重启，以前修改都不再生效
 
二，通过修改limits.conf文件
 
编辑/etc/security/limits.conf 文件，在最后加入如下两行
 
*  soft    nofile  65536
*  hard    nofile  65536
 
保存退出，都不需要重启服务器，直接重新登陆!!!!用ulimit -n就能看到效果
 
这样无论使用哪个用户，无论是否重启都不会失效了。
```
