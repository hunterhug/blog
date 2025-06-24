---
layout: post
title: "Java版Kafka使用及配置解释"
date: 2016-09-13
author: 大头
desc: "kafka是吞吐量巨大的一个消息系统，它是用scala写的..."
categories: ["Java"]
tags: ["java"]
permalink: "/language/java-kafka.html"
---


# Java版Kafka使用及配置解释

# 一.Java示例

kafka是吞吐量巨大的一个消息系统，它是用scala写的，和普通的消息的生产消费还有所不同，写了个demo程序供大家参考。kafka的安装请参考官方文档。

## 引入Maven库

首先我们需要新建一个maven项目，然后在pom中引用kafka jar包，引用依赖如下：

```
    <dependency>
        <groupId>org.apache.kafka</groupId>
        <artifactId>kafka_2.10</artifactId>
        <version>0.8.0</version>
    </dependency>
```

## 生产者

我们用的版本是0.8， 下面我们看下生产消息的代码：

```java
    package com.sunteng.clickidc.test;
    import java.util.Properties;
    import com.sun.tools.javah.Util;
    import kafka.javaapi.producer.Producer;
    import kafka.producer.KeyedMessage;
    import kafka.producer.ProducerConfig;
    
    /**
     * Created by 大头 on 16-8-17.
     * Kafka生产者测试
     * http://kafka.apache.org/documentation.html#introduction
     * http://blog.csdn.net/hmsiwtv/article/details/46960053
     */
    public class KafkaProducetest {
    
        private final Producer<String, String> producer;
        public final static String TOPIC = "clicki_info_topic";
    
        private KafkaProducetest() {
            Properties props = new Properties();
            //此处配置的是kafka的端口
            props.put("metadata.broker.list", "192.168.11.73:9092");
    
            //配置value的序列化类
            props.put("serializer.class", "kafka.serializer.StringEncoder");
            //配置key的序列化类
            props.put("key.serializer.class", "kafka.serializer.StringEncoder");
    
            //0表示不确认主服务器是否收到消息,马上返回,低延迟但最弱的持久性,数据可能会丢失
            //1表示确认主服务器收到消息后才返回,持久性稍强,可是如果主服务器死掉,从服务器数据尚未同步,数据可能会丢失
            //-1表示确认所有服务器都收到数据,完美!
            props.put("request.required.acks", "-1");
    
            //异步生产,批量存入缓存后再发到服务器去
            props.put("producer.type", "async");
    
            //填充配置,初始化生产者
            producer = new Producer<String, String>(new ProducerConfig(props));
        }
    
        void produce() {
            int messageNo = 1000;
            final int COUNT = 2000;
    
            while (messageNo < COUNT) {
                String key = String.valueOf(messageNo);
                String data = "hello kafka message " + key;
                String data1="{\"c\":0,\"i\":16114765323924126,\"n\":\"http://www.abbo.cn/clicki.html\",\"s\":0,\"sid\":0,\"t\":\"info_url\",\"tid\":0,\"unix\":0,\"viewId\":0}";
                // 发送消息
    //            producer.send(new KeyedMessage<String, String>(TOPIC,data1));
                // 消息类型key:value
                producer.send(new KeyedMessage<String, String>(TOPIC, key, data));
                System.out.println(data);
                messageNo++;
            }
            producer.close();//必须关闭
        }
    
        public static void main(String[] args) {
            new KafkaProducetest().produce();
    
        }
    }
```

## 消费者

下面是消费端的代码实现：

