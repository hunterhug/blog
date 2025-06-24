---
layout: post
title: "Golang安装和配置"
date: 2017-06-30
author: 大头
desc: "Golang安装和配置..."
categories: ["Golang"]
tags: ["golang"]
permalink: "/language/go-install.html"
top: false
--- 

2021年更新。

## Golang环境准备（Unix操作系统）

`Golang` 使用 `1.16.3` 版本（有 `go mod` 了），下载地址：[https://golang.google.cn/dl](https://golang.google.cn/dl) ，并且配置环境变量：

```
vim  ~/.bash_profile

export GO111MODULE=on
export GOPROXY=https://goproxy.cn,direct

export GONOPROXY="gitlab.xxx.com"
export GONOSUMDB="gitlab.xxx.com"
export GOPRIVATE="gitlab.xxx.com"
export GIT_TERMINAL_PROMPT=1

export GOROOT=/Users/pika/Documents/go
export GOBIN=$GOROOT/bin
export PATH=$PATH:$GOROOT/bin

source  ~/.bash_profile

go env
```

其中 `/Users/pika/Documents/go` 是你下载的 `Golang` 源码安装压缩包 `tar.gz` 解压的地方。

为了避免出现私有包拉不下来，报错：

```
go mod unknown revision
```

你还要设置：

```
git config --global url."git@gitlab.xxx.com:".insteadOf "https://gitlab.xxx.com"
```

其中 `gitlab.xxx.com` 是你的私有仓库，注意，配置了上面之后可能还是有问题，继续配置：

```
vim ~/.netrc

machine gitlab.xxx.com login xxxx.xxx password xxxxxx
```

建议下载 Goland IDE：[https://www.jetbrains.com/go](https://www.jetbrains.com/go) ，并且设置 [Preferences] - [Go] ，只选择 [GOROOT] 和勾选 [Go Modules]，其他不变。

Mac 提示: `xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun`，解决：

```
xcode-select --install
```

然后就是三板斧了：

```
go mod tidy
go mod vendor
go mod download
```

发布包时，打标签时强制要求版本，类似： `v1.2.0` 。

## Docker Golang

也可以将源码挂载进`docker`中进行编译, 然后在生产环境下放二进制.如:

```
# 下载源码
git clone https://github.com/hunterhug/huhu.git

# 进入目录
cd huhu

# 拉 golang docker
docker pull golang:1.16

# 将源码挂载进容器, 在容器里面编译
docker run -it --rm -v $PWD:/go/src/github.com/hunterhug/huhu golang:1.16 /bin/bash

cd /go/src/github.com/hunterhug/huhu
GOOS=linux GOARCH=amd64 go build -ldflags "-s -w" -x -o zhihu_linux_amd64 main.go
GOOS=linux GOARCH=386 go build -ldflags "-s -w" -x -o zhihu_linux_386 main.go
GOOS=windows GOARCH=amd64 go build -ldflags "-s -w" -x -o zhihu_windows_amd64.exe main.go
GOOS=windows GOARCH=386 go build -ldflags "-s -w" -x -o zhihu_windows_386.exe main.go
GOOS=darwin GOARCH=amd64 go build -ldflags "-s -w" -x -o zhihu_mac main.go
exit

# 退出容器后目录下会有不同操作系统的二进制文件
# 运行看看
./zhihu_mac


        -----------------
        知乎问题信息小助手

        支持:
        1. 从收藏夹 https://www.zhihu.com/collection/78172986 批量获取很多问题答案
        2. 从问题 https://www.zhihu.com/question/28853910 批量获取一个问题很多答案

        请您按提示操作（Enter）！答案保存在 data 文件夹下，例如打开 28467579-html/1.html ！

        如果什么都没抓到请往 exe 同级目录 cookie.txt 增加 cookie。

        联系：https://github.com/hunterhug/huhu
        -----------------

```