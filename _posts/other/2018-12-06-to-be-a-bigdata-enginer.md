---
layout: post
title: "如何成为一名大数据工程师"
date: 2018-12-06
author: 大头
desc: "自从2012年开始,互联网技术突飞猛进,到如今2018年,已经产生了抖音,滴滴打车,ofo,王者荣耀等巨大互联网产品...."
categories: ["随笔杂记"]
tags: ["java","大数据"]
permalink: "/x/to-be-a-bigdata-enginer.html"
---

# 如何成为一名大数据工程师

# 一. 前言

自从2012年开始,互联网技术突飞猛进,到如今2018年,已经产生了抖音,滴滴打车,ofo,王者荣耀等巨大互联网产品。

在这些产品的历史轨迹中,我暂且将IT互联网行业分为三个产业ABC,人工智能/大数据/云计算,虽然有失偏颇。

首先互联网产品访问的人数居多,并发量巨高,而TCP连接通讯在一台再怎么牛的单机上,也会很快出现CPU,内存或硬盘资源不够的情况,这时需要有种手段,能让你自动解决资源分配,这就是C,Cloud,云计算,需要解决分布式负载访问,容灾备份等问题。程序员需要通过设计各种中间件来进行压力分流,尽可能人工对业务进行细粒度拆分,然后可弹性资源使用。目前微服务和容器运维是一个常见方案。比如,网站访问,可以用Nginx来负载均衡分流到十台机器,而十台机器可能需要访问到缓存redis,可以再根据主键Hash分流....(注意：事实上很多情况都是程序员自己根据业务来设计分布式负载,如果量翻倍还需改进,但事实上翻倍一般意味着投资人更多,能吸收更多人才来改进)。

中间件支撑了很多业务的落地,但是数据越来越多,越来越杂。如何更快的存储数据,如何存海量大体积数据,如何存海量小体积数据,如何更快地拿数据,于是出现了很多的分布式数据库中间件。由于数据的存储和数据的计算更多的和业务有关,出现了数据仓库,数据清洗,数据建模等,这部分为B,BigData,大数据,目前最流行的有Hadoop生态圈,分两块：分布式存储,分布式计算。（注：底层技术仍可以说是云计算）

数据很多,我们也清洗了很多数据,但是数据有什么用,早期由数据挖掘建模,用传统模型来进行业务决策,如今神经网络,深度学习,监督学习,统称机器学习LM,大统了该领域,称A,Artifical,人工智能。

现在很多人都想要去做算法,如AI,比如我本科毕业了,就想进大公司做AI。但是,你根本竞争不过硕士博士。而目前大公司很多AI其实是调参工程师。而云计算开发又需要不少经历来磨练,一般没两三年经验没人要,而事实上,你最缺的就是经验。云计算要摩擦摩擦,就如我一般。所以,大数据开发是相对容易入门的岗位。你只需具备基本的计算机常识,掌握一两门语言,研究一下Hadoop生态圈并简单使用即可。

除此ABC之外,还有传统的Web前后端开发,移动客户端开发,游戏引擎开发等,路还有很多哈。

# 二. 大数据工程师岗位介绍

其实目前大数据工程师有两个方向,一种是专门做业务的,负责将Hadoop底层的数据倒来倒去,或者不同源的数据进行转换,做下简单数据清洗或者统计后给到算法或开发端,这个不在我们的考虑范围。

另外一种是偏开发的,巨杂无比,根据公司业务有所不同,但是如果你熟悉Hadoop生态圈,什么业务场景都可以很快熟悉的。

学习以下的知识,很快你就可以进入大数据的世界了。下面的一些软件都是以比较简单的方式搭建, 因为在生产环境下,大部分都是以多机部署的方式.然而, 由于初学, 我们第一个目的就是知道这是什么,然后知道怎么使用.

# 三. 前期准备

工欲善其事必先利其器.

## (1)编程语言

请掌握Java或Python语言基本语法。所以,学习大数据之前也要一定的计算机基础,学习这两门语言也是一个漫长的过程,但是不努力哪里会有得到好结果的喜悦呢？你说不努力得到好结果,那你不会很心虚吗。坑慢慢填,早晚要填的。学习编程语言,第一步就是找一些教材或视频,然后装下环境,边学习边敲代码实践。

## (2)常识和挑战

数据越来越多,而数据类型分：

1. 结构化数据：关系数据。
2. 半结构化数据：XML数据。
3. 非结构化数据：Word, PDF, 文本,媒体日志。

数据的挑战：

1. 采集数据
2. 存储数据
3. 搜索数据
4. 传输数据
5. 分析数据

数据从哪里来,采集数据很重要。

数据如何存储,存在哪里。

数据太大存不下怎么办。

数据搜索,在海量数据怎么找到我想要的数据。

我如何将大批数据传输到另外的地方。

我想要统计海量数据中某城市的男女比例。这些都是巨大的问题。

## (3)Hadoop3.1.1搭一下

