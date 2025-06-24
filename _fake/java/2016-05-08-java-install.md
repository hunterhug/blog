---
layout: post
title: "Java安装和环境配置"
date: 2016-05-08
author: 大头
desc: "从事Java开发第一关就是安装JAVA环境. 我们要安装JDK, 全称Java开发全套..."
categories: ["Java"]
tags: ["java"]
permalink: "/language/java-install.html"
---

# Java安装和环境配置

从事Java开发第一关就是安装JAVA环境. 我们要安装JDK, 全称Java开发全套. 其中包含了JRE(运行时环境), 如果你打游戏的时候可能会提示你缺少JRE.

我们要做开发, 一定要安装JDK, 请到[甲谷文](http://www.oracle.com/technetwork/java/javase/downloads/index.html) 下载安装包.

# 下载

下载最新的[JDK9](http://www.oracle.com/technetwork/java/javase/downloads/jdk9-downloads-3848520.html), [Java9提供了新的特征](https://docs.oracle.com/javase/9/whatsnew/). Java兼容性特强, 所以安装最新的.你也可以下载:[JDK8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

```
tar -zxvf jdk-9.0.1_linux-x64_bin.tar.gz
sudo mv jdk-9.0.1 /app
```

以前Java8 lib目录下有:

```
dt.jar是关于运行环境的类库,主要是swing的包   
tools.jar是关于一些工具的类库
```

Java9里面已经没有了.

# 环境配置

## Ubuntu系统

这是Ubuntu环境下的配置, 请首先卸载掉自带的OpenJDK: `sudo apt remove java-common`

Java8

```
vim /etc/profile.d/myenv.sh

export JAVA_HOME=/app/jdk1.8.0_91
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=.:$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH

source /etc/profile.d/myenv.sh
```

Java9

```
vim /etc/profile.d/myenv.sh

export JAVA_HOME=/app/jdk-9.0.1

# 把整个lib包进来
export CLASSPATH=.:$JAVA_HOME/lib
export PATH=.:$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH

source /etc/profile.d/myenv.sh
```

## Windows系统

设置环境变量：

```
JAVA_HOME
C:\Program Files\Java\jdk1.8.0_171

Path
;%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin

CLASSPATH
.;%JAVA_HOME%\lib;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar
```

# 查看是否生效

```
java -version
```

编辑`test.java`:

```java
public class test{
	public static void main(String[] args){
		System.out.println("Hello World");
	}
}
```

编译:

```
java test.java
```

运行:

```
javac test
```