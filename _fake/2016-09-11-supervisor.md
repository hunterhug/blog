---
layout: post
title: "进程管理工具supervisor"
date: 2016-09-11
author: 大头
desc: "Supervisor是一个客户/服务器系统，它可以在类Unix系统中管理控制大量进程。.."
categories: ["运维相关"]
tags: ["linux"]
permalink: "/devops/supervisor.html"
---

# 进程管理工具supervisor

# 一.介绍

1.Supervisor是一个客户/服务器系统，它可以在类Unix系统中管理控制大量进程。Supervisor使用python开发，有多年历史，目前很多生产环境下的服务器都在使用Supervisor。

2.Supervisor的服务器端称为supervisord，主要负责在启动自身时启动管理的子进程，响应客户端的命令，重启崩溃或退出的子进程，记录子进程stdout和stderr输出，生成和处理子进程生命周期中的事件。可以在一个配置文件中配置相关参数，包括Supervisord自身的状态，其管理的各个子进程的相关属性。配置文件一般位于/etc/supervisord.conf。

3.Supervisor的客户端称为supervisorctl，它提供了一个类shell的接口（即命令行）来使用supervisord服务端提供的功能。通过supervisorctl，用户可以连接到supervisord服务器进程，获得服务器进程控制的子进程的状态，启动和停止子进程，获得正在运行的进程列表。客户端通过Unix域套接字或者TCP套接字与服务端进行通信，服务器端具有身份凭证认证机制，可以有效提升安全性。当客户端和服务器位于同一台机器上时，客户端与服务器共用同一个配置文件`/etc/supervisord.conf`，通过不同标签来区分两者的配置。

4.Supervisor也提供了一个web页面来查看和管理进程状态，这个功能用得人比较少。

官网：[http://supervisord.org]()http://supervisord.org)

# 二.安装

一定要用Python2，因为3不支持

    pip install supervisor

测试是否安装成功：

    echo_supervisord_conf

创建配置文件：

    echo_supervisord_conf > /etc/supervisord.conf

# 三.配置文件设置

```
# 生成必要的配置文件
echo_supervisord_conf > supervisord.conf

# 将配置文件统一放在/etc下
cp supervisord.conf /etc/supervisord.conf

# 为了不将所有新增配置信息全写在一个配置文件里，我们新建一个文件夹，每个配置信息新增一个配置文件，相互隔离
mkdir /etc/supervisord.d/

修改配置文件
vim /etc/supervisord.conf

加入以下配置信息

[inet_http_server]         ; inet (TCP) server disabled by default
port=127.0.0.1:9001        ; ip_address:port specifier, *:port for all iface
username=user              ; default is no username (open server)
password=123               ; default is no password (open server)

[include]
files = /etc/supervisord.d/*.conf
```
   
pip安装产生的二进制文件在`/home/superpika/.local/bin/supervisord`下

加个任务:

```
vim /etc/supervisord.d/tail.conf
```

```
[program:tail1]                                                                            
command=tail -f  /etc/supervisord.conf   ;常驻后台的命令
autostart=true                           ;是否随supervisor启动
autorestart=true                         ;是否在挂了之后重启，意外关闭后会重启，比如kill掉！
startretries=3                           ;启动尝试次数
stderr_logfile=/tmp/tail1.err.log        ;标准输出的位置
stdout_logfile=/tmp/tail1.out.log        ;标准错误输出的位置
```

启动

```
cat /etc/supervisord.conf  # 看一下
supervisorctl shutdown # 关掉之前的
supervisord -c /etc/supervisord.conf # 加载我们的配置

supervisorctl status
```

打开`http://127.0.0.1:9001/`


# 四.常用命令：

1.启动supervisord管理的所有进程`supervisorctl start all`

2.停止supervisord管理的所有进程`supervisorctl stop all`

3.启动supervisord管理的某一个特定进程

```
supervisorctl start program-name // program-name为[program:xx]中的xx
```

4.停止supervisord管理的某一个特定进程 

```
supervisorctl stop program-name  // program-name为[program:xx]中的xx
```
 
5.重启所有进程或某一个特定进程 

```
supervisorctl restart all  // 重启所有
supervisorctl reatart program-name // 重启某一进程，program-name为[program:xx]中的xx
```

6.查看supervisord当前管理的所有进程的状态

```
supervisorctl status
```

7.停止supervisord

```
supervisorctl shutdown
```