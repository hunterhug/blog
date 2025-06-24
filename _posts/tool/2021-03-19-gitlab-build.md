---
layout: post
title: "搭建私有仓库: Gitlab"
date: 2021-03-19
author: 大头
desc: "托管自己的代码，在自己的私有云上面。"
categories: ["常用工具"]
tags: ["git"]
permalink: "/tool/gitlab-build.html"
---

# 容器安装

用容器安装省时间！安装步骤如下（使用root用户）：

如果开启了 `sshd` 服务，那么需要将 `22` 端口改为其他端口比如 `22222`：

```
vim /etc/ssh/sshd_config

Port 22222
#AddressFamily any
#ListenAddress 0.0.0.0
#ListenAddress ::

systemctl restart sshd
```

然后运行：

```
# 创建文件夹
mkdir /root/gitlab
mkdir /root/gitlab/config
mkdir /root/gitlab/log
mkdir /root/gitlab/data

# 耐心等待
docker pull gitlab/gitlab-ce

# 安装
docker run -d -p 443:443 -p 80:80 -p 22:22 --name gitlab \
    -v /root/gitlab/config:/etc/gitlab \
    -v /root/gitlab/log:/var/log/gitlab \
    -v /root/gitlab/data:/var/opt/gitlab \
    gitlab/gitlab-ce
```

说明：

| 本地文件夹 | 容器内部文件夹 | 用途 |
| --- | --- | --- |
| /root/gitlab/config | /etc/gitlab | GitLab 配置文件 |
| /root/gitlab/log | /var/log/gitlab | GitLab 日志 |
| /root/gitlab/data | /var/opt/gitlab | GitLab 数据 |

运行之后在浏览器输入你机器的 `IP` 地址， 如： 10.0.0.1 或者域名（自己的服务商做A记录）。

第一次进入后按提示操作！


# 配置Gitlab

主要配置邮箱，以及 `git clone` 的地址。

参考： https://docs.gitlab.com/omnibus/settings/smtp.html

```
vim /root/gitlab/config/gitlab.rb

gitlab_rails['gitlab_ssh_user'] = 'git'
gitlab_rails['gitlab_ssh_host'] = '你的IP或域名'
gitlab_rails['gitlab_https'] = false


gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "smtp-mail.outlook.com"
gitlab_rails['smtp_port'] = 587
gitlab_rails['smtp_user_name'] = "gdccmcm14@outlook.com"
gitlab_rails['smtp_password'] = "password"
gitlab_rails['smtp_domain'] = "smtp-mail.outlook.com"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['smtp_openssl_verify_mode'] = 'peer'
```

进入容器进行重启并邮件测试：


```
docker exec -it  gitlab /bin/bash

gitlab-ctl reconfigure

gitlab-rails console
Notify.test_email('gdccmcm14@live.com', 'Message Subject', 'Message Body').deliver_now
```


在 http://你的IP或域名/admin/application_settings/general#js-signup-settings 

Custom Git clone URL for HTTP(S) 填入： http://你的IP或域名

OK!