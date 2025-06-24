---
layout: post
title: "Golang高并发抓取HTML图片"
date: 2017-10-12
author: 大头
desc: "Golang高并发抓取HTML图片..."
categories: ["Golang"]
tags: ["golang"]
permalink: "/language/go-picture.html"
--- 

# Golang高并发抓取HTML图片

# 使用准备

1.安装Golang

2.下载爬虫包
```
go get -v github.com/hunterhug/marmot/util
go get -v github.com/hunterhug/marmot/tool
```

# 程序

该程序只能抓取HTML中`src="http"`中的图片, 必须带有协议头`http(s)`, 其他如`data-src`和混淆在JS中的无法抓取

See: [https://github.com/hunterhug/marmot/blob/master/example/practice/pictures/main.go](https://github.com/hunterhug/marmot/blob/master/example/practice/pictures/main.go) 。

```go
package main

import (
	"fmt"
	"github.com/hunterhug/marmot/util"
	"github.com/hunterhug/marmot/tool"
)

// Num of miner, We can run it at the same time to crawl data fast
var MinerNum = 5

// You can update this decide whether to proxy
var ProxyAddress interface{}

func main() {
	// You can Proxy!
	// ProxyAddress = "socks5://127.0.0.1:1080"

	fmt.Println(`Welcome: Input "url" and picture keep "dir"`)
	fmt.Println("---------------------------------------------")
	url := util.Input(`URL(Like: "http://publicdomainarchive.com")`, "http://publicdomainarchive.com")
	dir := util.Input(`DIR(Default: "./picture")`, "./picture")
	fmt.Printf("You will keep %s picture in dir %s\n", url, dir)
	fmt.Println("---------------------------------------------")

	// Start Catch
	err := tool.DownloadHTMLPictures(url, dir, MinerNum, ProxyAddress)
	if err != nil {
		fmt.Println("Error:" + err.Error())
	}
}
```

解释均写, 运行后:

```
Welcome: Input "url" and picture keep "dir"

		
		
---------------------------------------------
URL(Like: "http://publicdomainarchive.com")

DIR(Default: "./picture")

You will keep http://publicdomainarchive.com picture in dir ./picture
---------------------------------------------
SP0: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_02_03_modern.jpg
SP4: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_03_03_google_dark.png
SP2: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_09_03_free-stock-photos-public-domain-images-003-667x1000-192684_667x675.jpg
SP4: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_05_03_powered-by-wp-engine.png
SP4: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_05_03_divi.png
SP2: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_09_03_free-stock-photos-public-domain-images-002-1000x667.jpg
SP4: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_05_03_public-domain-mark.png
SP3: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_01_03_public-domain-images-free-stock-photos008-1000x625.jpg
SP0: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_09_03_Weekly.jpg
SP1: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_11_03_free-stock-photos-public-domain-images-054-1000x667.jpg
SP3: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_10_03_instagram_dark.png
SP0: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_02_03_vintage.jpg
SP2: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_09_03_free-stock-photos-public-domain-images-001-1000x667.jpg
SP1: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_11_03_free-stock-photos-public-domain-images-070-1000x667.jpg
SP3: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_03_03_twitter02_dark.png
SP2: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_01_03_public-domain-images-free-stock-photos001-1000x750-167066_1000x675.jpg
SP1: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_09_03_free-stock-photos-public-domain-images-035-1000x667.jpg
SP3: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_03_03_facebook_dark.png
SP0: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_11_03_free-stock-photos-public-domain-images-060-1000x667.jpg
SP1: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_09_03_free-stock-photos-public-domain-images-013-1000x667.jpg
---------------------------------------------
URL(Like: "http://publicdomainarchive.com")



SP4: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_05_03_powered-by-wp-engine.png
SP4: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_05_03_divi.png
SP2: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_09_03_free-stock-photos-public-domain-images-002-1000x667.jpg
SP4: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_05_03_public-domain-mark.png
SP3: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_01_03_public-domain-images-free-stock-photos008-1000x625.jpg
SP0: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_09_03_Weekly.jpg
SP1: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_11_03_free-stock-photos-public-domain-images-054-1000x667.jpg
SP3: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_10_03_instagram_dark.png
SP0: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_02_03_vintage.jpg
SP2: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_09_03_free-stock-photos-public-domain-images-001-1000x667.jpg
SP1: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_11_03_free-stock-photos-public-domain-images-070-1000x667.jpg
SP3: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_03_03_twitter02_dark.png
SP2: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_01_03_public-domain-images-free-stock-photos001-1000x750-167066_1000x675.jpg
SP1: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_09_03_free-stock-photos-public-domain-images-035-1000x667.jpg
SP3: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2014_03_03_03_facebook_dark.png
SP0: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_11_03_free-stock-photos-public-domain-images-060-1000x667.jpg
SP1: Keep in ./picture/http_04__03__03_publicdomainarchive.com_03_wp-content_03_uploads_03_2017_03_09_03_free-stock-photos-public-domain-images-013-1000x667.jpg
---------------------------------------------
URL(Like: "http://publicdomainarchive.com")
```