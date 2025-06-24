---
layout: post
title: "Redis真集群安装"
date: 2018-05-12
author: 大头
desc: "Redis真集群安装..."
categories: ["数据库"]
tags: ["database","redis"]
permalink: "/database/redis-cluster.html"
---

# Redis真集群安装

命令文档:[http://redisdoc.com/index.html](http://redisdoc.com/index.html)

下载：[https://code.google.com/archive/p/redis/downloads](https://code.google.com/archive/p/redis/downloads)

官方地址：[https://redis.io](https://redis.io)

# 安装

请用`root`用户。

## 安装Ruby

### Centos

```
yum -y install ruby ruby-devel rubygems rpm-build

gpg2 --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
curl -L get.rvm.io | bash -s stable
source /usr/local/rvm/scripts/rvm
rvm list known
rvm install 2.4.1

gem install redis
yum install -y rubygems
```


## 安装Redis

编辑配置，然后启动。

```
src/redis-server cluster/7000.conf
src/redis-server cluster/7001.conf
src/redis-server cluster/7002.conf
src/redis-server cluster/7003.conf
src/redis-server cluster/7004.conf
src/redis-server cluster/7005.conf

7000.conf

port 7000
bind 192.168.28.158
daemonize yes
pidfile ./redis_7000.pid
cluster-enabled yes
cluster-config-file nodes_7000.conf
cluster-node-timeout 15000
appendonly yes


redis-trib.rb  create  --replicas  1 192.168.28.158:7000 192.168.28.158:7001  192.168.28.158:7002 192.168.28.158:7003  192.168.28.158:7004  192.168.28.158:7005
```

## 验证

```
./src/redis-cli -h 192.168.28.158-p 7000 -c

> cluster info
```

redis cluster在设计的时候，就考虑到了去中心化，去中间件，也就是说，集群中的每个节点都是平等的关系，都是对等的，每个节点都保存各自的数据和整个集群的状态。每个节点都和其他所有节点连接，而且这些连接保持活跃，这样就保证了我们只需要连接集群中的任意一个节点，就可以获取到其他节点的数据。

Redis集群没有并使用传统的一致性哈希来分配数据，而是采用另外一种叫做哈希槽（hash slot）的方式来分配的，一致性哈希对向集群中新增和删除实例的支持很好，但是哈希槽对向集群新增实例或者删除实例的话，需要额外的操作，需要手动的将slot重新平均的分配到新集群的实例中。

redis cluster 默认分配了 16384 个slot，当我们set一个key时，会用CRC16算法来取模得到所属的slot，然后将这个key分到哈希槽区间的节点上，具体算法就是：CRC16(key)%16384。

Redis集群会把数据存在一个master节点，然后在这个master和其对应的salve之间进行数据同步。当读取数据时，也根据一致性哈希算法到对应的master节点获取数据。只有当一个master 挂掉之后，才会启动一个对应的salve节点，充当master。

需要注意的是：必须要3个或以上的主节点，否则在创建集群时会失败，并且当存活的主节点数小于总节点数的一半时，整个集群就无法提供服务了。