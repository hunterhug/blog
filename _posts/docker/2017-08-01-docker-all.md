---
layout: post
title: "Docker相关环境全套安装文档兼小技能"
date: 2017-08-01
author: 大头
desc: "Docker安装，Harbor仓库安装等..."
categories: ["容器技术"]
tags: ["docker"]
permalink: "/docker/docker-install.html"
top: true
---

2021年更新。

# Docker 相关环境全套安装文档兼小技能

主要安装 `docker`，`docker-compose`，`docker hub` 等。

## Docker 安装

我觉得最好的方式就是参考 [官方](https://docs.docker.com/install/linux/docker-ce/ubuntu) 。

建议参考官方指导！

### A: 有源安装

`Ubuntu` 的 `Docker` 安装：

```
sudo apt-get remove docker docker-engine docker.io containerd runc

sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo apt-key fingerprint 0EBFCD88

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io

sudo docker version
```

`CentOS` 的 `Docker` 安装：

```
yum remove docker \
             docker-client \
             docker-client-latest \
             docker-common \
             docker-latest \
             docker-latest-logrotate \
             docker-logrotate \
             docker-selinux \
             docker-engine-selinux \
             docker-engine

yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

yum list docker-ce --showduplicates | sort -r

yum install docker-ce

systemctl start docker

systemctl enable docker

docker version
```

### B: 无源安装

适用于 `Ubuntu`，当你的机器没有外网时你可以这么做:

先下载已 [编译包](https://download.docker.com/linux/ubuntu/dists) ：

```
artful/
bionic/
cosmic/
disco/
eoan/
focal/
groovy/
hirsute/
trusty/
xenial/
yakkety/
zesty/
```

一脸懵逼，那么多路径，你先要知道 `Ubuntu` 是哪个版本：

```
lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 20.04.2 LTS
Release:        20.04
Codename:       focal
```

操作系统是 `focal` 版本的。

找到对应的包下载： [https://download.docker.com/linux/ubuntu/dists/focal/pool/stable/amd64/docker-ce_20.10.8~3-0~ubuntu-focal_amd64.deb](https://download.docker.com/linux/ubuntu/dists/focal/pool/stable/amd64/docker-ce_20.10.8~3-0~ubuntu-focal_amd64.deb) 。

然后执行以下命令即可：

```
wget https://download.docker.com/linux/ubuntu/dists/focal/pool/stable/amd64/docker-ce_20.10.8~3-0~ubuntu-focal_amd64.deb
sudo dpkg -i docker-ce_20.10.8~3-0~ubuntu-focal_amd64.deb
sudo docker run helloworld
```

下面安装老版本👇部分可以忽视，因为你不需要那么老版本的 `Docker` 。

> 在2017年的3月1号之后，Docker的版本命名开始发生变化，同时将CE版本和EE版本进行分开， 18.03表示18年3月发布。

离线安装老版本 `docker(docker-engine depends on libltdl7 (>= 2.4.6);)`：

```
wget https://apt.dockerproject.org/repo/pool/main/d/docker-engine/docker-engine_1.12.1-0~xenial_amd64.deb
wget http://archive.ubuntu.com/ubuntu/pool/main/libt/libtool/libltdl7_2.4.6-4_amd64.deb
dpkg -i *.deb
```

## Docker-compose 安装

我们可以使用 `docker-compose` 来对多个容器进行管理，单机管理利器。如果是多机管理，推荐 `docker swarm` 或者 `kubernetes` 。

离线安装：

```
wget https://github.com/docker/compose/releases/download/1.29.2/docker-compose-`uname -s`-`uname -m`
mv docker-compose-Linux-x86_64 /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

没有权限时请加 `sudo` 。

## Harbor v1.6.0 安装（老版本不建议，可以跳过）

VMware 公司开源的企业级的 `Docker Registry` 项目：[Harbor](https://github.com/goharbor/harbor) ，安装参考: [官方](https://github.com/goharbor/harbor/blob/master/docs/installation_guide.md) 。

有了仓库，我们可以直接 push 镜像上去，然后从其他地方拉，不用借助U盘。

环境依赖较新的 `docker1.10+` 和 `docker-compose1.60+` 和 `python2.7`，我们选择离线安装方式：

```
wget https://storage.googleapis.com/harbor-releases/release-1.6.0/harbor-offline-installer-v1.6.0-rc3.tgz
tar xvf harbor-offline-installer-v1.6.0-rc3.tgz
cd harbor
```

编辑`docker-compose.yml`：

```
  proxy:
    image: goharbor/nginx-photon:v1.6.0
    container_name: nginx
    restart: always
    volumes:
      - ./common/config/nginx:/etc/nginx:z
    networks:
      - harbor
    ports:
      - 8888:80
      - 1443:443
      - 4443:4443
```

修改`common/templates/registry/config.yml`文件加入`8888`端口：

```
vim common/templates/registry/config.yml

auth:
  token:
    issuer: harbor-token-issuer
    realm: $public_url:8888/service/token
    rootcertbundle: /etc/registry/root.crt
    service: harbor-registry

```

编辑`harbor.cfg`：

```
hostname = 192.168.152.12
harbor_admin_password = admin
```

启动并登陆：

```
sudo su
ufw allow 8888
./prepare
docker-compose up -d
```

打开：http://192.168.152.12:8888 ，账号/密码:admin

## Harbor v2.3.2 安装（推荐）

我们安装新一点的版本，并配置域名。新版本配置更简单:

```
wget https://github.com/goharbor/harbor/releases/download/v2.3.2/harbor-offline-installer-v2.3.2.tgz

tar xvf harbor-offline-installer-v2.3.2.tgz

```

编辑 `harbor.yml` 文件：

```
cd  harbor

cp harbor.yml.tmpl harbor.yml

vim harbor.yml

# 修改域名成自己的
# 如果你不想配置域名，可以配置IP，如 122.12.122.122
hostname: habour.mydomain.com

http:
  port: 38880  # 端口也改掉

https:
  port: 38443  # 端口也改掉
  # 这个配置安全证书，如果使用的是IP，可以忽视
  # sudo certbot certonly --preferred-challenges dns --manual -d "*.mydomain.com" --server https://acme-v02.api.letsencrypt.org/directory
  certificate: /etc/letsencrypt/live/mydomain.com/fullchain.pem
  private_key: /etc/letsencrypt/live/mydomain.com/privkey.pem

# 密码
harbor_admin_password: admin
```

安装：

```
./prepare
docker-compose up -d
```

打开： [https://habour.mydomain.com:38443](https://habour.mydomain.com:38443) 。

测试：

```
docker login habour.mydomain.com:38443
docker pull hello-world
docker tag hello-world habour.mydomain.com:38443/library/hello-world
docker push habour.mydomain.com:38443/library/hello-world
```

https 证书生成可见： [https://certbot.eff.org](https://certbot.eff.org) ，先安装 `certbot` ：

```
# 适用 Mac 系统
brew install certbot

# 适用 Ubuntu 系统
snap install certbot
```

按照提示操作：

```
sudo certbot certonly --preferred-challenges dns --manual -d "*.mydomain.com" --server https://acme-v02.api.letsencrypt.org/directory

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/mydomain.com/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/mydomain.com/privkey.pem
   Your cert will expire on 2019-10-23. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot
   again. To non-interactively renew *all* of your certificates, run
   "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

## 配置 Docker

你可以配置某些仓库地址(第一个是阿里云加速仓库地址，第二个忽略https安全)

```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://ztndgg1k.mirror.aliyuncs.com"],
  "insecure-registries": ["192.168.0.88:8888"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

然后登录推送:

```
sudo docker login http://192.168.0.88:8888
sudo docker tag mysql:5.7 192.168.0.88:8888/public/mysql:5.7
docker push  192.168.0.88:8888/public/mysql:5.7
```

## Docker 特定场景使用

### 离线镜像

如果不能访问外网，那么可以用 `save` 和 `load` 来保存和加载镜像：

```
docker save xxx:1.0 > /root/api1.0.tar
docker  load < /root/api1.0.tar
docker images
```

### 注意事项

开发和使用 `docker` 久了后,有些体会:

1. `ENTRYPOINT`，表示镜像在初始化时需要执行的命令，不可被重写覆盖，CMD 参数可以接在其后面,所以那些可以变化的参数都写在 CMD
2. `CMD`，表示镜像运行默认参数，可被重写覆盖
3. `ENTRYPOINT/CMD` 都只能在文件中存在一次，并且最后一个生效, 多个存在，只有最后一个生效，其它无效！
4. 需要初始化运行多个命令，彼此之间可以使用 && 隔开，但最后一个须要为无限运行的命令，不然容器运行后就退出了

## Docker 小技巧

### 修改目录空间

先 `systemctl stop docker` 停止 docker。

迁移 `/var/lib/docker` 目录下的文件到新创建的目录 `/data/docker/lib`:

```
rsync -avz /var/lib/docker /data/docker/lib/
```

编辑 `/etc/docker/daemon.json` 添加如下参数：

```
{
"graph": "/data/docker/lib/docker"
}
```

重新加载d ocker，并重启 docker 服务：

```
systemctl daemon-reload && systemctl restart docker
```

检查docker是否变更为新目录 `/data/docker/lib/docker`:

```
docker info
```

### 清理操作

我们在使用 Docker 一段时间后，系统一般都会残存一些临时的、没有被使用的镜像文件，可以通过以下命令进行清理：

```
docker image prune
```

它支持的子命令有：

`-a, --all`: 删除所有没有用的镜像，而不仅仅是临时文件；

`-f, --force`：强制删除镜像文件，无需弹出提示确认；

其他docker清理方法：

`docker system df` 类似于Linux上的df命令，用于查看Docker的磁盘使用情况。

`docker system prune` 可以用于清理磁盘，删除关闭的容器、无用的数据卷和网络，以及dangling镜像(即无tag的镜像)。

`docker system prune -a` 清理得更加彻底，可以将没有容器使用Docker镜像都删掉。 注意，这两个命令会把你暂时关闭的容器，以及暂时没有用到的Docker镜像都删掉了。

## 配置k8s可以拉取私有镜像仓库

创建 `secret`：

```
# 域名方式
kubectl create secret docker-registry myharbor \
--docker-server=mydomain.com \
--docker-username=admin \
--docker-password=admin

# 私有IP方式
kubectl create secret docker-registry myharbor \
--docker-server=122.12.122.122:8888 \
--docker-username=admin \
--docker-password=admin
```

查看 `secret`：

```
kubectl get secret |grep myharbor

kubectl get secret myharbor --output="jsonpath={.data.\.dockerconfigjson}" | base64 --decode
```

创建一个 `my-nginx.yaml`：

```
apiVersion: v1
kind: Service
metadata:
  name: my-nginx-service
spec:
  type: NodePort
  selector:
    app: my-nginx
  ports:
      # 默认情况下，为了方便起见，`targetPort` 被设置为与 `port` 字段相同的值。
    - port: 80
      targetPort: 80
      # 可选字段
      # 默认情况下，为了方便起见，Kubernetes 控制平面会从某个范围内分配一个端口号（默认：30000-32767）
      nodePort: 30007
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-nginx
  template:
    metadata:
      labels:
        app: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: 122.12.122.122:8888/private/nginx:1.14.2
        ports:
        - containerPort: 80  
      # 注意，就是这里
      imagePullSecrets:
      - name: myharbor
```

运行：

```
# 启动三个副本的Nginx
kubectl apply -f ./my-nginx.yaml
```

查看：

```
# 查看部署情况
kubectl get deployments

# 查看部署情况
kubectl rollout status deployment/nginx-deployment

# 获取 Pod 信息
kubectl get pods -o wide

kubectl get svc
```

我们暴露了 `NodePort:30007`，打开 [http://122.12.122.122:30007](http://122.12.122.122:30007) 查看。

### 疑难杂症

如果我们的镜像仓库不是 `https` 的，运行会失败：

```
kubectl get pod                                       

NAME                                READY   STATUS             RESTARTS   AGE
nginx-deployment-745c4bdd5c-bm8jp   0/1     ImagePullBackOff   0          4m23s
nginx-deployment-745c4bdd5c-jqdgf   0/1     ImagePullBackOff   0          4m23s
nginx-deployment-745c4bdd5c-rk8kn   0/1     ImagePullBackOff   0          4m23s

kubectl describe pod/nginx-deployment-745c4bdd5c-bm8jp

Failed to pull image "122.12.122.122:8888/private/nginx:1.14.2": rpc error: code = Unknown desc = Error response from daemon: Get https://122.12.122.122:8888/v2/: http: server gave HTTP response to HTTPS client
```


在k8s集群机器允许 `Docker` 开启 `insecure-registries`：

```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
"insecure-registries": ["122.12.122.122:8888"]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```

重新部署：

```
kubectl rollout restart deploy/nginx-deployment
```