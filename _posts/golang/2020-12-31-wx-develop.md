---
layout: post
title: "使用Golang封装微信第三方登录，小程序登录，小程序订阅消息发送"
date: 2020-12-31
author: 大头
desc: "由于上一份工作的缘故，对接过非常多第三方的服务，包括快递，邮件，短信，支付，当然还有第三方社交登录，开一个文章来讲如何实现微信登录"
categories: ["Golang"]
tags: ["golang"]
permalink: "/language/go-wx-develop.html"
---

# 微信开发相关

关于第三方服务对接，有些封装是必备的，这样老板让你完成一个需求的时候，你就不会抓瞎，当别人嫌弃老板给的需求太难时，你已经在开发了，当别人在查文档，哼唧哼唧地开发了一个多月，老板的脸已经黑了，你已经花了两天时间就搞定了。

第三方服务常见的:

1. 对象存储：阿里云，亚马逊云，腾讯云。
2. 发短信（各大服务商），发邮件（自建或使用私人或企业邮箱等）。
3. 快递，实名认证等。
4. 支付：微信，支付宝，PayPal，Stripe等，分移动端支付，Web端支付，当面你扫我支付，我扫你支付，转账等。
5. 社交登录：微信，支付宝，微博，QQ，一键登录（各种闪验），Twitter等。


多年积累的武器库已经有很多了，某些非常常见的，比如微信登录，现在写成文章分享出来：


`SDK` 封装在：[https://github.com/hunterhug/marmot/tree/master/tool/wx](https://github.com/hunterhug/marmot/tree/master/tool/wx)

如何下载：

```
go get -v github.com/hunterhug/marmot/tool/wx
```

或者 `go.mod` 添加：

```
github.com/hunterhug/marmot v1.0.4
```

你只需参考以下介绍就可以了。

## 微信第三方登录

适用于网页端，移动端APP的微信登录。参考[官方文档](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html)。

需要客户端和服务端联调。

逻辑如下：

1.客户端先调用以下接口，微信用户允许授权第三方应用后，微信将会携带 `CODE` 并且回调服务端 `http://127.0.0.1:9999`：

https://open.weixin.qq.com/connect/qrconnect?appid=wx01fdsffsds&redirect_uri=http://127.0.0.1:9999&response_type=code&scope=snsapi_login,snsapi_userinfo&state=test#wechat_redirect

2.服务端收到回调，会连续调用以下链接获取到用户信息。

https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx0189ce76eadccf91&secret=00eqwfwe1sdfsdf1c8a41f05b4b5&code=CODE&grant_type=authorization_code

https://api.weixin.qq.com/sns/userinfo?access_token=accessToken&openid=openid&lang=zh_CN

你只需使用该 `SDK` 实现登录即可：

```go
	appId := ""
	appSecret := ""
	code := "xxx" // 客户端传给你的，客户端可以是Web前端，IOS，Android
	info, err := Login(appId, appSecret, code)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println(info)
```

## 小程序开发

### 小程序微信登录

[小程序登录](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)区别于网页登录。

需要客户端和服务端联调。

逻辑如下：

1.客户端先调用 `wx.login()` 获取临时登录凭证 `code` 并且 [获取用户信息](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserInfo.html) 获取 `encryptedData` 和 `iv` 并回传到开发者服务器。

2.服务端使用该 `code` 调用 [`auth.code2Session`](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html) 获取解密密钥，然后解密用户信息。

你只需使用该 `SDK` 实现登录即可：

```go
	appId := ""
	appSecret := ""
	code := "xxx"  // 小程序前端传给你的
	encryptedData := "afqaf"  // 小程序前端传给你的
	iv := "ssss"  // 小程序前端传给你的
	info, err := MiniLogin(appId, appSecret, code, encryptedData, iv)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println(info)
```

### 小程序发送 [消息订阅](https://developers.weixin.qq.com/miniprogram/dev/api/open-api/subscribe-message/wx.requestSubscribeMessage.html)。

完全在服务端执行，不需要客户端参与。

1.先获取全局 [`token`](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html)：

```go
	appId := ""
	appSecret := ""
	token, err := GlobalToken(appId, appSecret)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	fmt.Println("token is:", token)
```

2.发送[订阅消息](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/subscribe-message/subscribeMessage.send.html)：

```go
	token, _ := GlobalToken(appId, appSecret)
	openId := "sss"  // 接收者（用户）的 openid
	templateId := ""  // 所需下发的订阅模板id
	page := ""  // 点击模板卡片后的跳转页面，仅限本小程序内的页面。支持带参数,（示例index?foo=bar）。该字段不填则模板无跳转。
	data := map[string]string{"thing1": "2222", "thing7": "sss", "thing3": "dddd"}
	state := wxStateFormal // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版

	err = SendMessage(token, openId, templateId, page, data, state)
	if err != nil {
		fmt.Println("send err:", err.Error())
		return
	}
```

