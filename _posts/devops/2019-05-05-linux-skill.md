---
layout: post
title: "Linux通用小技能"
date: 2019-05-05
author: 大头
desc: "Linux通用小技能.."
categories: ["运维相关"]
tags: ["linux"]
permalink: "/devops/linux-skill.html"
---

# Linux通用小技能

# 前言

无论你用`ubuntu`还是`centos`,通通没问题，运维这东西，踩坑写文档就是了。

# 小技能

## 新磁盘挂载

不管是阿里云还是腾讯云，还是自己的机器，请记住这条命令。

```
mkfs.ext4 /dev/vdb
echo '/dev/vdb /opt ext4 defaults 0 0' >> /etc/fstab
mount -a
```

## 不得不装的语言

无论你们家用什么开发语言，总有工具或环境依赖可爱的Java。那么：

安装Java下载：[http://download.oracle.com/otn-pub/java/jdk/8u191-b12/2787e4a523244c269598db4e85c51e0c/jdk-8u191-linux-x64.tar.gz](http://download.oracle.com/otn-pub/java/jdk/8u191-b12/2787e4a523244c269598db4e85c51e0c/jdk-8u191-linux-x64.tar.gz)

```
vim /etc/profile.d/myenv.sh
export JAVA_HOME=/app/jdk1.8.0_191
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=.:$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH
source /etc/profile.d/myenv.sh
```

查看是否生效

```
java -version
```

编辑test.java:

```
public class test{
    public static void main(String[] args){
        System.out.println("Hello World");
    }
}
```

编译:

```
javac test.java
```

运行:

```
java test
```

## 增加用户

不想让小弟使用最高的权限，那么请：

```
userdel xiaodi
useradd -r -m -s /bin/bash xiaodi
passwd xiaodi

ssh xiaodi@ip
```

想让小弟有至高权限，请：

```
vim /etc/sudoers

xiaodi ALL=(ALL)ALL
```

## 前端兄弟的需求

```
wget https://nodejs.org/dist/v10.13.0/node-v10.13.0-linux-x64.tar.xz
ln -s /home/ubuntu/node-v10.13.0-linux-x64/bin/node /usr/local/bin/node
ln -s /home/ubuntu/node-v10.13.0-linux-x64/bin/npm /usr/local/bin/npm
```

简单粗没有理由！

切记`npm`不能用`root`用户来运行！


## 测试兄弟的福音，Python是世界上最好的语言

1.下载指定的包到指定文件夹。

```
pip freeze > requirements.txt  # 将已经通过pip安装的包的名称记录到 requirements.txt文件中
```

创建存放安装包的目录：`mkdir /packs`

```
pip install   --download   /packs  pandas
```

2.安装指定的离线包

```
pip install   --no-index   --find-links=/packs/   pandas
```

如何发布pip的包，通用配置分享如下：

```
# -*- coding: utf-8 -*-
import os
import sys

from setuptools import setup

description = "This is Python SDK"
about = open("./README.md", "rb").read().decode("utf-8", "ignore")
# print(about)

Version = '1.3.2'


def git_push():
    os.system('git add --all')
    os.system('git commit -m \"setup python dodo:v%s\"' % Version)
    os.system("git tag -d v%s" % Version)
    os.system("git tag v%s" % Version)
    os.system("git push origin :refs/tags/v%s" % Version)
    os.system("git push")
    os.system("git push --tags")


# 'setup.py publish' shortcut.
if sys.argv[-1] == 'publish':
    git_push()
    # pip install wheel
    os.system("rm -rf dist/*")
    os.system('python setup.py sdist bdist_wheel')
    # pip install twine
    os.system('twine upload dist/* --verbose')
    sys.exit()

if sys.argv[-1] == 'test':
    os.system('python setup.py develop')
    sys.exit()

if sys.argv[-1] == 'git':
    git_push()
    sys.exit()

packages = ['pyyourpackage']

requires = [
    'requests>=2.19.1',

]

setup(
    name='baobao',  # 应用名
    version=Version,  # 版本号
    author="",
    author_email="",
    url="",
    description=description,
    long_description=about,
    license="",
    packages=packages,
    package_dir={packages[0]: 'baobao'},
    platforms=['any'],
    install_requires=requires,
    python_requires=">=2.7, !=3.0.*, !=3.1.*, !=3.2.*, !=3.3.*",
)

```

然后

```
python setup.py build
python setup.py publish
```

## 新机器到了怎么解决

机房到了新机器，老板让你装机迁移服务，必要工作：

先装个Ubuntu吧~~

展示全部网卡

```
ifconfig -a
```

启用网卡`enp2s0`

```
ifconfig enp2s0 up
```

完成网卡配置

```
sudo vi /etc/network/interfaces
```

输入:

```
auto enp2s0
iface enp2s0 inet static
address 192.168.2.10
network 255.255.255.0
gateway 192.168.2.1
```

重启网络：

```
/etc/init.d/networking restart
```


## 安装SSH 

到了这里了，你要连接IP了，如果不能连接ssh，请：

```
sudo apt-get install openssh-server
sudo service ssh start

ssh xiaodi@IP
```

请使用非root用户登陆，root用户默认禁止ssh。

可以修改配置文件 `sshd_config` 里端口号:

```
vim /etc/ssh/sshd_config

Port 40339 #将注释打开，并且修改端口号
```

重启sshd服务:

```
service sshd restart
```

这时依然无法远程，因为防火墙没有通过端口40339的访问

解决：

```
service iptables stop
```

远程主机访问时:

```
ssh test -p 40339
```

## SSH开机启动

````
vim  /etc/rc.local

service sshd start
````

## Wifi已禁用

```
sudo service NetworkManager stop
sudo rm /var/lib/NetworkManager/NetworkManager.state
sudo service NetworkManager start
```

# 写在最后

运维真的很无趣。