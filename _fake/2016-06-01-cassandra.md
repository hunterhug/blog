---
layout: post
title: "Cassandra官方介绍及安装"
date: 2016-06-01
author: 大头
desc: "这个数据库有很高的伸缩性和可用性，你完全不需要向性能妥协．在硬件或者云设施上做修改..."
categories: ["数据库"]
tags: ["database"]
permalink: "/database/cassandra.html"
--- 

# Cassandra官方介绍及安装

这个数据库有很高的伸缩性和可用性，你完全不需要向性能妥协．在硬件或者云设施上做修改
官网:[Cassandra官网](http://cassandra.apache.org/)

# 一.简介
>cassandra这个数据库有很高的伸缩性和可用性，你完全不需要向性能妥协．在硬件或者云设施上做修改，
>就能进行线性扩展，并且容错能力十足，很合适去放你的关键数据．在多个数据中心进行数据复制,同步这个能力，
>绝对是一流的，数据的抽取绝对是低延迟性的，并且你可以心平气和地坐着喝茶，因为你知道就算机房断电了，你还会活着！！！

# 二.亮点

## 生产（PROVEN）

>cassandra已经用在很多生产上了，足够证明有用．比如Github,eBay,Instagram超过1500个公司使用，
>而这些公司有巨大，活跃的数据集．

## 容错性（FAULT TOLERANT）

>数据会自动复制到多个节点，而且不会出错，同理，在多个数据中心之间复制也是可以的，如果节点死掉，
>不用担心，不需要停掉cassandra，就能替换这个节点．

## 性能（PERFORMANT）

>cassandra在水准和[实际应用](http://blog.markedup.com/2013/02/cassandra-hive-and-hadoop-how-we-picked-our-analytics-stack/)上，
>一直都优于其他流行的NoSQL替代品，主要是因为它的[基础架构选择](http://www.datastax.com/dev/blog/2012-in-review-performance)．

## 去中心化（DECENTRALIZED）

>没有单点故障。没有网络瓶颈。集群中的每个节点是一模一样的，因为数据复制和同步的容错保证！

## 伸缩性（SCALABLE）

>一些特别大的生产部署,包括苹果公司,拥有超过75000个节点存储超过10 PB的数据,Netflix(2500个节点,420TB,每天超过1万亿个请求),中文搜索引擎Easou(270个节点,300TB,每天超过8亿请求),
>和eBay(超过100个节点,100TB)。

## 持久性（DURABLE）

>cassandra非常适合那些绝对不能丢失数据的应用，即使整个数据中心挂掉．

## 一切尽在控制中（YOU'RE IN CONTROL）

>每次更新都可以选择异步或者同步复制，高可用的异步操作，包括优化特征Hinted Handoff和Read Repair.

## 灵活性（ELASTIC）

>新机器一加入，读写吞吐量线性增加，不需要关机和中断应用．

## 专家支持（PROFESSIONALLY SUPPORTED）

>cassandra为第三方使用者提供服务，要钱的！

# 三.安装Cassandra

1. 下载安装包[cassandra](http://cassandra.apache.org)

2. 运行

```
[root@clicki-v4 apache-cassandra-2.2.6]# bin/cassandra
[root@clicki-v4 apache-cassandra-2.2.6]# bin/cqlsh 192.168.11.74
cqlsh> 
```

3. 配置

```
# vim conf/cassandra.yaml 

data_file_directories:
     - /data/db/cassandra
commitlog_directory: /data/logs/db/cassandra
saved_caches_directory: /data/db/cassandra/saved_caches
seed_provider:
    - class_name: org.apache.cassandra.locator.SimpleSeedProvider
      parameters:
          # seeds is actually a comma-delimited list of addresses.
          # Ex: "<ip1>,<ip2>,<ip3>"
          - seeds: "172.16.0.10"
listen_interface: eth0
native_transport_port: 9042
rpc_interface: eth0
```

4. 用法

```
cqlsh:clicki_v4> desc clicki_v4.  //这样很好!!
app_visitor     sdk_visitor     visitor         visitor_reload
cqlsh:clicki_v4> SELECT * from visito
```