初学的时候,我们不求甚解,先搭建起来Hadoop服务玩一下再探究深层。官方文档在此[Hadoop 3.1.1](http://hadoop.apache.org/docs/r3.1.1/index.html)

Hadoop有分布式文件系统HDFS的功能,也有MapReduce（分而治之）的计算模式提供,生态圈也很完善,市面上招人都需要会这个！

搭了这个后,可以将文件存上去,而且丢多少上去都没关系,只要你的集群机器够多！

我的实验操作系统是`ubuntu16.04`, `ip addr`知道局域网IP为`192.168.0.21`。

### 1.软件包下载

从我国比较快的镜像站下载,为方便,建一个所有用户都能访问的`/app/hadoop`目录：

```
sudo mkdir /app
sudo chmod 777 /app
mkdir /app/hadoop
cd /app/hadoop
wget https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/hadoop-3.1.1/hadoop-3.1.1.tar.gz
```

其中,文件将下载在`/app/hadoop`,请注意这个路径！

解压：

```
cd /app/hadoop
tar zxvf hadoop-3.1.1.tar.gz
cd hadoop-3.1.1/
```

Hadoop有三种部署模式,单机部署,伪分布式部署,真分布式部署。

因为Hadoop变化很快,所以最新的安装方式请参考官网。这里使用伪分布式搭建,保证可以跑起来即可,生产级别的有专门的运维岗位处理,这也属于以后的进阶技能,就是你需要会运维Hadoop!

我们使用`伪分布式部`安装Hadoop。

### 2.SSH授权

先授下权,保证可以ssh访问。

```
# 如果未装此软件请安装
# sudo apt-get install openssh-server
# sudo service ssh start

ssh-keygen -t rsa 
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 0600 ~/.ssh/authorized_keys

ssh username@127.0.0.1
```

其中username为操作系统的用户名。

### 3.安装Java并配置环境变量

装下Java,毕竟生态圈大部分用Java写的：

到此下载：[JDK8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

将其解压到`/app/hadoop`同个目录。

`sudo vim /etc/profile.d/hadoop.sh`,添加:

```
# 这是Java的配置
export JAVA_HOME=/app/hadoop/jdk1.8.0_191
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=.:$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH

# 这是Hadoop的配置
export HADOOP_HOME=/app/hadoop/hadoop-3.1.1
export HADOOP_MAPRED_HOME=$HADOOP_HOME 
export HADOOP_COMMON_HOME=$HADOOP_HOME 
export HADOOP_HDFS_HOME=$HADOOP_HOME 
export YARN_HOME=$HADOOP_HOME 
export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native 
export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin 
export HADOOP_INSTALL=$HADOOP_HOME
```

环境变量生效请`source /etc/profile.d/hadoop.sh`,然后:

```
java --version
```

### 4.hadoop配置

重置hadoop的一些配置:

(1).编辑`hadoop-env.sh`

```
vim  /app/hadoop/hadoop-3.1.1/etc/hadoop/hadoop-env.sh
```

添加:

```
export JAVA_HOME=/app/hadoop/jdk1.8.0_191
export HADOOP_OPTS="-Djava.library.path=${HADOOP_HOME}/lib/native" 
```

(2).编辑`core-site.xml`

```
vim  /app/hadoop/hadoop-3.1.1/etc/hadoop/core-site.xml
```

添加:

```
<configuration>
   <property>
      <name>fs.default.name </name>
      <value>hdfs://localhost:9000</value> 
   </property>
</configuration>
```

(3).编辑`yarn-site.xml`

```
vim  /app/hadoop/hadoop-3.1.1/etc/hadoop/yarn-site.xml
```

添加

```
<!-- 指定nodemanager启动时加载server的方式为shuffle server -->
<property>
	<name>yarn.nodemanager.aux-services</name>
	<value>mapreduce_shuffle</value>
</property>

```

(4).编辑`mapred-site.xml`

```
vim  /app/hadoop/hadoop-3.1.1/etc/hadoop/mapred-site.xml
```

添加：

```
<configuration>
   <property> 
      <name>mapreduce.framework.name</name>
      <value>yarn</value>
   </property>
</configuration>
```

(5).编辑`hdfs-site.xml`

```
vim  /app/hadoop/hadoop-3.1.1/etc/hadoop/hdfs-site.xml
```

添加:

```
<configuration>
   <property>
      <name>dfs.replication</name>
      <value>1</value>
   </property>
   <property>
      <name>dfs.name.dir</name>
      <value>file:///app/hadoop/hdfs/namenode</value>
   </property>
   <property>
      <name>dfs.data.dir</name> 
      <value>file:///app/hadoop/hdfs/datanode</value> 
   </property>
   <property>
       <name>dfs.permissions</name>
       <value>false</value>
   </property>
</configuration>
```

其中`/app/hadoop/hdfs`是存储的位置,请:

```
mkdir /app/hadoop/hdfs
mkdir /app/hadoop/hdfs/namenode
mkdir /app/hadoop/hdfs/datanode
```

### 5.初始化并启动

执行初始化HDFS文件系统：

```
hdfs namenode -format
```

启动HDFS：

```
start-dfs.sh 
```

启动yarn守护进程：

```
start-yarn.sh 
```

输入：

```
jps
```

可以看到服务（稍后会介绍）：

```
31472 NameNode
31842 SecondaryNameNode
31638 DataNode
32810 Jps
32076 ResourceManager
32223 NodeManager
```

### 6.验证

打开`http://127.0.0.1:9870`可以看到`Hadoop Web`界面,你也可以在`127.0.0.1:8042`访问集群中的所有应用程序。注意：和老版本的端口是不一样的。

在`HDFS`上创建一个文件夹,并且赋予权限：

```
# 创建文件夹
hadoop fs -mkdir /user

# 授权
hadoop fs -chmod 777 /user
```

你也可以在这里`http://127.0.0.1:9870/explorer.html`创建。

## (4)HDFS概念

以下节选自某网站：

![](https://hunterhug.github.io/blog/picture/hadoop/1.png)

HDFS遵循主从架构,它具有以下元素：

名称节点 - `Namenode`,一台机器的一个进程。管理文件系统命名空间。规范客户端对文件的访问。它也执行文件系统操作,如重命名,关闭和打开的文件和目录。

数据节点 - `Datanode`,一台机器的一个进程。数据节点上的文件系统执行的读写操作,根据客户的请求。还根据名称节点的指令执行操作,如块的创建,删除和复制。

块,一般用户数据存储在HDFS文件。在一个文件系统中的文件将被划分为一个或多个段和/或存储在个人数据的节点。这些文件段被称为块。换句话说,数据的HDFS可以读取或写入的最小量被称为一个块。缺省的块大小为64MB,但它可以增加按需要在HDFS配置来改变。

HDFS的目标：

1. 故障检测和恢复：由于HDFS包括大量的普通硬件,部件故障频繁。因此HDFS应该具有快速和自动故障检测和恢复机制。
2. 巨大的数据集：HDFS有数百个集群节点来管理其庞大的数据集的应用程序。
3. 数据硬件：请求的任务,当计算发生不久的数据可以高效地完成。涉及巨大的数据集特别是它减少了网络通信量,并增加了吞吐量。

## (5)HDFS使用

使用该命令可以查看命令行操作：

```
hadoop fs -help
```

加载服务器信息后,使用'ls' 可以找出文件列表中的目录,文件状态。下面给出的是ls,可以传递一个目录或文件名作为参数的语法。

    hadoop fs -ls <args>
    hadoop fs -mkdir /user/input 

将本地`/home/file.txt`文件上传：

    hadoop fs -put /home/file.txt /user/input 

以使用ls命令验证文件：

    hadoop fs -ls /user/input 

从HDFS中检索数据：

    hadoop fs -cat /user/input/file.txt 

从HDFS得到文件使用get命令在本地文件系统:

    hadoop fs -get /user/input/file.txt  /home/file-get.txt 

可以使用下面的命令关闭HDFS:

    stop-dfs.sh 

## (6)Hadoop MapReduce

参考：https://www.cnblogs.com/RzCong/p/7362352.html

MapReduce是一种编程模型。Hadoop MapReduce采用Master/slave结构。只要按照其编程规范,只需要编写少量的业务逻辑代码即可实现一个强大的海量数据并发处理程序。核心思想是：`分而治之`。Mapper负责分,把一个复杂的业务,任务分成若干个简单的任务分发到网络上的每个节点并行执行,最后把Map阶段的结果由Reduce进行汇总,输出到HDFS中,大大缩短了数据处理的时间开销。MapReduce就是以这样一种可靠且容错的方式进行大规模集群海量数据进行数据处理,数据挖掘,机器学习等方面的操作。

MapReduce分布式计算框架体系结构:

![](https://hunterhug.github.io/blog/picture/hadoop/2.png)

首先理解几个概念：

1. Master：是整个集群的唯一的全局管理者,`负责作业管理.状态监控和任务调度等`,即MapReduce中的`JobTracker`
2. Slave：`负责任务的执行和任务状态回报`,即MapReduce中的`TaskTracker`
3. Job&Task：在hadoop mapreduce中,一个`Job`它是一个任务,主业务。一个`Job`可以拆分成多个`Task`,`map Task`与`reduce Task`。

 
`JobTracker`是一个后台服务进程,启动之后,会一直监听并接收来自各个TaskTracker发送的心跳信息,包括资源使用情况和任务运行情况等信息 

JobTracker的主要功能：
    
    作业控制：在hadoop中每个应用程序被表示成一个作业,每个作业又被分成多个任务,JobTracker的作业控制模块则负责作业的分解和状态监控。
    最重要的状态监控：主要包括TaskTracker状态监控.作业监控和任务状态监控。主要作用：容错和为任务调度提供决策依据。
    资源管理。

`TaskTracker`是JobTracker和Task之间的桥梁：一方面,从JobTracker接收并执行各种命令：运行任务.杀死任务等；另一方面讲本地节点上各个任务状态通过心跳周期性汇报给JobTracker。TaskTracker与JobTracker和Task之间采用了RPC协议进行通信。功能：

    汇报心跳：Tracker周期性讲所有节点上各种信息通过心跳机制汇报给JobTracker。这些信息包括两部分:
        *机器级别信息：节点健康情况,资源使用情况等。
        *任务级别信息：任务执行进度.任务运行状态等。
    执行命令：JobTracker会给TaskTracker下达各种命令,主要包括：
        启动任务（LaunchTaskAction）.提交任务（CommunitTaskAction）,
        杀死任务（KillJobAction）和重新初始化（TaskTrackerReinitAction）。

 
MapReduce体系结构里有两类节点,第一个是JobTracker,它是一个master管理节点,另一个是TaskTracker。客户端（Client）提交一个任务（Job）,JobTracker把他提交到候选列队里,将Job拆分成map任务（Task）和reduce任务（Task）,把map任务和reduce任务分给TaskTracker执行。在mapreduce编程模型里,Task一般起在和DataNode所在的同一台物理机上。如上图。
 
MapReduce分布式工作流程：

1.分布式的运算程序往往需要分成至少2个阶段：

    MapReduce的第一阶段是Map,运行的实例叫Map Task,第二阶段是Reduce,运行的实例叫Reduce Task。每个Task只需要完成后把文件输出到自己的工作目录即可。

2.第一阶段的Task并发实例各司其职,各自为政,互不相干,完全并行

3.第二阶段的Task并发实例互不相干,但是他们的数据以来于上一阶段的所有Task并发实例的输出

4.MapReduce编程模型,只能包含一个Map阶段和一个Reduce阶段,如果用户的业务逻辑非常复杂,那就只能来多个mapreduce程序,串行运行

MapReduce容错机制：

MapReduce的第一阶段是Map,运行的实例叫Map Task,第二阶段是Reduce,运行的实例叫Reduce Task。第二阶段Reduce要等第一阶段Map上的Map Task完成之后才能开始。如果Map Task运行失败,如何处理？

这时候就要启动mapreduce的容错机制了,它允许整个执行过程中TaskTracker中间出现宕机,发生故障,JVM发生重启等等这些情况,允许它出错。处理的方式：

    1.重复执行
    　　有可能是job本身问题,硬件问题,数据的问题都有可能,默认会重新执行,如果重新执行4次都失败就放弃执行。

    2.推测执行
    　　由于要Map端所有任务执行完才会执行reduce任务,可能存在某个节点完成的特别慢,JobTracker发现它很慢的时候,说明它出现了问题,另外找一台TaskTrack执行同一任务,哪个先完成就取该结果,结束另一个TaskTracker。

以下是一个例子

单词计数（wordcount）主要步骤：

    1.读数据
    2.按行处理
    3.按空格切分行内单词
    4.HashMap（单词,value+1）
    等分给自己的数据片全部读取完之后
    5.将HashMap按照首字母范围分为3个HashMap
    6.将3个hashMap分别传给3个ReduceTask
 
主要流程如下图：

![](https://hunterhug.github.io/blog/picture/hadoop/3.png)

代码实现：

理解了原理,那么就从一个Job开始,从分Map任务和Reduce任务开始。用户编写的程序分为三个部分：Mapper,Reducer,Driver。

Mapper的输入数据和输出数据是KV对的形式（KV的类型可自定义）,Mapper的业务逻辑是写在map（）方法中,map（）方法（maptask进程）对每一个<k,v>调用一次

Reducer的输入数据类型对应Mapper的输出数据类型,也是KV。Reducer的业务逻辑写在reduce（）方法中,Reduce（）方法对每一组相同的<k,v>组调用一次。

用户的Mapper和Reduce都要继承各自的父类。

整个程序需要一个Driver来进行提交,提交的是一个描述了各种必要信息的job对象。　

1.设定Map任务：

WordCountMapper.java

```
package test;
 
 
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;
 
import java.io.IOException;
 
/**
 * Created by Rz_Lee on 2017/8/14.
 * KEYIN:默认情况下是mr框架所读到的一行文本的偏移量,Long
 * 但是在hadoop中有自己的更精简的序列化接口,所以不直接用Long,而用LongWritable
 *
 * VALUE:默认情况下是mr框架所读到的一行文本内容,String,同上用Text
 *
 *KEYOUT:是用户自定义逻辑处理写成之后输出数据中的key,在此是单词,String,同上,用Text
 *VALUEOUT:是用户自定义逻辑处理写成之后输出数据中的value,在此处是单词总次数,Integer,同上,用IntWritale
 *
 */
public class WordCountMapper extends Mapper<LongWritable,Text,Text,IntWritable> {
    /**
     * map阶段的业务逻辑就写在自定义的map()方法中
     * maptask会对每一行输入数据调用一次我们自定义的map()方法
     * @param key
     * @param value
     * @param context 输出内容
     * @throws IOException
     * @throws InterruptedException
     */
    @Override
    protected void map(LongWritable key, Text value, Context context) throws IOException, InterruptedException {
        //将maptask传给我们的文本内容先转换成String
        String line = value.toString();
        //根据空格将一行切分成单词
        String[] words = line.split(" ");
 
        //将单词输出为<单词,1>
        for(String word:words)
        {
            //将单词作为key,将次数1作为value,以便于后续的数据分发,可以根据单词分发经便于相同单词会到相同的reduce task
            context.write(new Text(word),new IntWritable(1));
        }
    }
}
```
 

2.设定Reduce任务：

WordCountReducer.java

```	
package test;
 
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;
 
import java.io.IOException;
 
/**KEYIN,VALUEIN 对应mapper输出的KEYOUT,VALUEOUT类型对应
 *
 * KYEOUT,VALUEOUT 是自定义reduce逻辑处理结果的输出数据类型
 * KYEOUT是单词
 * VALUE是总次数
 * Created by Rz_Lee on 2017/8/14.
 */
public class WordCountReducer extends Reducer<Text,IntWritable,Text,IntWritable>{
    /**
     *
     * @param key 是一组相同单词KV对的key,如<hi,1>,<hi,1>
     * @param values
     * @param context
     * @throws IOException
     * @throws InterruptedException
     */
    @Override
    protected void reduce(Text key, Iterable<IntWritable> values, Context context) throws IOException, InterruptedException {
        int count=0;
        for (IntWritable value:values)
        {
            count+=value.get();
        }
        context.write(key,new IntWritable(count));
    }
}
```
 
3.wordcount程序的操作类,提交运行mr程序的yarn客户端：

WordCountDriver.java

```
package test;
 
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
 
 
/**相当于一个yarn集群的客户端
 * 需要在此封装我们的mr程序相关运行参数,指定jar包
 * 最后提交给yarn
 * Created by Rz_Lee on 2017/8/14.
 */
public class WordCountDriver {
    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf);
        /*conf.set("mapreduce.framework.name","yarn");
        conf.set("yarn.resourcemanager.hostname","srv01");*/
 
        /*job.setJar("/usr/hadoop/wc.jar");*/
        //指定本程序的jar包所在的本地路径
        job.setJarByClass(WordCountDriver.class);
 
 
        //指定本业务job使用的mapper/reducer业务类
        job.setMapperClass(WordCountMapper.class);
        job.setReducerClass(WordCountReducer.class);
 
        //指定mapper输出数据的KV类型
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);
 
        //指定最终输出的数据的KV类型
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);
 
        //指定job的输入原始文件所在目录
        FileInputFormat.setInputPaths(job,new Path(args[1]));
        //指定job的输出结果所在目录
        FileOutputFormat.setOutputPath(job, new Path(args[2]));
 
        //将job中配置的相关参数,以及job所用的java类所在的jar包,提交给yarn去运行
        /*job.submit();*/
        boolean res = job.waitForCompletion(true);
        System.exit(res?0:1);
    }
}
```

4.把wordcount项目导成jar包,上传到HDFS,如何打包：

新建`test`文件夹, 在里面新建上述三个java文件：

```
cd test
javac -d . WordCountMapper.java WordCountReducer.java WordCountDriver.java

mkdir foo
mv ./test foo/

vim MANIFEST.MF
# 添加,最后一行空行
Mainfest-Version: 1.0
Main-Class: test.WordCountDriver

jar cvfm test.jar MANIFEST.MF -C foo/ .
```

创建文件夹：

```
hadoop fs -mkdir /input
hadoop fs -ls /
```

用命令行或者打开`http://127.0.0.1:9870/explorer.html`新建`input`文件夹,丢入几个txt文件。

然后：

```
vim /etc/profile.d/hadoop.sh

export CLASSPATH=.:$HADOOP_HOME/share/hadoop/common/hadoop-common-3.1.1.jar:$HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-client-core-3.1.1.jar:$HADOOP_HOME/share/hadoop/common/lib/commons-cli-1.2.jar:$CLASSPATH


source /etc/profile.d/hadoop.sh
```

终端运行：
    
    yarn jar test.jar test.WordCountDriver /input /output

打开浏览器输入`127.0.0.1:8042`再点击`RM Home`,在网页上可以看见整个Job的运行情况。  

如果发现任务卡住了,原因是内存或硬盘不足了。。。。这该死的穷人都跑不起hadoop了。。。

很重要！ 如果嫌打包麻烦,请直接用`官方包测试`： 

```
hadoop jar /app/hadoop/hadoop-3.1.1/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.1.1.jar wordcount /input /output 
```

运行过程出现`错误: 找不到或无法加载主类 org.apache.hadoop.mapreduce.v2.app.MRAppMaster`

在命令行下输入如下命令,并将返回的地址复制。

```
hadoop classpath
```

编辑`yarn-site.xml`

```
vim /app/hadoop/hadoop-3.1.1/etc/hadoop/yarn-site.xml
```

添加如下内容:

```
    <property>
        <name>yarn.application.classpath</name>
		<value>/app/hadoop/hadoop-3.1.1/etc/hadoop:/app/hadoop/hadoop-3.1.1/share/hadoop/common/lib/*:/app/hadoop/hadoop-3.1.1/share/hadoop/common/*:/app/hadoop/hadoop-3.1.1/share/hadoop/hdfs:/app/hadoop/hadoop-3.1.1/share/hadoop/hdfs/lib/*:/app/hadoop/hadoop-3.1.1/share/hadoop/hdfs/*:/app/hadoop/hadoop-3.1.1/share/hadoop/mapreduce/lib/*:/app/hadoop/hadoop-3.1.1/share/hadoop/mapreduce/*:/app/hadoop/hadoop-3.1.1/share/hadoop/yarn:/app/hadoop/hadoop-3.1.1/share/hadoop/yarn/lib/*:/app/hadoop/hadoop-3.1.1/share/hadoop/yarn/*</value>
    </property>
```

重启：

```
stop-dfs.sh
stop-yarn.sh

start-dfs.sh
start-yarn.sh
```

可以跑了,那么等待结果:

```
hadoop jar /app/hadoop/hadoop-3.1.1/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.1.1.jar wordcount /input /output 

hadoop job -list

2018-12-04 12:21:27,940 INFO mapreduce.Job:  map 0% reduce 0%
2018-12-04 12:21:31,982 INFO mapreduce.Job:  map 100% reduce 0%
2018-12-04 12:21:37,027 INFO mapreduce.Job:  map 100% reduce 100%
2018-12-04 12:21:37,048 INFO mapreduce.Job: Job job_1543897117281_0002 completed successfully

```

去HDFS看看`ouput`文件夹的结果即可。

## (7) 其他工具

Sqoop： 将其他数据源导入HDFS

flume： 海量日志采集.聚合和传输的系统, 可将数据写入文本或者HDFS

HBase： 作为面向列的数据库运行在HDFS之上

Pig/Hive: 查询语言,MapReduce的高级封装

storm: 分布式计算框架,独立于Hadoop

spark：一个针对超大数据集合的低延迟的集群分布式计算系统,Spark兼容Hadoop的APi,能够读写Hadoop的HDFS HBASE顺序文件等。

# 四. Hive实验

## (1)前言

之前,我们已经搭了`Hadoop`了,而且也跑了`MapReduce`。

`Hive`是基于Hadoop的一个数据仓库工具,可以将结构化的数据文件映射为一张数据库表,并提供简单的sql查询功能,可以将sql语句转换为MapReduce任务进行运行。 其优点是学习成本低,可以通过类SQL语句快速实现简单的MapReduce统计,不必开发专门的MapReduce应用,十分适合数据仓库的统计分析。

```
优点：

　　1.可扩展性,横向扩展,Hive 可以自由的扩展集群的规模,一般情况下不需要重启服务 横向扩展：通过分担压力的方式扩展集群的规模 纵向扩展：一台服务器cpu i7-6700k 4核心8线程,8核心16线程,内存64G => 128G

　　2.延展性,Hive 支持自定义函数,用户可以根据自己的需求来实现自己的函数

　　3.良好的容错性,可以保障即使有节点出现问题,SQL 语句仍可完成执行

缺点：

　　1.Hive 不支持记录级别的增删改操作,但是用户可以通过查询生成新表或者将查询结 果导入到文件中（当前选择的 hive-2.3.2 的版本支持记录级别的插入操作）

　　2.Hive 的查询延时很严重,因为 MapReduce Job 的启动过程消耗很长时间,所以不能 用在交互查询系统中。

　　3.Hive 不支持事务（因为不没有增删改,所以主要用来做 OLAP（联机分析处理）,而 不是 OLTP（联机事务处理）,这就是数据处理的两大级别）。
```

## (2)安装Hive

我们的`Hadoop`是3.1.1, 所以安装[Hive3.1.1](http://mirrors.hust.edu.cn/apache/hive/hive-3.1.1/)

```
/app/hadoop
wget http://mirrors.hust.edu.cn/apache/hive/hive-3.1.1/apache-hive-3.1.1-bin.tar.gz
tar xvf apache-hive-3.1.1-bin.tar.gz
```

编辑环境变量:

```
sudo vim /etc/profile.d/hadoop.sh
```

配置:

```
# 这是Java的配置
export JAVA_HOME=/app/hadoop/jdk1.8.0_191
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=.:$JAVA_HOME/bin:$JAVA_HOME/jre/bin:$PATH

# 这是Hadoop的配置
export HADOOP_HOME=/app/hadoop/hadoop-3.1.1
export HADOOP_MAPRED_HOME=$HADOOP_HOME 
export HADOOP_COMMON_HOME=$HADOOP_HOME 
export HADOOP_HDFS_HOME=$HADOOP_HOME 
export YARN_HOME=$HADOOP_HOME 
export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native 
export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin 
export HADOOP_INSTALL=$HADOOP_HOME
export CLASSPATH=.:$HADOOP_HOME/share/hadoop/common/hadoop-common-3.1.1.jar:$HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-client-core-3.1.1.jar:$HADOOP_HOME/share/hadoop/common/lib/commons-cli-1.2.jar:$CLASSPATH

# 这是Hive的配置
export HIVE_HOME=/app/hadoop/apache-hive-3.1.1-bin
export PATH=$PATH:$HIVE_HOME/bin
```

生效环境变量:

```
source /etc/profile.d/hadoop.sh
```

增加`Hive`配置:

```
cd /app/hadoop/apache-hive-3.1.1-bin/conf
cp hive-env.sh.template hive-env.sh
cp hive-default.xml.template hive-site.xml
cp hive-log4j2.properties.template hive-log4j2.properties
```

编辑 `hive-env.sh`:

```
export JAVA_HOME=/app/hadoop/jdk1.8.0_191
export HADOOP_HOME=/app/hadoop/hadoop-3.1.1
export HIVE_HOME=//app/hadoop/apache-hive-3.1.1-bin
export HIVE_CONF_DIR=$HIVE_HOME/conf
export HIVE_AUX_JARS_PATH=$HIVE_HOME/lib/*
```

按照[Docker安装MYSQL](https://github.com/hunterhug/GoSpider-docker.git), 现在:

```
sudo docker exec -it  GoSpider-mysqldb mysql -uroot -p123456789
```

`MYSQL`账户:`root`, 密码:`123456789`, 然后下载`JDBC`驱动到目录下:

```
wget https://dev.mysql.com/get/archives/mysql-connector-java-8.0/mysql-connector-java-8.0.11.zip
unzip mysql-connector-java-8.0.11.zip

cp /app/hadoop/mysql-connector-java-8.0.11/mysql-connector-java-8.0.11.jar /app/hadoop/apache-hive-3.1.1-bin/lib/
```

编辑 `hive-site.xml`, 将里面东西全删掉, 换成:

```
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
<property>
    <name>system:java.io.tmpdir</name>
    <value>/app/hadoop/apache-hive-3.1.1-bin/tmp</value>
</property>
<property>
    <name>system:user.name</name>
    <value>${user.name}</value>
</property>
<property>
    <name>javax.jdo.option.ConnectionUserName</name>
    <value>root</value>
    <description>Username to use against metastore database</description>
</property>
<property>
    <name>javax.jdo.option.ConnectionPassword</name>
    <value>123456789</value>
    <description>password to use against metastore database</description>
</property>
<property>
    <name>javax.jdo.option.ConnectionURL</name>
    <value>jdbc:mysql://192.168.0.21:3306/hive?createDatabaseIfNotExist=true&amp;characterEncoding=UTF-8&amp;useSSL=false</value>
    <description>
        JDBC connect string for a JDBC metastore.
        To use SSL to encrypt/authenticate the connection, provide database-specific SSL flag in the connection URL.
        For example, jdbc:postgresql://myhost/db?ssl=true for postgres database.
    </description>
</property>
<property>
    <name>javax.jdo.option.ConnectionDriverName</name>
    <value>com.mysql.cj.jdbc.Driver</value>
    <description>Driver class name for a JDBC metastore</description>
</property>
<property>
    <name>hive.metastore.schema.verification</name>
    <value>false</value>
    <description>
        Enforce metastore schema version consistency.
        True: Verify that version information stored in is compatible with one from Hive jars.  Also disable automatic
        schema migration attempt. Users are required to manually migrate schema after Hive upgrade which ensures
        proper metastore schema migration. (Default)
        False: Warn if the version information stored in metastore doesn't match with one from in Hive jars.
    </description>
</property>
</configuration>
```

编辑`hive-log4j2.properties`:

```
property.hive.log.dir = ${sys:java.io.tmpdir}/${sys:user.name}
# 更改为
property.hive.log.dir = /app/hadoop/apache-hive-3.1.1-bin/logs
```

启动`Hive`前, 我们先创建`MYSQL`表`Hive`:

```
source /etc/profile.d/hadoop.sh
schematool -dbType mysql -initSchema
```

等待完成后, 我们就可以使用了.

## (3)验证Hive

启动交互:

```
hive

hive> show databases;
OK
default
Time taken: 0.789 seconds, Fetched: 1 row(s)
hive> 
```

建个库`bigdata`试试:

```
show databases;														//查看数据库
create database bigdata;											//新建数据库	
use bigdata;														//使用数据库
```

建立表:

```
create table t1 (id int, name string)  row format delimited fields terminated by '\t';		        //建表
show tables;																	                    //查看数据表
show tables in bigdata;													                            //查看数据库下的表
show create table t1;																		        //查看建表语句


create table stu(
id int,
name string,
gender string,
age int,
master string
)
row format delimited
fields terminated by ','
stored as textfile;
```

这样生成了一个数据仓库在: `hdfs://localhost:9000/user/hive/warehouse/bigdata.db`

我们来表里插些数据, 新建一个`students.txt`:

```
cd /app/hadoop
vim students.txt

95001,李勇,男,20,CS
95002,刘晨,女,19,IS
95003,王敏,女,22,MA
95004,张立,男,19,IS
95005,刘刚,男,18,MA
95006,孙庆,男,23,CS
95007,易思玲,女,19,MA
95008,李娜,女,18,CS
95009,梦圆圆,女,18,MA
95010,孔小涛,男,19,CS
95011,包小柏,男,18,MA
95012,孙花,女,20,CS
95013,冯伟,男,21,CS
95014,王小丽,女,19,CS
95015,王君,男,18,MA
95016,钱国,男,21,MA
95017,王风娟,女,18,IS
95018,王一,女,19,IS
95019,邢小丽,女,19,IS
95020,赵钱,男,21,IS
95021,周二,男,17,MA
95022,郑明,男,20,MA
```

加载数据进`stu`:

```
load data local inpath '/app/hadoop/students.txt' overwrite into table stu;					//加载本地数据到表中
```

导完数据就可以操作表了, 只不过hive会将sql语句翻译成mr程序来执行。

查看数据:

```
select * from stu;
describe stu;
select * from stu where master=CS;
drop table bigdata;												//删除表
```

内部表删除时,会同时删除存储在hdfs上的真实数据和在mysql中的元数据, 比如上述.

外部表删除时,仅删除在mysql中的元数据,并不会删除在hdfs上建立的表（数据仓库）。

建外部表:

```
create external table stu_external(
id int,
name string,
gender string,
age int,
master string
)
row format delimited
fields terminated by ','
stored as textfile
location '/user/hive_external_table';


show create table stu_external;
load data local inpath '/app/hadoop/students.txt' overwrite into table stu_external;					//加载本地数据到表中
# load data inpath '/user/hive_external_table/students.txt' into table stu_external;					//你也可以从hdfs中追加数据到hive表

```

仓库数据将在: `hdfs://user/hive_external_table/students.txt`, 即使`drop table  stu_external;` 数据也还在.

## (4) 高级验证: 分区表

分区表, 有2份表, 分别是1/2班的学生名单:

```
vim /app/hadoop/students1.txt
1.jimmy,20
2,tim,22
3,jerry,19
 
 
vim /app/hadoop/students2.txt
1,tom,23
2,angela,19
3,cat,20
```

创建分区表：

```
create table stu_partition(
id int,
name string,
age int
)
partitioned by(classId int)
row format delimited
fields terminated by ','
stored as textfile;
```

将这2张表的数据分别导入`hive`表中:

```
load data local inpath '/app/hadoop/students1.txt' into table stu_partition partition(classId=1);
load data local inpath '/app/hadoop/students2.txt' into table stu_partition partition(classId=2);
```

hive表中就能将原本的两张表看成一张表来操作,比如: `select * from stu_partition;` 就展示出2张表中的全部数据:

没有分区的表在hdfs上位置就是在以表名为文件夹名的目录下,而分区表在表名目录下还有分区目录,各hive表存在各自的目录下。

用来分区的字段就变成了伪字段,在操作的时候可以拿来当已知字段使用:

```
describe stu_partition;
OK
id                      int                                         
name                    string                                      
age                     int                                         
classid                 int                                         
                 
# Partition Information          
# col_name              data_type               comment             
classid                 int                    
```

## (5) 高级验证:分桶表

分桶表

有数据如下：

```
vim /app/hadoop/tong.txt
1,jimmy
2,henry
3,tom
4,jerry
5,angela
6,lucy
7,lili
8,lilei
9,hanmeimei
10,timmy
11,jenef
12,alice
13,anna
14,donna
15,ella
16,fiona
17,grace
18,hebe
19,jean
20,joy
21,kelly
22,lydia
23,mary
```

建立分桶表


```
# 先开启分桶
set hive.enforce.bucketing = true;

#建表
#先建一个普通表,导入数据
create table stu_list(
id int,
name string
)
row format delimited
fields terminated by ','
stored as textfile;

load data local inpath '/app/hadoop/tong.txt' into table stu_list;
select * from  stu_list;

#再建一个分桶表,将上一个表的查询结果插入到分桶表中。
create table stu_buckets(
id int,
name string
)
clustered by(id) sorted by(id) into 3 buckets
row format delimited
fields terminated by ','
stored as textfile;

# 插入数据
insert overwrite table stu_buckets select * from stu_list;

select * from stu_buckets;
```


可看到查询出的数据按id的hash值模除分桶数然后进到不同的桶。

在hdfs `stu_buckets`表目录下,会出现3个文件：

```
000000_0
000001_0
000002_0
```

上述3个文件就是`桶`。

## (6) 补充

1.Hive的存储结构包括数据库.表.视图.分区和表数据等。数据库,表,分区等等都对应HDFS上的一个目录。表数据对应HDFS对应目录下的文件。

2.Hive中所有的数据都存储在HDFS中,没有专门的数据存储格式,因为Hive是读模式（Schema On Read）,可支持 TextFile,SequenceFile,RCFile或者自定义格式等

3.只需要在创建表的时候告诉Hive数据中的列分隔符和行分隔符,Hive 就可以解析数据

```
　　Hive 的默认列分隔符：控制符 Ctrl + A,\x01 Hive 的
　　Hive 的默认行分隔符：换行符 \n
```

4.Hive 中包含以下数据模型：

```
　　database：         在HDFS中表现为${hive.metastore.warehouse.dir}目录下一个文件夹
　　table：            在HDFS中表现所属 database 目录下一个文件夹
　　external table：   与table 类似,不过其数据存放位置可以指定任意HDFS目录路径
　　partition：        在HDFS中表现为 table 目录下的子目录
　　bucket：           在HDFS中表现为同一个表目录或者分区目录下根据某个字段的值进行 hash 散 列之后的多个文件
　　view：             与传统数据库类似,只读,基于基本表创建
```

5.Hive的元数据存储在RDBMS 中,除元数据外的其它所有数据都基于HDFS存储。默认情况下,Hive 元数据保存在内嵌的 Derby 数据库中,只能允许一个会话连接,只适合简单的 测试。实际生产环境中不适用,为了支持多用户会话,则需要一个独立的元数据库,使用 MySQL 作为元数据库,Hive 内部对 MySQL 提供了很好的支持。

6.Hive中的表分为内部表.外部表.分区表和 Bucket 表.

内部表和外部表的区别：

```
　　删除内部表,删除表元数据和数据
　　删除外部表,删除元数据,不删除数据
```

内部表和外部表的使用选择：

```
　　大多数情况,他们的区别不明显,如果数据的所有处理都在 Hive 中进行,那么倾向于 选择内部表,但是如果 Hive 和其他工具要针对相同的数据集进行处理,外部表更合适。
　　使用外部表访问存储在HDFS上的初始数据,然后通过 Hive 转换数据并存到内部表中
　　使用外部表的场景是针对一个数据集有多个不同的 Schema
　　通过外部表和内部表的区别和使用选择的对比可以看出来,hive 其实仅仅只是对存储在HDFS上的数据提供了一种新的抽象。而不是管理存储在HDFS上的数据。所以不管创建内部 表还是外部表,都可以对 hive 表的数据存储目录中的数据进行增删操作。
```

分区表和分桶表的区别： 

```
　　Hive 数据表可以根据某些字段进行分区操作,细化数据管理,可以让部分查询更快。同时表和分区也可以进一步被划分为Buckets,分桶表的原理和MapReduce 编程中的HashPartitioner的原理类似。
　　分区和分桶都是细化数据管理,但是分区表是手动添加区分,由于Hive是读模式,所以对添加进分区的数据不做模式校验,分桶表中的数据是按照某些分桶字段进行 hash 散列形成的多个文件,所以数据的准确性也高很多
```

# 五. Hbase实验

## (1) 前言

HBASE是一个高可靠性、高性能、面向列、可伸缩的分布式存储系统，利用HBASE技术可在廉价PC Server上搭建起大规模结构化存储集群。

HBASE的目标是存储并处理大型的数据，更具体来说是仅需使用普通的硬件配置，就能够处理由成千上万的行和列所组成的大型数据。

HBASE是Google Bigtable的开源实现，但是也有很多不同之处。比如：Google Bigtable使用GFS作为其文件存储系统，HBASE利用Hadoop HDFS作为其文件存储系统；Google运行MAPREDUCE来处理Bigtable中的海量数据，HBASE同样利用Hadoop MapReduce来处理HBASE中的海量数据；Google Bigtable利用Chubby作为协同服务，HBASE利用Zookeeper作为协同服务.

1、传统数据库遇到的问题：

  1）数据量很大的时候无法存储；
  2）没有很好的备份机制；
  3）数据达到一定数量开始缓慢，很大的话基本无法支撑；

2、HBASE优势：

  1）线性扩展，随着数据量增多可以通过节点扩展进行支撑；
  2）数据存储在hdfs上，备份机制健全；
  3）通过zookeeper协调查找数据，访问速度快。

HBase集群中的角色:

1、一个或者多个主节点，Hmaster；

2、多个从节点，HregionServer；

3、HBase依赖项，zookeeper；

## (2) 安装
下载[Hbase](http://mirror.bit.edu.cn/apache/hbase/2.1.2/hbase-2.1.2-bin.tar.gz), 我们进行伪分布式安装:

```
cd /app/hadoop
wget http://mirror.bit.edu.cn/apache/hbase/2.1.2/hbase-2.1.2-bin.tar.gz
tar xvf hbase-2.1.2-bin.tar.gz
```

编辑配置`hbase-env.sh`:

```
cd /app/hadoop/hbase-2.1.2
vim conf/hbase-env.sh

# 增加
export JAVA_HOME=/app/hadoop/jdk1.8.0_191
```

重点配置:

```
mkdir /app/hadoop/hbase-2.1.2/data
cd /app/hadoop/hbase-2.1.2
vim conf/hbase-site.xml


<configuration>
  <property>
    <name>hbase.rootdir</name>
    <value>hdfs://localhost:9000/hbase</value>
  </property>
  <property>
    <name>hbase.zookeeper.property.dataDir</name>
    <value>/app/hadoop/hbase-2.1.2/data/zookeeper</value>
  </property>
  <property>
    <name>hbase.cluster.distributed</name>
    <value>true</value>
  </property>
<property>
<name>hbase.unsafe.stream.capability.enforce</name>
<value>false</value>
</property>
    <property> 
      <name> 
        hbase.wal.provider 
      </name> 
      <value>filesystem</value> 
  </property> 
    <property> 
      <name> 
        hbase.wal.meta_provider 
      </name> 
      <value>filesystem</value> 
  </property> 
</configuration>
```

请先:

```
cd /app/hadoop/hbase-2.1.2
cp lib/client-facing-thirdparty/htrace-core-3.1.0-incubating.jar lib/
```

启动Hbase:

```
./bin/start-hbase.sh
```

查看:

```
jps

31281 NameNode
79520 HQuorumPeer
31426 DataNode
79830 HRegionServer
31959 ResourceManager
55351 Worker
42616 RunJar
31609 SecondaryNameNode
55129 Master
79672 HMaster
32095 NodeManager
```

`H`开头的就是`HBASE`的进程.

打开`http://localhost:16010`查看`控制台UI`

HBase是一个面向列的数据库，在表中它由行排序。表模式定义只能列族，也就是键值对。一个表有多个列族以及每一个列族可以有任意数量的列。后续列的值连续存储在磁盘上。表中的每个单元格值都具有时间戳。总之，在一个HBase：

```
表是行的集合。
行是列族的集合。
列族是列的集合。
列是键值对的集合。
```

这里的列式存储或者说面向列，其实说的是列族存储，HBase是根据列族来存储数据的。列族下面可以有非常多的列，列族在创建表的时候就必须指定。

使用:

```
./bin/hbase shell

# 查看hbase状态
status

# create '表名','列族名1','列族名2','列族名N'
create 't1','f1';

# 使用list命令查看已创建的表
list "t1"

# 插入数据
put 't1', 'row1', 'f1:a', 'value1'
put 't1', 'row2', 'f1:b', 'value2'
put 't1', 'row3', 'f1:c', 'value3'

# 浏览表中数据
scan 't1'

# 使用get命令获得一行数据。
get 't1', 'row1'
```

可以参考: https://blog.csdn.net/nosqlnotes/article/details/79647096

# 六. Spark实验

## (1) 前言

Spark是基于内存计算的大数据分布式计算框架。Spark基于内存计算，提高了在大数据环境下数据处理的实时性，同时保证了高容错性和高可伸缩性，允许用户将Spark部署在大量廉价硬件之上，形成集群。

1. 提供分布式计算功能，将分布式存储的数据读入，同时将任务分发到各个节点进行计算；
2. 基于内存计算，将磁盘数据读入内存，将计算的中间结果保存在内存，这样可以很好的进行迭代运算；
3. 支持高容错；
4. 提供多计算范式；

Spark与Hadoop关系:

```
Spark是一个计算框架。
Hadoop是包含计算框架MapReducehe分布式文件系统HDFS。
Spark是MapReduce的替代方案，而且兼容HDFS、Hive等分布式存储系统，可融入Hadoop生态。
```

Spark与Scala关系:

```
Spark是用Scala开发的，因为计算数据，Scala它是函数式编程，它实现算法非常简洁优雅。
Scala即有面向对象组织项目工程的能力，又有计算数据的功能。
```

Scala与Java的关系：

```
它们都是基于JVM的，但Scala可以调用Java的任何功能，比如Spark运行在Hadoop上，它可以调用Hadoop上的一切功能。
你可以认为Scala它是一个升级版的Java，因为Scala它本身是一门支持面向对象的语言，在Scala中，一切皆对象，它是一门纯面向对象的语言，同时Scala也是面向对象以及函数式结合的语言。
```

数据的开发语言是Scala，原因如下：

```
大数据的本身是计算数据，而Scala即有面向对象组织项目工程的能力，又有计算数据的功能。
现在大数据事实上的计算标准框架Spark，它是用Scala开发的，因为计算数据，Scala它是函数式编程，它实现算法非常简洁优雅。
例：kafka，它是一个消息中间件，如果外部数据要流进大数据中心，我们一般都要用kafka作适配器，那如果大数据中心的数据流到外部，也是用kafka（如Spark计算的数据要交给HBASE或MySql,期间我们都会用kafka），很多的大数据组件都是用的Scala编写的，SO，如果你想成为一个顶级的大数据开发高手，你一定要掌握Scala。
--------------------- 
作者：sage_wang 
来源：CSDN 
原文：https://blog.csdn.net/sage_wang/article/details/79236051 
版权声明：本文为博主原创文章，转载请附上博文链接！
```

## (2) 安装Spark

下载[spark-2.4.0-bin-hadoop2.7](http://mirrors.hust.edu.cn/apache/spark/spark-2.4.0/spark-2.4.0-bin-hadoop2.7.tgz)

```
cd /app/hadoop
wget http://mirrors.hust.edu.cn/apache/spark/spark-2.4.0/
tar zxvf spark-2.4.0-bin-hadoop2.7.tgz
```

编辑:

```
cd /app/hadoop/spark-2.4.0-bin-hadoop2.7
cp ./conf/spark-env.sh.template ./conf/spark-env.sh

vim ./conf/spark-env.sh
# 末尾添加
export SPARK_DIST_CLASSPATH=$(/app/hadoop/hadoop-3.1.1/bin/hadoop classpath)
```

添加环境变量:

```
sudo vim /etc/profile.d/hadoop.sh 

# Spark 
export SPARK_HOME=/app/hadoop/spark-2.4.0-bin-hadoop2.7
export PATH=$PATH:$SPARK_HOME/bin
```

使生效并启动`spark`:

```
/etc/profile.d/hadoop.sh

/app/hadoop/spark-2.4.0-bin-hadoop2.7
/sbin/start-all.sh 
```

打开`http://127.0.0.1:8080`看看.


试试`/app/hadoop/spark-2.4.0-bin-hadoop2.7/examples/src/main`例子:

```
/app/hadoop/spark-2.4.0-bin-hadoop2.7/bin/run-example  SparkPi 2>&1 | grep "Pi is roughly"

/app/hadoop/spark-2.4.0-bin-hadoop2.7/bin/spark-submit /app/hadoop/spark-2.4.0-bin-hadoop2.7/examples/src/main/python/pi.py | grep "Pi is roughly"
```

Scala 是 Spark 的主要编程语言，如果仅仅是写 Spark 应用，并非一定要用 Scala，用 Java、Python 都是可以的。使用 Scala 的优势是开发效率更高，代码更精简，并且可以通过 Spark Shell 进行交互式实时查询，方便排查问题。

新建两个`py`:

```
# Python program: test.py
vim /app/hadoop/test.py

#!/usr/bin/python

import sys

for line in sys.stdin:
	print "hello " + line


# Python program: test2.py
vim /app/hadoop/test2.py

#!/usr/bin/python

def fun2(str):
	str2 = str + " zaza"
	return str2
```

启动`pyspark`终端:

```
cd /app/hadoop
chmod 777 *.py
pyspark

>>> data = ["john","paul","george","ringo"]
>>> data
['john', 'paul', 'george', 'ringo']
>>> rdd = sc.parallelize(data)
>>> rdd.collect()
['john', 'paul', 'george', 'ringo']
>>> test = "/app/hadoop/test.py"
>>> test2 = "/app/hadoop/test2.py"
>>> import test
>>> import test2


>>> pipeRDD =  rdd.pipe(test)
>>> pipeRDD.collect()
[u'hello john', u'', u'hello paul', u'', u'hello george', u'', u'hello ringo', u'']


>>> rdd.collect()
['john', 'paul', 'george', 'ringo']


>>> rdd2 = rdd.map(lambda x : test2.fun2(x))
>>> rdd2.collect()
['john zaza', 'paul zaza', 'george zaza', 'ringo zaza']
>>>
```

更多参考具体项目。

# 七. 具体项目

上面七七八八搭了一些软件, 我们对它们有一个大体的印象即可.接下来我们来进行一个真实的案例。

待写。