```java
    package com.sunteng.clickidc.test;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;
    import java.util.Properties;
    import kafka.consumer.ConsumerConfig;
    import kafka.consumer.ConsumerIterator;
    import kafka.consumer.KafkaStream;
    import kafka.javaapi.consumer.ConsumerConnector;
    import kafka.serializer.StringDecoder;
    import kafka.utils.VerifiableProperties;
    
    /**
     * Kafka消费者测试
     * Created by 大头 on 16-8-17.
     */
    public class KafkaConsumertest {
    
        private final ConsumerConnector consumer;
    
        private KafkaConsumertest() {
            Properties props = new Properties();
            //zookeeper 配置
            props.put("zookeeper.connect", "192.168.11.73:2181");
    
            //group 代表一个消费组,加入组里面,消息只能被该组的一个消费者消费
            //如果所有消费者在一个组内,就是传统的队列模式,排队拿消息
            //如果所有的消费者都不在同一个组内,就是发布-订阅模式,消息广播给所有组
            //如果介于两者之间,那么广播的消息在组内也是要排队的
            props.put("group.id", "jd-group");
    
            //zk连接超时
            props.put("zookeeper.session.timeout.ms", "4000");//ZooKeeper的最大超时时间，就是心跳的间隔，若是没有反映，那么认为已经死了，不易过大
            props.put("zookeeper.sync.time.ms", "200");//zk follower落后于zk leader的最长时间
            props.put("auto.commit.interval.ms", "1000");//往zookeeper上写offset的频率
            /*
            * 此配置参数表示当此groupId下的消费者,在ZK中没有offset值时(比如新的groupId,或者是zk数据被清空),consumer应该从哪个offset开始消费.
            * largest表示接受接收最大的offset(即最新消息),smallest表示最小offset,即从topic的开始位置消费所有消息.
            * */
            props.put("auto.offset.reset", "smallest");  //消费最老消息,最新为largest
            //序列化类
            props.put("serializer.class", "kafka.serializer.StringEncoder");
    
            ConsumerConfig config = new ConsumerConfig(props);
    
            consumer = kafka.consumer.Consumer.createJavaConsumerConnector(config);
        }
    
        void consume() {
            // 描述读取哪个topic，需要几个线程读
            Map<String, Integer> topicCountMap = new HashMap<String, Integer>();
            topicCountMap.put(KafkaProducetest.TOPIC, new Integer(1));
    
    
            /* 默认消费时的数据是byte[]形式的,可以传入String编码器*/
            StringDecoder keyDecoder = new StringDecoder(new VerifiableProperties());
            StringDecoder valueDecoder = new StringDecoder(new VerifiableProperties());
    
            Map<String, List<KafkaStream<String, String>>> consumerMap =
                    consumer.createMessageStreams(topicCountMap, keyDecoder, valueDecoder);
    
            //消费数据时每个Topic有多个线程在读,所以取List第一个流
            KafkaStream<String, String> stream = consumerMap.get(KafkaProducetest.TOPIC).get(0);
            ConsumerIterator<String, String> it = stream.iterator();
            while (it.hasNext())
                System.out.println(it.next().topic()+":"+it.next().partition()+":"+it.next().offset()+":"+it.next().key()+":"+it.next().message());
        }
    
        public static void main(String[] args) {
            new KafkaConsumertest().consume();
        }
    }
```

注意消费端需要配置成zk的地址，而生产端配置的是kafka的ip和端口。

Kafka为broker,producer和consumer提供了很多的配置参数。了解并理解这些配置参数对于我们使用kafka是非常重要的。本文列出了一些重要的配置参数。

官方的文档 Configuration 比较老了，程中根据 0.8.2 的代码也做了修正。

# 二.Config配置

下表列出了Boker的重要的配置参数， 更多的配置请参考 `kafka.server.KafkaConfig`

|name|默认值|描述|
|:----|:----|----|
|brokerid|none|每一个boker都有一个唯一的id作为它们的名字。 这就允许boker切换到别的主机/端口上， consumer依然知道|
|enable.zookeeper |true |允许注册到zookeeper|
|log.flush.interval.messages| Long.MaxValue |在数据被写入到硬盘和消费者可用前最大累积的消息的数量|
|log.flush.interval.ms |Long.MaxValue |在数据被写入到硬盘前的最大时间|
|log.flush.scheduler.interval.ms |Long.MaxValue |检查数据是否要写入到硬盘的时间间隔。|
|log.retention.hours |168 |控制一个log保留多长个小时|
|log.retention.bytes |-1 |控制log文件最大尺寸|
|log.cleaner.enable |false |是否log cleaning|
|log.cleanup.policy |delete |delete还是compat. 其它控制参数还包括log.cleaner.threads，log.cleaner.io.max.bytes.per.second，log.cleaner.dedupe.buffer.size，log.cleaner.io.buffer.size，log.cleaner.io.buffer.load.factor，log.cleaner.backoff.ms，log.cleaner.min.cleanable.ratio，log.cleaner.delete.retention.ms|
|log.dir |/tmp/kafka-logs |指定log文件的根目录|
|log.segment.bytes | 1024*1024 |单一的log segment文件大小|
|log.roll.hours |24 * 7 |开始一个新的log文件片段的最大时间|
|message.max.bytes| 1000000 + MessageSet.LogOverhead |一个socket 请求的最大字节数|
|num.network.threads |3 |处理网络请求的线程数|
|num.io.threads |8 |处理IO的线程数|
|background.threads |10 |后台线程序|
|num.partitions |1 |默认分区数|
|socket.send.buffer.bytes |102400 |socket SO_SNDBUFF参数|
|socket.receive.buffer.bytes |102400 |socket SO_RCVBUFF参数|
|zookeeper.connect| localhost:2182/kafka| 指定zookeeper连接字符串， 格式如hostname:port/chroot。chroot是一个namespace|
|zookeeper.connection.timeout.ms| 6000 |指定客户端连接zookeeper的最大超时时间|
|zookeeper.session.timeout.ms |6000 |连接zk的session超时时间|
|zookeeper.sync.time.ms |2000 |zk follower落后于zk leader的最长时间|

