---
layout: post
title: "MySQL的各种锁，排他锁，共享锁，意向锁，间隙锁的解释以及动手实践分析"
date: 2021-08-18 
author: 大头 
desc: "当面试官问你什么是间隙锁的时候，你是不是一脸懵逼..."
categories: ["数据库"]
tags: ["database"]
permalink: "/database/mysql-db-lock.html"
top: false
---

此篇文章东拼西凑，参考了很多其他文章。

1. 参考官方说明： [InnoDB Locking](https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html) ，强烈建议阅读。
2. 参考知乎问题：[InnoDB 的意向锁有什么作用？](https://www.zhihu.com/question/51513268)  ，比较通俗。
3. 参考公众号架构师之路： [InnoDB并发如此高，原因竟然在这？](https://mp.weixin.qq.com/s/R3yuitWpHHGWxsUcE0qIRQ)  ，很通俗。

# Innodb引擎

使用锁主要是用来解决数据库事务中数据的隔离和一致性的。

我们这篇文章，用的都是 `MySQL` 的 `Innodb引擎`。区别于不支持事务的 `MyISAM` 引擎，它更优秀。

1. `Innodb引擎` 是一家叫 inno 的公司开发的数据库引擎，MySQL被设计成插件式，它可以更换底部实现，所以有很多引擎可以选择，你可以把它当作发动机。
2. `Innodb引擎` 支持数据库事务，在多个事务并发请求时，底层黑箱子会加各种锁来进行事务并发控制。
3. `Innodb引擎` 支持多版本并发控制（`Multi Version Concurrency Control, MVCC`），可以实现快照读，当然也可以在不用锁的的情况下实现读写并发。

# 为什么需要锁

并发的任务对同一个临界资源进行操作，如果不采取措施，可能导致不一致，故必须进行并发控制（`Concurrency Control`）。

通过并发控制保证数据一致性的常见手段有：

1. 锁（Locking）
2. 数据多版本（Multi Versioning）

提高并发的演进思路，就在如此：

1. 普通锁，本质是串行执行
2. 读写锁，可以实现读读并发
3. 数据多版本，可以实现读写并发

我们先介绍数据多版本，它不需要借助锁就可以实现并发控制，最后再介绍数据库中的锁。

# 数据多版本介绍

数据多版本是一种能够进一步提高并发的方法，它的核心原理是：

1. 写任务发生时，将数据克隆一份，以版本号区分；
2. 写任务操作新克隆的数据，直至提交；
3. 并发读任务可以继续读取旧版本的数据，不至于阻塞；

一句话，新的数据和老的数据放在不同的地方，你改你的，我读我的，我看不到你的修改，大家都在不同的时空。

`Innodb引擎` 实现的多版本并发控制（`Multi Version Concurrency Control, MVCC`）是怎么实现的呢？

我们要开始介绍 `redo` 日志，`undo` 日志，回滚段（`rollback segment`）了。

## redo日志

数据库事务提交后，必须将更新后的数据刷到磁盘上，以保证 `ACID` 特性。磁盘随机写性能较低，如果每次都刷盘，会极大影响数据库的吞吐量。 
优化方式是，将修改行为先写到 `redo` 日志里（此时变成了顺序写），再定期将数据刷到磁盘上，这样能极大提高性能。

假如某一时刻，数据库崩溃，有一些数据还没来得及或正在落盘到磁盘上，这个时候未刷盘数据是有记录在 `redo` 日志上的，
数据库重启后，可以重做 `redo` 日志里的内容，以保证已提交事务对数据产生的影响都刷到磁盘上。这就是重做日志 `redo log` 的由来。

一句话，`redo` 日志用于保障，已提交事务的 `ACID` 特性。

我对上面这句话持保留意见，`redo` 日志是用来提高性能的，它虽然可以保障已提交事务的ACID特征，但这不是它的主要功能，毕竟直接刷磁盘也可以保障已提交事务的 `ACID` 特性。

`redo` 日志也是保存在磁盘上，只不过把事务操作产生的改动数据，先保留在日志中，日志定时把这些数据刷到不同的的磁盘位置。因为刷到磁盘的不同区域，每次写都是随机写，还不如先收集起来，毕竟写到日志是顺序的写。

## undo日志

数据库事务未提交时，会将事务修改数据的镜像（即修改前的旧版本）存放到 `undo` 日志里，当事务回滚时，或者数据库奔溃时，可以利用 `undo` 日志，即旧版本数据，撤销未提交事务对数据库产生的影响。

1. 对于 `insert` 操作，`undo` 日志记录新数据的 `PK(ROW_ID)`，注意只是行主键，回滚时直接删除；
2. 对于 `delete/update `操作，`undo` 日志记录旧数据 `row`，回滚时直接恢复；

补充：事务操作，都会先写 `redo` 日志，是新的数据，再写 `undo` 日志，回滚时反方向，`undo` 日志的旧数据写回 `redo` 日志。

上述的不同操作的 `undo` 日志，每个事务，他们的日志分别存放在不同的 `buffer` 里，也就是每个事务，在内存中都会开辟一个区域，它们是逻辑隔离的，也就是下面说的回滚段。

补充：关于 `undo` 日志磁盘文件（多条 `undo` 日志落到磁盘的地方），`undo` 日志（日志本身），`undo` 日志文件映射的虚拟内存空间（磁盘和内存的映射），他们之间是怎么个交互法，我们在此不解释。

## 回滚段

存储 `undo` 日志的地方，是回滚段。`undo` 日志和回滚段 `rollback segment` 和 `InnoDB` 的 `MVCC` 密切相关，这里举个例子展开说明一下。

栗子：

```
t(id PK, name);
```

数据为：

```
1, shenjian
2, zhangsan
3, lisi
```

![](https://hunterhug.github.io/blog/picture/dblock/1.jpg)

此时没有事务未提交，故回滚段是空的。

接着启动了一个事务：

```
start trx;
delete (1, shenjian);
update set(3, lisi) to (3, xxx);
insert (4, wangwu);
```

并且事务处于未提交的状态。

![](https://hunterhug.github.io/blog/picture/dblock/2.jpg)

可以看到：

1. 被删除前的 `(1, shenjian)` 作为旧版本数据，进入了回滚段；
2. 被修改前的 `(3, lisi)` 作为旧版本数据，进入了回滚段；
3. 被插入的数据，`PK(4)` 进入了回滚段；只有 `PK` 哦，具体的值是没有的。

假设事务提交，回滚段里的 `undo` 日志就可以删除了，事务生命周期结束。

否则如果事务回滚呢？

回滚段的数据会恢复回去：

![](https://hunterhug.github.io/blog/picture/dblock/3.jpg)

可以看到：

1. 被删除的旧数据恢复了； 
2. 被修改的旧数据也恢复了；
3. 被插入的数据，删除了；

回滚后，回滚段就清空了，回到刚开始的状态。

![](https://hunterhug.github.io/blog/picture/dblock/4.jpg)

核心问题：

旧版本数据存储在哪里？

存储旧版本数据，对 `MySQL` 和 `InnoDB` 原有架构是否有巨大冲击？

通过上文 `undo` 日志和回滚段的铺垫，这两个问题就非常好回答了：

1. 旧版本数据存储在回滚段里；
2. 对 `MySQL` 和 `InnoDB` 原有架构体系冲击不大；

`InnoDB` 的内核，会对所有 `row` 数据增加三个内部属性：

1. `DB_TRX_ID`，6字节，记录每一行最近一次修改它的事务ID；
2. `DB_ROLL_PTR`，7字节，记录指向回滚段undo日志的指针；
3. `DB_ROW_ID`，6字节，单调递增的行ID；这个应该是版本号吧，可以继续看其他文章。

`InnoDB` 为何能够做到这么高的并发？

回滚段里的数据，其实是历史数据的快照（`snapshot`），这些数据是不会被修改，`select` 可以肆无忌惮的并发读取他们。

快照读 `（Snapshot Read）`，这种一致性不加锁的读（`Consistent Nonlocking Read`），就是 `InnoDB` 并发如此之高的核心原因之一。

这里的一致性是指，事务读取到的数据，要么是事务开始前就已经存在的数据（当然，是其他已提交事务产生的），要么是事务自身插入或者修改的数据。

什么样的 `select` 是快照读？

除非显示加锁，普通的 `select` 语句都是快照读，例如：

```
select * from t where id>2;
```

这里的显示加锁，非快照读是指：

```
select * from t where id>2 lock in share mode;
select * from t where id>2 for update;
```

# 锁介绍

一般的普通锁：

1. 操作数据前，锁住，实施互斥，不允许其他的并发任务操作；
2. 操作完成后，释放锁，让其他任务执行

简单的锁太过粗暴，任务执行过程本质上是串行的。比如，读不能并行读。

所以引入了写锁-排他锁，和读锁-共享锁。

## 排他锁X，共享锁S，记录锁 Record

`Innodb引擎` 有有以下概念锁：

1. 排他锁(`X Lock`)，获取这把锁需要按顺序来，不允许同时拥有这把锁，拥有这把锁的时候也不允许有共享锁。你可以认为它是一把写锁。这把锁非常排他，所以叫排他锁。
2. 共享锁(`S Lock`)，可以同时存在很多把共享锁，此时不允许有排他锁，也就是说要等排他锁释放你才可以拥有这把锁。你可以认为它是一把读锁。这把锁被其他人共享读，所以叫共享锁。

共享锁与排他锁的玩法是：

1. 共享锁之间不互斥，简记为：读读可以并行
2. 排他锁与任何锁互斥，简记为：写读，写写不可以并行

一句话：`X` 锁完全互斥，拥有这把锁需要其他的 `X` 和 `S` 锁都释放掉。

排他锁和共享锁只是一种概念上的锁，具体来说，`X` 锁和 `S` 锁有两种锁粒度，分别是表锁或者行锁。表锁顾名思义是加在表上的锁，行锁指的是加在索引上的锁，如间隙锁 `gap Lock` 或记录锁 `X Record Locks` （后文慢慢介绍）。

如果操作时 `SQL语句` 和索引字段没有任何关系，可能会直接加 `X` 表锁或者 `S` 表锁，整张表锁住，这时 `X` 锁和 `S` 锁为表锁粒度。

否则，`X` 锁和 `S` 锁，锁的就是索引，特殊说明：行锁锁的是索引，没有索引就没有行锁这种东西，切记。

如果索引不是唯一索引，那么行锁锁住的就可能是一段索引范围，如间隙锁 `gap Lock`，但如果索引是唯一主键(包含主键，其是特殊的唯一索引)，那么锁住的就是只有一行，这种锁住一行的 `X` 锁或者 `S` 锁叫做记录锁 `Record Locks`，简单记为 `X Record Locks`，`S Record Locks`。

基本上，更新，删除操作 `SQL` 都是使用的排他锁(`X Lock`)，数据库引擎自动会帮你加锁，如：

```
# 都使用排他锁
update ... where ...

update table1 set key =1 where id = 1;

delete ... where ...

delete table1 where id = 1;
```

当 `where` 后面有索引字段，那就是加 `X` 行锁，否则是加 `X` 表锁。

而针对 `select SQL`，必须显示指定锁，有以下情况：

```
select ... where ..

# 不加锁，使用的快照读，多版本并发读
select * from table1 where id =1;

# 排他锁(X Lock)
select * from table1 where id =1 for update;

# 共享锁(S Lock)
select * from table1 where id =1 lock in share mode;
```

以上需要手动指定锁，锁的是主键 `id = 1`，主键是特殊的唯一索引，所以此处的 `X` 锁和 `S` 锁都是行锁，锁了一行记录，记录锁 `Record Locks`。补充：在 `Repeatable Read（可重读）` 事务隔离粒度，如果找不到数据的时候会加间隙锁（下文介绍）。

对于 `update、delete，insert` 语句，`InnoDB` 会自动给涉及到的索引加排他锁（`X`），只有查询 `select` 需要我们手动设置排他锁。补充：在 `Repeatable Read（可重读）` 事务隔离粒度，会加间隙锁或插入意向锁（下文介绍）。

一句话，共享锁和排他锁，是一种概念锁，系统在特定的条件下会自动添加共享锁或者排他锁，而且锁是有行和表两种粒度，表锁，锁的是整张表，行锁，锁的是索引。

不特殊说明，下文的术语：行锁，指的都是记录锁 `X Record Lock`。

## 意向锁 IX,IS (表锁）

除了上面的锁，还有意向锁 `IX` 和 `IS`，前一个是排他意向锁，后一个是共享意向锁。

比如为某个索引加 **排他锁(`X`)** 前会加 **排他意向锁(`IX`)**，加 **共享锁(`S`)** 前会加 **共享意向锁(`IS`)**。

意向锁是实现多粒度锁的一种方式。 它是表锁，主要是为了能够更快发现有人在操作表中的数据，与其他表锁互斥，补充：表锁的语法是 `lock tables ...read / write`，可以用 `unlock tables` 主动释放锁。

也就是说 `IX`，`IS` 是表级锁，不会和行级的 `X`，`S` 锁发生冲突，只会和表级的 `X`，`S` 发生冲突。有以下规则：

1. `X` 表锁和 `IX`,`IS` 表锁都冲突。`X` 表锁最拽。
2. `S` 表锁和 `IS` 表锁兼容，但与 `IX` 表锁冲突。

意向锁之间相互兼容，也就是说一个事务加了 `IX`，另外一个事务也可以继续加 `IX`。

例如，事务A给表加了个意向共享锁 `IS`，那么表里就可能存在一个行被加了共享锁 `S`，之所以说可能，因为意向锁是种意图，就是要的意思，可能相应的锁还没加到行里呢，也可能行里的锁没了，外面的意向锁还没去掉。
这时候事务B来了，他看了下表，发现有个意向锁，那他不管啊，你这证还没领呢，我还能挖墙脚。所以实际上不管你加了啥意向锁，读的写的，其他事务都能加任何意向锁。

兼容图如下(下面全是表锁)：

![](https://hunterhug.github.io/blog/picture/dblock/5.jpeg)

列的锁是拥有的锁，行是准备加的锁，如上图，拥有 `X` 表锁时，加 `IX` 就冲突了，不允许加。

以下摘自知乎的一段回答，为什么需要意向锁的解释：

第一，在 `MySQL` 中有表锁，

`LOCK TABLE my_tabl_name READ`;  用读锁锁表，会阻塞其他事务修改表数据。

`LOCK TABLE my_table_name WRITe`; 用写锁锁表，会阻塞其他事务读和写。

第二，`Innodb引擎` 又支持行锁，行锁分为：共享锁，一个事务对一行的共享只读锁。 排它锁，一个事务对一行的排他读写锁。

第三，这两中类型的锁共存的问题

考虑这个例子：

事务A锁住了表中的一行，让这一行只能读，不能写。 之后，事务B申请整个表的写锁。 如果事务B申请成功，那么理论上它就能修改表中的任意一行，这与A持有的行锁是冲突的。

数据库需要避免这种冲突，就是说要让B的申请被阻塞，直到A释放了行锁。

数据库要怎么判断这个冲突呢？

1. 判断表是否已被其他事务用表锁锁表
2. 判断表中的每一行是否已被行锁锁住。

注意2中这样的判断方法效率实在不高，因为需要遍历整个表。于是就有了意向锁。

在意向锁存在的情况下，事务A必须先申请表的意向共享锁，成功后再申请一行的行锁。

在意向锁存在的情况下，上面的判断可以改成：

1. 判断表是否已被其他事务用表锁锁表
2. 发现表上有意向共享锁，说明表中有些行被共享行锁锁住了，因此，事务B申请表的写锁会被阻塞。

注意：申请意向锁的动作是数据库完成的，就是说，事务A申请一行的行锁的时候，数据库会自动先开始申请表的意向锁，不需要我们程序员使用代码来申请。

知乎提问：

> 锁在内存中是单独存储在缓存页中的，并不是存储在数据与索引页中。即使有1亿行数据，只要不是有1亿个行锁，遍历所有锁效率也很高。

回答：

> 速度再怎么快，可以省掉遍历的时间也好呀

继续举例子，比如执行 `A SQL` 语句：

```
select * from user where name = "libis" for update; 
```

其中 `name` 字段不是 `user` 表的索引，这种情况 `InnoDB` 会自动上表锁。

我们开始一个事务1，它去修改 `user` 表的数据，这个时候，我们开个事务2，执行上面的 `A SQL` 语句，会发现事务2卡住了。 为什么呢？

是因为事务1修改数据时肯定会加 `X` 行锁，但在加 `X` 行锁之前会加 `IX` 意向锁，当事务2时，它要加的 `X` 表锁 事务1的 `IX` 意向锁互斥，它申请不到就堵住了。

假设事务2没有被事务1阻塞，事务2先执行了一次 `A SQL` 语句得到了一行记录，此时事务1正好了修改了这条记录，然后提交了，事务B再次执行 `A SQL` 语句就肯定会得到不同的记录，这就违背了事务隔离性的要求。意向锁就是为了解决这样的问题。

##  间隙锁 gap 和临键锁 Next-Key

更复杂的锁出现了。它们只有在 `Repeatable Read（可重读）` 事务隔离粒度下才存在，主要是为了解决幻读的问题。

1. 间隙锁(`gap Lock`)，对索引的间隙（一个范围）进行锁定，其他人不能够在这个间隙里插入和更新数据。
2. 临键锁(`Next-Key Locks`)，简单认为是行锁`Record Lock` + 间隙锁`gap Lock`。

间隙锁锁的是一个索引间隙。

**间隙锁只会与插入意向锁冲突**，和其他锁兼容，冲突情况只有一种，当存在间隙锁时，插入意向锁无法获得。

有以下原则：

1. 如果SQL操作的是确切的索引，并且找得到数据，当索引是唯一的，那么加 `Record Lock`，当索引不是唯一的加 `Next-Key` 锁，找不到数据时一律加 `gap` 锁。
2. 如果SQL操作的是一个范围的索引，找得到数据加 `Next-Key` 锁，找不到数据加 `gap` 锁。

间隙锁很复杂，后文会继续介绍。

## 插入意向锁

还有一种锁，是插入意向锁(`Insert Intention Lock`)。

同样只有在 `Repeatable Read（可重读）` 事务隔离粒度下才存在。

它是为了 `Insert SQL` 而加的一种锁，是一种特殊的间隙锁。我们知道间隙锁锁的是间隙，并发插入的时候可能互斥，要排队，如果用插入意向锁来替代间隙锁，就可以解决这个问题。

在插入记录前，插入操作会先在所插入的索引范围内设置一个插入意向锁。**插入意向锁和插入意向锁之间是兼容的**，只要插入的键值不同，就不会相互阻塞。比如多个事务，拥有相同范围的插入意向锁可以共存，然后可以直接插入不同的值，如果插入相同的值，慢插入的就会卡住。

其目的就是为了使在同一个 `gap` 中不同事务插入不同键值的数据时，不会相互阻塞。但是如果一个区间已经获取了间隙锁或临键锁，会阻塞插入意向锁的获取。也就是 **插入意向锁和间隙锁不兼容**

有一个行锁的兼容图：

![](https://hunterhug.github.io/blog/picture/dblock/6.jpeg)

如上。当存在 `Gap` 锁时，想要插入意向锁会冲突。

## 自增锁

当表里面有一个字段是自增时，插入时会有自增锁产生，这是一个表锁，主要为了保障这个字段的自增属性。

## 死锁日志

如果多个事务互相等待锁，会造成死锁现象，查看最近的死锁日志可以执行：

```
show engine innodb status
```

其中列出一般锁的英文显示：

1. 排他插入意向锁（`X insert intention Lock`）：`lock_mode X insert intention`
2. 排他记录锁+间隙锁（`X Next-key`）： `lock_mode X`
3. 排他间隙锁（`X gap Lock`）： `lock_mode X locks gap before rec`
4. 共享记录锁（`S Lock`）：`S locks rec but not gap`

记住，有 `insert intention` 一定是插入意向锁，有 `not gap` 则是记录锁，否则大部分都有间隙锁。具体问题具体分析。

## 简单分析

如果某一个事务已经获取了某个索引的某个排他行锁(`X Lock`)，另外一个事务就无法获取同样行的 `X` 锁，就会堵住，直到超时，

我们做个例子：

首先，先建我们需要的三张表，一个只有主键的表 `tableprimary`，一个有唯一索引的表 `tableunique`，一个有普通索引的表 `tableindex`：

```
CREATE TABLE `tableprimary` (
  `id` int(12) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;


CREATE TABLE `tableunique` (
  `id` int(12) unsigned NOT NULL AUTO_INCREMENT,
  `key` int(12) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_key` (`key`)
) ENGINE=InnoDB;


CREATE TABLE `tableindex` (
  `id` int(12) unsigned NOT NULL AUTO_INCREMENT,
  `key` int(12) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ui_key` (`key`)
) ENGINE=InnoDB;
```

插入一些数据：

```
INSERT INTO `tableprimary` (`id`) VALUES (1), (2), (3);
INSERT INTO `tableindex` (`id`, `key`) VALUES (1, 10), (2, 20), (3, 30);
INSERT INTO `tableunique` (`id`, `key`) VALUES (1, 10), (2, 20), (3, 30);
```

我们使用 `Repeatable Read（可重读）` 事务隔离粒度来进行实验，这是 `MySQL` 的默认事务隔离级别。

我们来看排他 `X` 锁是怎么排他：

事务1：

```
MariaDB [mysql]> begin;
Query OK, 0 rows affected (0.000 sec)

# 找得到数据
MariaDB [mysql]> select * from tableprimary where id=1 for update;
+----+-----+
| id | key |
+----+-----+
|  1 |  10 |
+----+-----+
1 row in set (0.000 sec)

```

此时事务1开启事务，它对主键 `id=1` 开启了排他行锁 `X`，此时数据是找得到的，加了 `X Record Lock`，且事务未提交，我们就开始了事务2。

事务2：

```
MariaDB [mysql]> begin;
Query OK, 0 rows affected (0.000 sec)

# 堵死，因为事务1开了排他锁
MariaDB [mysql]> select * from tableprimary where id =1 for update;
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
```

查询直接就堵死了，因为事务1拥有了 `id=1` 的排他行锁 `X`，事务2不能进行 `select id =1 for update` 查询操作，因为它也要 `X` 锁。

如果事务1找不到数据呢，然后两个事务一起插入数据，会怎么样的情况发生？

事务1：

```
MariaDB [mysql]> begin;
Query OK, 0 rows affected (0.000 sec)

# 执行顺序号：1，查询不到数据
MariaDB [mysql]> select * from tableprimary where `id`=11 for update;
Empty set (0.000 sec)

# 执行顺序：3，会卡住，直到事务2执行顺序4时，成功
MariaDB [mysql]> insert into tableprimary values(11);
Query OK, 1 row affected (47.095 sec)
```

事务2：

```
MariaDB [mysql]> begin;
Query OK, 0 rows affected (0.000 sec)

# 执行顺序号：2，查询不到数据
MariaDB [mysql]> select * from tableprimary where `id`=11 for update;
Empty set (0.000 sec)

# 执行顺序4，直接死锁
MariaDB [mysql]> insert into tableprimary values(11);
ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction
```

两个事务查询 `id=11 for update` 并不会卡死，但是在某一个事务插入数据的时候卡死，直到另外一个事务插入同样的事务，就会造成死锁。

通过 `show engine innodb status` 可以找到死锁特征：

```
事务1

*** (1) TRANSACTION:
insert into tableprimary values(11)
*** (1) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 95 page no 3 n bits 72 index PRIMARY of table `mysql`.`tableprimary` trx id 17027 lock_mode X insert intention waiting

事务2

*** (2) TRANSACTION:
insert into tableprimary values(11)
*** (2) HOLDS THE LOCK(S):
RECORD LOCKS space id 95 page no 3 n bits 72 index PRIMARY of table `mysql`.`tableprimary` trx id 17028 lock_mode X
Record lock, heap no 1 PHYSICAL RECORD: n_fields 1; compact format; info bits 0
 0: len 8; hex 73757072656d756d; asc supremum;;
 
 *** (2) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 95 page no 3 n bits 72 index PRIMARY of table `mysql`.`tableprimary` trx id 17028 lock_mode X insert intention waiting

*** WE ROLL BACK TRANSACTION (2)
```

如果找得到记录会加 `X Record Lock` 行锁，找不到记录的话会加间隙锁 `X gap`（`lock_mode X locks gap before rec`），但是上面 `HOLDS THE LOCK(S)` 却是 `lock_mode X`，也就是加的 `Next-key` 锁。

其实上面的 `lock_mode X` 应该是 `gap` 锁（因为 `supremum` 的 `heap no = 1`），两个 `select for update` 因为记录都找不到，所以事务1和事务2都加了 `gap` 锁，毕竟 `gap` 锁可以互相兼容，

然后事务1 `insert` 的时候是先要加插入意向锁 `X insert intention`，但这个与事务2的 `gap` 锁冲突，这个时候事务2也 `insert` 的话，数据库底层发现互相等待 `gap` 锁释放，就死锁了，事务2因此终止事务，事务1就执行成功了。

如果这个时候，我们插入 `id=11` 成功后，现在有四条记录了：

```
MariaDB [mysql]> select * from tableprimary;
+----+
| id |
+----+
|  1 |
|  2 |
|  3 |
| 11 |
+----+
```

我们重复这个过程，但这时将 `id=11` 变成 `id=10`，往四条记录中间插入新的记录，会发现有一样的结果，也是死锁。但是死锁日志变了，分析分析：

1. `lock_mode X` 变成了 `lock_mode X locks gap before rec` 。
2. `X insert intention` 变成了 `lock_mode X locks gap before rec insert intention` 。

我们发现一个规律，`id=10` 是多条记录中间的值，`id=11` 是最大的值.。

观察后发现，插入意向锁也和 `gap` 锁有类似的死锁日志规律：

1. `gap` 锁：如果在最大值处插入，日志显示会 `lock_mode X`，如果在中间处插入，显示 `lock_mode X locks gap before rec`。
2. 插入意向锁：如果在最大值处插入，日志显示会 `lock_mode X insert intention`，如果在中间处插入，显示 `lock_mode X locks gap before rec insert intention`。

如果是最小的值呢？其实和中间的值显示的死锁日志一样。学会了吗。

# 进一步分析

那么还有哪些奇特的现象呢？我们来做各种小实验。

## select 精确匹配

如果使用 `select` 语句精确找到了某行，比如通过字段 `key=10` 找到了数据：

```
 select * from tableunique where `key`=10 for update;
+----+-----+
| id | key |
+----+-----+
|  1 |  10 |
+----+-----+

 select * from tableindex where `key`=10 for update;
+----+-----+
| id | key |
+----+-----+
|  1 |  10 |
+----+-----+
```

那么:

1. 唯一索引的表 `tableunique` 会加行锁 `X Record Lock`。
2. 普通索引的表 `tableindex` 会加行锁 `X Record Lock` 和间隙锁 `X Gap Lock`，其实加的就是 `Next-Key Lock`。

### 唯一索引的表加了行锁

唯一索引的表只加了行锁 `X Record Lock`：

事务1：

```
MariaDB [mysql]> begin;
Query OK, 0 rows affected (0.000 sec)

# `key`=10 加了行锁
MariaDB [mysql]> select * from tableunique where `key`=10 for update;
+----+-----+
| id | key |
+----+-----+
|  1 |  10 |
+----+-----+
1 row in set (0.000 sec)
```

事务1对 `key=10` 加排他锁，此时事务未提交，我们开始事务2。

事务2：

```
MariaDB [mysql]> begin;
Query OK, 0 rows affected (0.000 sec)

# `key`=30 加了行锁
MariaDB [mysql]> select * from tableunique where `key`=30 for update;
+----+-----+
| id | key |
+----+-----+
|  3 |  30 |
+----+-----+
1 row in set (0.001 sec)

# 成功插入
MariaDB [mysql]> insert into tableunique values(4,28);
Query OK, 1 row affected (0.000 sec)

# 成功插入
MariaDB [mysql]> insert into tableunique values(5,11),(6,27);
Query OK, 2 rows affected (0.000 sec)
Records: 2  Duplicates: 0  Warnings: 0

# 成功插入
MariaDB [mysql]> insert into tableunique values(7,15);
Query OK, 1 row affected (0.000 sec)

# 成功操作，但因为唯一索引约束，报重复错误
MariaDB [mysql]> insert into tableunique values(8,30);
ERROR 1062 (23000): Duplicate entry '30' for key 'uq_key'

# 插入失败，超时，因为事务1的行锁`key`=10还没释放
MariaDB [mysql]> insert into tableunique values(9,10);
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
```

事务2对 `key=30` 加排他锁，可以发现可以顺利插入 `key=28`，`key=11`，`key=27`，也可以执行 `key=30`，只不过报了重复。

但是 `key=10` 却插入不了，堵住了，因为事务1对 `key=10` 开了行锁。

看起来普普通通是吧。接下来对比下普通索引对表，你就会感到惊奇。

### 普通索引的表加了行锁和间隙锁

我们重复上面的过程。我们会发现，普通索引与唯一索引的区别是，它除了加记录锁 `X Record Lock` 竟然还加了间隙锁 `X gap Lock`。

事务1：

```
MariaDB [mysql]> begin;
Query OK, 0 rows affected (0.001 sec)

# `key`=10 加了行锁
MariaDB [mysql]> select * from tableindex where `key`=10 for update;
+----+-----+
| id | key |
+----+-----+
|  1 |  10 |
+----+-----+
1 row in set (0.001 sec)
```

普普通通。它也没提交，我们就开事务2。

事务2：

```
MariaDB [mysql]> begin;
Query OK, 0 rows affected (0.000 sec)

# `key`=30 加了行锁
MariaDB [mysql]> select * from tableindex where `key`=30 for update;
+----+-----+
| id | key |
+----+-----+
|  3 |  30 |
+----+-----+
1 row in set (0.001 sec)

# 成功插入
MariaDB [mysql]> insert into tableindex values(4,28);
Query OK, 1 row affected (0.001 sec)

# 可以看到有四条记录
MariaDB [mysql]> select * from tableindex;               
+----+-----+
| id | key |
+----+-----+
|  1 |  10 |
|  2 |  20 |
|  4 |  28 |
|  3 |  30 |
+----+-----+
4 rows in set (0.001 sec)

# 插入失败，超时，因为事务1 `key`=10 加了行锁，距离它最近的索引值是20，所以此时还存在间隙锁：(10,20)，不能够插入索引值11-19
MariaDB [mysql]> insert into tableindex values(5,11);
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction

# 插入失败，超时，因为事务1 `key`=10 加了行锁，距离它最近的索引值是20，所以此时还存在间隙锁：(10,20)，不能够插入索引值11-19
MariaDB [mysql]> insert into tableindex values(5,12);
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction

# 插入失败，超时，因为事务1 `key`=10 加了行锁，距离它最近的索引值是20，所以此时还存在间隙锁：(10,20)，不能够插入索引值11-19
MariaDB [mysql]> insert into tableindex values(5,13);
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction

# 插入失败，超时，因为事务1 `key`=10 加了行锁，距离它最近的索引值是20，所以此时还存在间隙锁：(10,20)，不能够插入索引值11-19
MariaDB [mysql]> insert into tableindex values(5,14);
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction

# 插入失败，超时，因为事务1 `key`=10 加了行锁，距离它最近的索引值是20，所以此时还存在间隙锁：(10,20)，不能够插入索引值11-19
MariaDB [mysql]> insert into tableindex values(5,19);
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction

# 插入成功
MariaDB [mysql]> insert into tableindex values(6,27);
Query OK, 1 row affected (0.001 sec)

# 插入成功，因为事务2的行锁 `key`=30 不影响自己
MariaDB [mysql]> insert into tableindex values(8,30);
Query OK, 1 row affected (0.001 sec)

# 插入失败，超时，因为事务1 `key`=10 加了行锁，事务2无法插入
MariaDB [mysql]> insert into tableindex values(9,10);
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction

# 插入成功，间隙锁(10,20)右区间不是闭合的，可以成功。
MariaDB [mysql]> insert into tableindex values(10,20);
Query OK, 1 row affected (0.001 sec)

```

我们发现，普通索引多了间隙锁这种东西。

神奇的是事务1锁住了 `key=10` 导致有了间隙锁，锁的区间是离 `key=10` 最近的索引值，也就是 `key=20`，这个区间是 `(10,20)`，加上行锁 `key=10` 本身，事务2可以操作的范围不能在 `[10,20)` 里面。

换句话说，事务1锁住了这一片范围：`key in [10,20)`。
 
更神奇的是，如果我们在事务1加的行锁是 `key=20`，你觉得会发生什么？公布答案，事务2不能操作的范围变成了 `(10,30)`，因为 `key=20` 最近的索引值是 `10` 和 `30`，锁住的是两个间隙！

## select 精确查询找不到记录，加间隙锁

对于精确查找不到记录，会产生间隙锁 `gap Lock`，无论是唯一索引的表还是普通索引的表。

事务1：

```
MariaDB [mysql]> begin;
Query OK, 0 rows affected (0.000 sec)

# 查找不到数据，但事务1产生了 (20-25) (25-30)的间隙锁
MariaDB [mysql]> select * from tableunique where `key`=25 for update;
Empty set (0.001 sec)

MariaDB [mysql]> select * from tableunique;                          
+----+-----+
| id | key |
+----+-----+
|  1 |  10 |
|  2 |  20 |
|  3 |  30 |
+----+-----+
3 rows in set (0.000 sec)

# 等事务2执行完 select * from tableunique where `key`=19 for update;
# 以下皆会堵住，会失败，因为事务2产生了 (10-19)的间隙锁
insert into tableunique values(4,11);
insert into tableunique values(5,12);
insert into tableunique values(6,18);
insert into tableunique values(7,19);
```

事务1，使用 `key=25` 查找不到数据，但是其最近的索引值是 `20` 和 `30`，所以产生了 `(20-25)` 和 `(25-30)` 的间隙锁，不能在这个间隙里插入新的数据，此时开启事务2。

事务2：

```
MariaDB [mysql]> begin;
Query OK, 0 rows affected (0.000 sec)

# 查找不到数据，但事务2产生了 (10-19)的间隙锁
MariaDB [mysql]> select * from tableunique where `key`=19 for update;
Empty set (0.000 sec)

# 以下皆会堵住，会失败，因为事务1产生了 (20-25) (25-30)的间隙锁
insert into tableunique values(4,24);
insert into tableunique values(5,25);
insert into tableunique values(6,26);
insert into tableunique values(7,29);
insert into tableunique values(8,30);
```

事务2因为事务1的间隙锁堵住了，不能插入这个范围 `(20-25)` 和 `(25-30)` 的数据，当然 `25` 也插不进，因为间隙都被锁了，它怎么插进去！

同理，此时事务2也产生了新的间隙锁 `(10-19)`，其他事务也无法在这个范围进行操作。

然后，我还发现一个特殊的情况：

事务1

```
MariaDB [mysql]> begin;
Query OK, 0 rows affected (0.000 sec)

# 先执行,事务1产生了间隙锁(10,19)
MariaDB [mysql]> select * from tableunique where `key`=19 for update;
Empty set (0.001 sec)

# 等事务2卡住的时候执行，发现死锁了，居然把间隙锁给解除了
MariaDB [mysql]> insert into tableunique values(4,11);
ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction
```

事务2

```
MariaDB [mysql]> begin;
Query OK, 0 rows affected (0.000 sec)

# 因为事务1间隙锁(10,19)而卡住
MariaDB [mysql]> insert into tableunique values(4,11);
# 我们去事务1那里执行同样的操作，当事务1执行了同样的操作时，事务1它自己死锁然后解锁了，然后居然成功了
Query OK, 1 row affected (20.999 sec)
```

如果在事务2堵住的时候，事务1插入同样的数据，那么事务1会因为发现死锁，在发现死锁的那瞬间自己回滚了，这个时候事务2就执行成功了。

通过 `show engine innodb status` 去看了日志，发现这里会出现 `S` 锁:

```
*** (1) TRANSACTION:
TRANSACTION 10611, ACTIVE 21 sec inserting
mysql tables in use 1, locked 1
LOCK WAIT 4 lock struct(s), heap size 1128, 3 row lock(s), undo log entries 1
MySQL thread id 3951, OS thread handle 140333296326400, query id 83737 localhost root Update
insert into tableunique values(4,11)
*** (1) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 90 page no 4 n bits 80 index uq_key of table `mysql`.`tableunique` trx id 10611 lock_mode X locks gap before rec insert intention waiting
Record lock, heap no 3 PHYSICAL RECORD: n_fields 2; compact format; info bits 0
 0: len 4; hex 00000014; asc     ;;
 1: len 4; hex 00000002; asc     ;;

*** (2) TRANSACTION:
TRANSACTION 10609, ACTIVE 46 sec inserting
mysql tables in use 1, locked 1
3 lock struct(s), heap size 1128, 2 row lock(s)
MySQL thread id 3972, OS thread handle 140333295712000, query id 83771 localhost root Update
insert into tableunique values(4,11)
*** (2) HOLDS THE LOCK(S):
RECORD LOCKS space id 90 page no 4 n bits 80 index uq_key of table `mysql`.`tableunique` trx id 10609 lock_mode X locks gap before rec
Record lock, heap no 3 PHYSICAL RECORD: n_fields 2; compact format; info bits 0
 0: len 4; hex 00000014; asc     ;;
 1: len 4; hex 00000002; asc     ;;

*** (2) WAITING FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 90 page no 3 n bits 80 index PRIMARY of table `mysql`.`tableunique` trx id 10609 lock mode S locks rec but not gap waiting
Record lock, heap no 5 PHYSICAL RECORD: n_fields 4; compact format; info bits 0
 0: len 4; hex 00000004; asc     ;;
 1: len 6; hex 000000002973; asc     )s;;
 2: len 7; hex 2d0000017a0988; asc -   z  ;;
 3: len 4; hex 0000000b; asc     ;;

*** WE ROLL BACK TRANSACTION (2)
```

事务2首先因为 `select for update` 获取到了间隙锁 `lock_mode X locks gap before rec`，然后事务1插入时有插入意向锁冲突，所以等待插入意向锁 `lock_mode X locks gap before rec insert intention waiting`，
此时事务2也要插入，它可以获取插入意向锁，然后因为主键有唯一索引，它会转换为共享记录锁 `lock mode S locks rec but not gap`，但要获取该锁，需要等其他的排他 `X` 锁都释放掉，可事务1已经在排队 `X` 锁了，获取锁要先到先得，前面有人排队你就要等，所以死锁。

## select 范围查询

所有和范围查询有关的 `for update`，都会有间隙锁的身影，找得到数据加 `Next-key Lock`，找不到加 `gap Lock` 。

# 死锁

死锁的原因很多，所以要具体案例具体分析。