# 三.Consumer配置

下表列出了high-level consumer的重要的配置参数。更多的配置请参考 `kafka.consumer.ConsumerConfig`

| name |默认值 |描述|
|:----|:----|----|
| groupid |groupid |一个字符串用来指示一组consumer所在的组|
| socket.timeout.ms |30000 |socket超时时间|
| socket.buffersize |64*1024 |socket receive buffer|
| fetch.size |300 * 1024 |控制在一个请求中获取的消息的字节数。 这个参数在0.8.x中由fetch.message.max.bytes,fetch.min.bytes取代|
| backoff.increment.ms |1000 |这个参数避免在没有新数据的情况下重复频繁的拉数据。 如果拉到空数据，则多推后这个时间|
| queued.max.message.chunks |2 |high level consumer内部缓存拉回来的消息到一个队列中。 这个值控制这个队列的大小|
| autocommit.enable |true |如果true,consumer定期地往zookeeper写入每个分区的offset|
| auto.commit.interval.ms |10000 |往zookeeper上写offset的频率|
| auto.offset.reset |smallnest |如果offset出了返回，则 smallest : 自动设置reset到最小的offset. largest : 自动设置offset到最大的offset. anything else : 否则抛出异常.|
| consumer.timeout.ms |-1 |默认-1,consumer在没有新消息时无限期的block。如果设置一个正值， 一个超时异常会抛出|
| rebalance.retries.max |4 |rebalance时的最大尝试次数|

# 四.Producer配置

下表列出了producer的重要的参数。更多的配置请参考 `kafka.producer.ProducerConfig`

|name |默认值 |描述|
|:----|:----|----|
|serializer.class |kafka.serializer.DefaultEncoder |必须实现kafka.serializer.Encoder 接口，将T类型的对象encode成kafka message|
|key.serializer.class |serializer.class |key对象的serializer类|
|partitioner.class |kafka.producer.DefaultPartitioner |必须实现kafka.producer.Partitioner ，根据Key提供一个分区策略|
|producer.type |sync |指定消息发送是同步还是异步。异步asyc成批发送用kafka.producer.AyncProducer， 同步sync用kafka.producer.SyncProducer|
|metadata.broker.list |boker list |使用这个参数传入boker和分区的静态信息，如host1:port1,host2:port2, 这个可以是全部boker的一部分|
|compression.codec |NoCompressionCodec |消息压缩，默认不压缩|
|compressed.topics |null |在设置了压缩的情况下，可以指定特定的topic压缩，为指定则全部压缩|
|message.send.max.retries |3 |消息发送最大尝试次数|
|retry.backoff.ms |300 |每次尝试增加的额外的间隔时间|
|topic.metadata.refresh.interval.ms |600000 |定期的获取元数据的时间。当分区丢失，leader不可用时producer也会主动获取元数据，如果为0，则每次发送完消息就获取元数据，不推荐。如果为负值，则只有在失败的情况下获取元数据。|
|queue.buffering.max.ms |5000 |在producer queue的缓存的数据最大时间，仅仅for asyc|
|queue.buffering.max.message |10000 |producer 缓存的消息的最大数量，仅仅for asyc|
|queue.enqueue.timeout.ms |-1 |0当queue满时丢掉，负值是queue满时block,正值是queue满时block相应的时间，仅仅for asyc|
|batch.num.messages |200 |一批消息的数量，仅仅for asyc|