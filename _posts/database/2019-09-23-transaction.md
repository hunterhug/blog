---
layout: post
title: "大白话关系型数据库：索引，事务，锁"
date: 2019-09-23
author: 大头
desc: "老夫，很早以前就想写一篇介绍关系型数据库的文章。"
categories: ["数据库"]
tags: ["database","mysql"]
permalink: "/database/rdb.html"
---

感谢阅读。也欢迎大家可以去看《MySQL技术内幕》和橘黄色的《算法》。

# 前言

数据库是软件开发的核心，因为一个软件如果要有状态，也就是它记得你什么时候操作过什么，那么数据要持久化，总要存储在某些地方，这些地方也就是数据库。当然，计算机上面的文件夹，文件，你也可以把它当成数据库，也就是文件数据库，现在很火的`hadoop`大数据系统其实就是一个分布式文件数据库。

在没有计算机的年代，记账相关的财务都是用纸来记录的，叫账本。而现在，我们有了计算机，有了编程语言，有了数据库系统，所以我们可以编程，将数据插入数据库，查找出数据库中的数据。

历史的选择，关系型数据库因为很符合人的直觉，所以使用的范围最广。顾名思义，关系型数据库，就是数据之间是有关系约束。在这篇文章中，`关系型数据库`这个词指的是持久化的数据组织形式的综合体，而`关系型数据库管理系统`指的是操纵这些数据组织形式综合体的软件组合。一个是数据本身，一个是操纵数据软件本身。


# 大白话

关系型数据库，可以包含很多个二维化的数据结构，叫做表，有行列之分，就像棋盘一样。列是字段，比如性别，年龄，姓名，行是一行行记录：


```
表1： 人口登记表

编号 性别 年龄 姓名
1  男  22  大大
2 女  34  次奥
```

非常的直观。

每一行记录可以有个主键，不可重复，比如编号，用以区分这行记录。还可以多个表之间有关系约束，叫做外键：

```
表2： 资产表

编号  资产数额  所属人编号
1   20000   表1的编号1
2   10000 表1的编号2
```

这里的所属人编号关联到了表1，这时发生了关系约束，如果你删除了表1中的编号1，那么表2的编号1就查不到这个人，所以不允许删除。

这种关系约束避免了混乱，把相关的数据以强有力的关系模式进行绑定，防止人为失误导致数据丢失或矛盾。

关系型数据库的产生，非常直观地体现了现实世界的各种业务逻辑。

## SQL

结构化查询语言`SQL`(Structured Query Language)是对数据库进行操作的一种形式化计算机语言，这里的数据库，指的是数据，而不是软件。

`SQL`语句经过数据库管理系统的分词，语义化，可以将数据插入数据库，或者将数据以一定形式查询出来，也可以删除数据。比如：

```
INSERT INTO `user`(`id`,`age`,`sex`,`name`) VALUES (1,22,"男","大大")
```

表示将一条数据插入用户表里面，`id`,`age`,`sex`,`name`是列字段，后面的`1,22,"男","大大"`是这条数据库记录。

上面这种样子，很好，很强大。

比较有名的数据库管理软件就是人人都用的 `MySQL` 数据库，这里的数据库指的是数据库软件，而不是数据。`MySQL`可以将`SQL`进行解析，然后以一定的形式存储起来。

## MySQL/索引和事务

### 索引

数据库存放的是数据，如何查询数据查得快，那么查找算法就派上用场了。索引，也就是类似于我们中文字典目录中的那些拼音字母，通过字母可以迅速定位到词。

主要的查找算法有拉链法，也就是数组链表，这种实现的方式也可叫哈希索引，另外一种是树查找，有`B`树，以及其衍生的`B+`树。

拉链法，数组的链表：

```
0  -> 数据1 -> 数据2
1  -> 数据1 -> 数据2
2  -> 数据1 -> 数据2
3  -> 数据1 -> 数据2
4  -> 数据1 -> 数据2
5  -> 数据1 -> 数据2
```

竖下来的第一列是一个数组，总共有6个数组元素位置，每一个数组元素后面有一条长长的链。

插入数据时，比如数据主键是8（每一行数据库表记录，主键字段就是索引，因为比较重要，所以叫主键，主要的键），那么8除以6余2，那么将这个数据链接在第二个数组元素的链表中。因为做这个计算公式很快，而定位到这个数组位置更快了，直接用数组的内存位置+数组偏移量*指针位数就可以了。所以用空间换了时间。

```
0  -> 数据1 -> 数据2
1  -> 数据1 -> 数据2 -> 主键8所在的数据
2  -> 数据1 -> 数据2
3  -> 数据1 -> 数据2
4  -> 数据1 -> 数据2
5  -> 数据1 -> 数据2
```

这种方式如果数据太多，而数组长度过小，那么数组元素后面的链就越来越长了，那么查找的意义就越来越慢了。

所以有了🌲！！！！！

树，这种数据结构，顾名思义，就是有很多分叉的🌲状结构。

`二叉查找树`：构造一颗树，有个树根，就是最老大的节点，树根下面有两个分叉，每个分叉的下面的结点又有分支，所有的节点，它的左儿子都比它小，右儿子都比它大，所有的树都递归如此，这样查找一个节点的话就可以进行二分查找。

`平衡二叉查找树`：如果一颗二叉查找树太多层了，二分查找也会变慢，因为最坏情况，有多少层就要找多少次，所以要巧妙让二叉查找树的层次变少，就出现了平衡二叉查找树。平衡的意思就是，这颗树最后的节点们，也就是叶子节点，他们的节点层数不能相差太大，大家要平衡，不能有的人高高在上。

`多叉查找树`：一颗二叉树，如果数据多了，那么层级肯定就多了，所以还可以出多个叉的🌲，叫多叉查找树，比如三叉树，四叉树，查找用二分查找就更快了，因为多叉了，相同数量的节点，层数就少了。嗯，这种树其实叫 `B树`（balance tree），下面会讲到。

`红黑树`：经常听说的红黑树，是一种平衡二叉查找树，可以从 `2-3树` 或者 `2-3-4树` 多叉树衍生而来，其实，`2-3树` 和 `2-3-4树` 也是B树的一种，所以一开始红黑树也被人叫对称B树，平衡二叉B树。可以用 `2-3树` 或 `2-3-4` 二叉树的形式来实现红黑树。

`B和B+树`：B树，有N个叉，叫N叉🌲，它所有的节点都携带数据，和二叉查找树的逻辑大同小异。B+树在B树的基础上，将所有数据挪到叶子节点，而其他节点不携带数据，然后将叶子节点这些数据又顺序穿起来形成一条链表，这样二分查找到达叶子节点某个值时，对大于这个值或小于这个值的，都可以顺序遍历最底部的那个链表，范围查找速度极大提升。MySQL使用到了B+树，因为有范围查询。而Mongo这个文档型非关系数据库用了B树。

B+树实现了顺序检索，且多叉，每次数据库管理系统运行时，如`MySQL`，都会马上从磁盘加载数据，转化成一个B+树，加载在内存中，同时加载的数据量，刚好是内存页的大小，然后操作系统虚拟内存LRU算法像往常一样进行页面置换，这样一下子加载，特别快！

`MySQL`数据主键会默认进行索引，以B+树的形式加载，这个时候树的节点值就是主键了，而叶子节点的数据是整行数据库记录。你查找主键4的时候，就会二分查找找到这个叶子节点的数据，然后整行数据返回。

同时，你也可以新建另外的索引，另外的说法叫做`聚簇索引`，和主键类似，会构造另外一颗B+树，但是，不同的是叶子节点的数据不再是整行，而只有主键这个字段的值，这样节省空间，因为不再需要加载整行数据，也没必要！而且通过这些`聚簇索引`查找到记录后，找到了主键，再用主键去查主键那棵树，也是很快的！


### 事务

啥是事务？

`MySQL`大家都听说过有两种引擎：`MyISAM` 和 `InnoDB`。引擎是什么？数据库管理系统是一个软件，它负责将数据以一定的形式组织起来后存放起来，查找时也是以一定的方式查出来，然而怎么查，怎么组织是个问题。所以，`MySQL`这个关系型数据库管理软件设计成多层，下面有一层处理层专门被设计成
可插拔式的引擎层，就像汽车一样，你可以自己换引擎，只要车能跑就行。引擎，也就是实现数据组织形式的处理器。

`ISAM`是`Indexed Sequential Access Method` (有索引的顺序访问方法) 的缩写，不支持事务和外键。也就是B+树这一套，但是他🐎的没有事务的概念，而且没有外键这种约束。

因为`MySQL`一开始也没想那么多，我只要插进去，然后查出来就行，管不了那么多，像这几千年我们的老祖宗一样，账本太多了，复查太麻烦了，坏账太多就不管了，偶尔人工复查一下。

`MyISAM`（我的有顺序的访问方法），听起来就很好。不过随着业务的发展，需要支持外键的约束，不然容易出现数据直接的矛盾，而且关系型数据库本身就是关系的，你这部分特征不实现，你好意思叫关系型数据库，还是最流行的？作为早期的引擎，他的历史使命结束了。。。

`InnoDB`引擎，我实在想不出`Inno`是什么意思。这个引擎支持事务，支持外键、行锁。事务是它的最🐂🍺的地方，没有之一。现在，已经作为`MySQL`的默认引擎，证明它真的实用。


执行以下可以发现存储引擎：

```
mysql> show engines\G;
*************************** 1. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 2. row ***************************
      Engine: MRG_MYISAM
     Support: YES
     Comment: Collection of identical MyISAM tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 3. row ***************************
      Engine: MEMORY
     Support: YES
     Comment: Hash based, stored in memory, useful for temporary tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 4. row ***************************
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 5. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 6. row ***************************
      Engine: CSV
     Support: YES
     Comment: CSV storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 7. row ***************************
      Engine: ARCHIVE
     Support: YES
     Comment: Archive storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 8. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 9. row ***************************
      Engine: FEDERATED
     Support: NO
     Comment: Federated MySQL storage engine
Transactions: NULL
          XA: NULL
  Savepoints: NULL
9 rows in set (0.00 sec
```

除了`InnoDB`有事务，其他都没有。`MEMORY`引擎的索引是哈希索引，而不是B+树。

回到上面的问题，什么是事务？

大家都听说过`ACID`，耳朵都听烂了，每次面试时总会问你什么叫原子性，什么叫事务隔离呀，有多少种事务隔离，怎么实现的事务，什么是行锁啊。

事务：就是一个数据库的连续操作，要么全部完成，要么全部不完成。这种一般大家都认为对的说法，但是，如果按照事务粒度，可能会读到未提交的数据，这种事务想想来，指的是这个操作动作的连贯性，而不是数据变化本身的连贯性。

因为事务分粒度，有不同的事务粒度。什么叫全部完成，全部不完成？指的是这个动作，还是说这个数据更新前后的值，不同事务间数据的交叉值？事实上，如果要保证动作的全部完成和全部不完成，并且事务间的数据更新不互相影响，都需要串行的执行，无法并发。这个取舍就看你对数据变化的容忍度。

先讲事务的`ACID`，再来实现四种事务隔离粒度，然后再来分析`MVCC`和行锁。行锁实际上也是对该行数据的锁定，当这行锁了，更新就是串行的，但读取还可能出现幻影读，因为读的时候，数据可能被修改了。如何确保数据一直全局变化一致，要开启最高粒度的顺序读写！任何情况下，事务们只能排队执行，这样在时间序列下，不会出现各种幻影读。

### ACID

事务的定义和实现一直随着数据管理的发展在演进，当计算机越来越强大，它们就能够被用来管理越来越多数据，最终，多个用户可以在一台计算机上共享数据，这就导致了一个问题，当一个用户修改了数据而另外一个还在使用旧数据进行计算过程中，这里就需要一些机制来保证这种情况不会发生。

`ACID`事务解决了很多问题，但是仍然需要和性能做平衡协调，事务越强，性能可能越低，安全可靠性和高性能是一对矛盾。

一个事务是指对数据库状态进行改变的一系列操作变成一个单个序列逻辑元操作，数据库一般在启动时会提供事务机制，包括事务启动/停止/取消或回滚。

但是上述事务机制并不真的实现“事务”，一个真正事务应该遵循`ACID`属性，`ACID`事务才真正解决事务，包括并发用户访问同一个数据表记录的头疼问题。

ACID的定义：

1. Atomic原子性: 一个事务的所有系列操作步骤被看成是一个动作，所有的步骤要么全部完成要么一个也不会完成，如果事务过程中任何一点失败，将要被改变的数据库记录就不会被真正被改变。
2. Consistent一致性: 数据库的约束 级联和触发机制Trigger都必须满足事务的一致性。也就是说，通过各种途径包括外键约束等任何写入数据库的数据都是有效的，不能发生表与表之间存在外键约束，但是有数据却违背这种约束性。所有改变数据库数据的动作事务必须完成，没有事务会创建一个无效数据状态.
3. Isolated隔离性: 主要用于实现并发控制, 隔离能够确保并发执行的事务能够顺序一个接一个执行，通过隔离，一个未完成事务不会影响另外一个未完成事务。
4. Durable持久性: 一旦一个事务被提交，它应该持久保存，不会因为和其他操作冲突而取消这个事务。很多人认为这意味着事务是持久在磁盘上，但是规范没有特别定义这点。有争议。
 
简而言之，上面说的太复杂。原子性就是数据库一系列执行中不能出现异常，这些动作要一起执行或者一起不执行。一致性就是不能违法外键约束。隔离性就是并发操作时，根据不同的事务粒度，事务间的影响有一定隔离，这个衍生出四种隔离粒度。持久性，就是数据一旦提交成功了，就成功了，成功指的是它被写在磁盘或者写在日志中，任何时候重启数据库系统，它都在，不存在灵异事件。

### 四种事务隔离粒度实验

我们来看最关键的。

#### 四种隔离级别

Read Uncommitted（读取未提交内容）

在该隔离级别，所有事务都可以看到其他未提交事务的执行结果。本隔离级别很少用于实际应用，因为它的性能也不比其他级别好多少。读取未提交的数据，也被称之为脏读（Dirty Read）。

Read Committed（读取提交内容）

这是大多数数据库系统的默认隔离级别（但不是MySQL默认的）。它满足了隔离的简单定义：一个事务只能看见已经提交事务所做的改变。这种隔离级别 也支持所谓的不可重复读（Nonrepeatable Read），因为同一事务的其他实例在该实例处理其间可能会有新的commit，所以同一select可能返回不同结果。

Repeatable Read（可重读）

这是MySQL的默认事务隔离级别，它确保同一事务的多个实例在并发读取数据时，会看到同样的数据行。不过理论上，这会导致另一个棘手的问题：幻读 （Phantom Read）。简单的说，幻读指当用户读取某一范围的数据行时，另一个事务又在该范围内插入了新行，当用户再读取该范围的数据行时，会发现有新的“幻影” 行。InnoDB和Falcon存储引擎通过多版本并发控制（MVCC，Multiversion Concurrency Control）机制解决了该问题。

Serializable（可串行化） 

这是最高的隔离级别，它通过强制事务排序，使之不可能相互冲突，从而解决幻读问题。简言之，它是在每个读的数据行上加上共享锁。在这个级别，可能导致大量的超时现象和锁竞争。

这四种隔离级别采取不同的锁类型来实现，若读取的是同一个数据的话，就容易发生问题。例如：

脏读(Drity Read)：某个事务已更新一份数据，另一个事务在此时读取了同一份数据，由于某些原因，前一个RollBack了操作，则后一个事务所读取的数据就会是不正确的。

不可重复读(Non-repeatable read):在一个事务的两次查询之中数据不一致，这可能是两次查询过程中间插入了一个事务更新的原有的数据。

幻读(Phantom Read):在一个事务的两次查询中数据笔数不一致，例如有一个事务查询了几列(Row)数据，而另一个事务却在此时插入了新的几列数据，先前的事务在接下来的查询中，就会发现有几列数据是它先前所没有的。

在MySQL中，实现了这四种隔离级别，分别有可能产生问题如下所示：

![](https://hunterhug.github.io/blog/picture/public/mysql.jpg)


#### 锁

然后是关于数据库的各种锁：

`MyISAM`引擎每次数据更新时，都会锁住整张表，只有表锁，所以不会出现死锁。`InnoDB`引擎实现了行级锁。而行级锁，锁的是索引。如果查询条件没有索引，那么行锁实际上变成了表锁。如果查询条件中有非主键索引，会先锁非主键索引再说主键索引。

1.共享锁（又称读锁）、排它锁（又称写锁）：

共享锁（S）：所有事务都能读取这行数据，但是修改的时候，这行数据的共享锁必须全部销毁才能修改。

排他锁（X)： 这行数据一次只能有一个事务操作，如果锁已经被其他事务获取了，不能操作。

意向共享锁（IS）：实际是表锁，数据库内部操作。加S锁前需要表锁，因为S锁需要记录。

意向排他锁（IX）：实际是表锁，数据库内部操作。加X锁前需要表锁后，因为X锁需要记录。

默认情况下，`InnoDB` 增删改都会加排他锁（X），但是查找不会加任何锁，所以为了避免幻影读，有两种方式：

```
共享锁（S）：SELECT * FROM table_name WHERE ... LOCK IN SHARE MODE。
排他锁（X)：SELECT * FROM table_name WHERE ... FOR UPDATE。
```

最好使用`Select...For update`排他锁。因为共享锁会死锁，所有事务都在读这行数据，而修改数据需要所有共享锁销毁，这就变成了互相饥饿等待。

 
2.乐观锁、悲观锁：

悲观锁：悲观锁，正如其名，它指的是对数据被外界（包括本系统当前的其他事务，以及来自外部系统的事务处理）修改持保守态度。因此，在整个数据处理过程中，将数据处于锁定状态。

悲观锁的实现，往往依靠数据库提供的锁机制（也只有数据库层提供的锁机制才能真正保证数据访问的排他性，否则，即使在本系统中实现了加锁机制，也无法保证外部系统不会修改数据），就是我们上面的哪些个锁。


乐观锁：

乐观锁（ Optimistic Locking ） 相对悲观锁而言，乐观锁假设认为数据一般情况下不会造成冲突，所以在数据进行提交更新的时候，才会正式对数据的冲突与否进行检测，如果发现冲突了，则让返回用户错误的信息，让用户决定如何去做（一般是回滚事务）。那么我们如何实现乐观锁呢，一般来说有以下2种方式：

1）使用数据版本（Version）记录机制实现，这是乐观锁最常用的一种实现方式。何谓数据版本？即为数据增加一个版本标识，一般是通过为数据库表增加一个数字类型的 “version” 字段来实现。当读取数据时，将version字段的值一同读出，数据每更新一次，对此version值加一。当我们提交更新的时候，判断数据库表对应记录的当前版本信息与第一次取出来的version值进行比对，如果数据库表当前版本号与第一次取出来的version值相等，则予以更新，否则认为是过期数据。

2）乐观锁定的第二种实现方式和第一种差不多，同样是在需要乐观锁控制的table中增加一个字段，名称无所谓，字段类型使用时间戳（timestamp）, 和上面的version类似，也是在更新提交的时候检查当前数据库中数据的时间戳和自己更新前取到的时间戳进行对比，如果一致则OK，否则就是版本冲突。

这种乐观，主要靠业务手段解决。

表级锁：开销小，加锁快;不会出现死锁;锁定粒度大，发生锁冲突的概率最高,并发度最低。

行级锁：开销大，加锁慢;会出现死锁;锁定粒度最小，发生锁冲突的概率最低,并发度也最高。

#### MVCC实现原理

`MVCC`的全称是“多版本并发控制”(Mutil-Version Concurrency Control)。这项技术使得`InnoDB`的事务隔离级别下执行一致性读操作有了保证，换言之，就是为了查询一些正在被另一个事务更新的行，并且可以看到它们被更新之前的值。这是一个可以用来增强并发性的强大的技术，因为这样的一来的话查询就不用等待另一个事务释放锁。

`MySQL`的`InnoDB`采用的是行锁，而且采用了多版本并发控制来提高读操作的性能。

什么是多版本并发控制呢 ？其实就是在每一行记录的后面增加两个隐藏列，记录`创建版本号`和`删除版本号`，

而每一个事务在启动的时候，都有一个唯一的递增的版本号。 

在`InnoDB`中，给每行增加两个隐藏字段来实现`MVCC`，两个列都用来存储事务的版本号，每开启一个新事务，`事务的版本号`就会递增。

于是乎，默认的隔离级别（REPEATABLE READ）下，增删查改变成了这样：

`SELECT`：读取`create version`小于或等于当前`事务版本号`，并且`delete version`为空或大于当前`事务版本号`的记录。这样可以保证在读取之前记录是存在的。

`INSERT`：将当前`事务的版本号`保存至行的`create version`

`UPDATE`：新插入一行，并以当前`事务的版本号`作为新行的`create version`，同时将原记录行的`delete version`设置为`当前事务版本号`

`DELETE`：将当前`事务的版本号`保存至行的`delete version`

在插入操作时：记录的`create version`就是`事务版本号`。 

比如我插入一条记录, 事务`版本号`假设是1 ，那么记录如下：

![](https://hunterhug.github.io/blog/picture/public/mysql2.png)

这时，因为是插入新的，所以`create version`就是1。

在更新操作的时候，采用的是先标记旧的那行记录为已删除，并且`delete version`是`事务版本号`，然后插入一行新的记录的方式。 

比如，针对上面那行记录，事务`版本号`为2，要把`name`字段更新。

![](https://hunterhug.github.io/blog/picture/public/mysql3.png)

所以原先的记录`create version`变为了1，`delete version`变为了目前的`事务版本号`2。而更新后的记录`create version`变为了2。

删除操作的时候，就把`事务版本号`作为`delete version`。比如：

![](https://hunterhug.github.io/blog/picture/public/mysql4.png)


查询操作：从上面的描述可以看到，在查询时要符合以下两个条件的记录才能被事务查询出来： 

1. `delete version` 大于 `当前事务版本号`，就是说删除操作是在当前事务启动之后做的。 
2. `create version` 小于或者等于 `当前事务版本号` ，就是说记录创建是在事务中（等于的情况）或者事务启动之前。

这样就保证了各个事务互不影响。从这里也可以体会到一种提高系统性能的思路，就是：通过版本号来减少锁的争用。另外，只有`read-committed`和`repeatable-read`两种事务隔离级别才能使用`MVCC`。
 
`read-uncommited`由于是读到未提交的，所以不存在版本的问题。而`serializable`串读会对所有读取的行加排他锁，不存在版本的问题。

#### 实践

我们先搭一个`MySQL`数据库，然后练手`SQL`的同时，来体会什么叫做事务。

先安装 `docker`, `docker-compose`
```
git clone https://github.com/hunterhug/GoSpider-docker
cd GoSpider-docker
chomd 777 build.sh
./build
```

分别进入两个终端：

```
docker exec -it  GoSpider-mysqldb mysql -uroot -p123456789
```

终端1。


```
docker exec -it  GoSpider-mysqldb mysql -uroot -p123456789
```

终端2。

在终端1查看没要求有多少个线程连接数据库：

```
mysql> show processlist;
+----+------+-----------+------+---------+------+----------+------------------+
| Id | User | Host      | db   | Command | Time | State    | Info             |
+----+------+-----------+------+---------+------+----------+------------------+
| 72 | root | localhost | NULL | Query   |    0 | starting | show processlist |
| 73 | root | localhost | NULL | Sleep   |    2 |          | NULL             |
+----+------+-----------+------+---------+------+----------+------------------+
2 rows in set (0.00 sec)
```

有两个。

我们来模拟事务操作。先在终端1建一个数据库和表：

```
mysql> create database test;
Query OK, 1 row affected (0.01 sec)

mysql> use test;
Database changed
mysql> CREATE TABLE `xx` ( `id` INT NOT NULL , `name` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
Query OK, 0 rows affected (0.07 sec)
```

1.Read Uncommitted（读取未提交内容）

终端1：

```
mysql> use test;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> set @@session.tx_isolation="READ-UNCOMMITTED";
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> show variables like"tx_isolation";
+---------------+------------------+
| Variable_name | Value            |
+---------------+------------------+
| tx_isolation  | READ-UNCOMMITTED |
+---------------+------------------+
1 row in set (0.01 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)

//  时间点1
mysql> insert into xx value(1,5);
Query OK, 1 row affected (0.00 sec)
```

终端2：

```
mysql> use test;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> set @@session.tx_isolation="READ-UNCOMMITTED";
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> show variables like"tx_isolation";
+---------------+------------------+
| Variable_name | Value            |
+---------------+------------------+
| tx_isolation  | READ-UNCOMMITTED |
+---------------+------------------+
1 row in set (0.00 sec)

mysql> begin;
Query OK, 0 rows affected (0.00 sec)

//  时间点2
mysql> select * from xx;
+----+------+
| id | name |
+----+------+
|  1 |    5 |
+----+------+
1 row in set (0.00 sec)
```

这种叫脏读，几乎不可用。时间点1执行后，终端1事务没提交，终端2在时间点2执行可以查到未提交的数据。多么的可怕，你在下单的时候要先扣库存成功后再扣钱，现在还没扣钱，其他人就发现库存少了。

2.Read Committed（读取提交内容）

终端1：

```
mysql> set @@session.tx_isolation="READ-COMMITTED";
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> show variables like"tx_isolation";
+---------------+----------------+
| Variable_name | Value          |
+---------------+----------------+
| tx_isolation  | READ-COMMITTED |
+---------------+----------------+
1 row in set (0.00 sec)

// 时间点1
mysql> begin;
Query OK, 0 rows affected (0.00 sec)

// 时间点2
mysql> update xx set name=3333 where id=1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from xx;
+----+------+
| id | name |
+----+------+
|  1 | 3333 |
+----+------+
1 row in set (0.00 sec)

// 时间点4
mysql> commit;
Query OK, 0 rows affected (0.00 sec)
```

终端2：

```
mysql> set @@session.tx_isolation="READ-COMMITTED";
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> show variables like"tx_isolation";
+---------------+----------------+
| Variable_name | Value          |
+---------------+----------------+
| tx_isolation  | READ-COMMITTED |
+---------------+----------------+
1 row in set (0.01 sec)

// 时间点1
mysql> begin;
Query OK, 0 rows affected (0.00 sec)

// 时间点3
mysql> select * from xx where id=1;
+----+------+
| id | name |
+----+------+
|  1 |    5 |
+----+------+
1 row in set (0.00 sec)

// 时间点5
mysql> select * from xx where id=1;
+----+------+
| id | name |
+----+------+
|  1 | 3333 |
+----+------+
1 row in set (0.00 sec)
```

不可重复读，同个事务，在不同阶段读到的值是不同的，这很困惑。终端1和2同时进入事务时间点1，然后终端1在时间点2更新了数据，终端2在时间点3查询的数据还是之前的，但是当终端1提交事务后，终端2查到的数据变了。有些人，不想这样。我要从一而终，我一开始读到什么就是什么。

3.Repeatable Read（可重读）默认隔离粒度。

直接退出 `mysql cli`，再进去就是这个粒度。

终端1：

```
mysql> show variables like"tx_isolation";
+---------------+-----------------+
| Variable_name | Value           |
+---------------+-----------------+
| tx_isolation  | REPEATABLE-READ |
+---------------+-----------------+
1 row in set (0.00 sec)

mysql> use test;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed

// 时间点1
mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from xx;
+----+------+
| id | name |
+----+------+
|  1 | 3333 |
+----+------+
1 row in set (0.00 sec)

// 时间点2
mysql> update xx set name=66 where id=1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

// 时间点3
mysql> commit;
Query OK, 0 rows affected (0.00 sec)
```


终端2：

```
mysql> show variables like"tx_isolation";
+---------------+-----------------+
| Variable_name | Value           |
+---------------+-----------------+
| tx_isolation  | REPEATABLE-READ |
+---------------+-----------------+
1 row in set (0.00 sec)

mysql> use test;
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed

// 时间点1
mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from xx;
+----+------+
| id | name |
+----+------+
|  1 | 3333 |
+----+------+
1 row in set (0.00 sec)

// 时间点4
mysql> select * from xx;
+----+------+
| id | name |
+----+------+
|  1 | 3333 |
+----+------+
1 row in set (0.00 sec)
```

这是默认粒度，解决了不可重复度，就是说，一开始`select`到什么值，后面就什么值。虽然终端1已经提交了，终端2读到的值还是之前的。这样容易引起幻读。就是数据明明在事务1被更新了，事务2却没发现更新，还是显示原来的值，因为可重复读嘛。这种情况，可以用排它锁 `for update`来避免，这样同一时间只有一个事务能操作，其他事务会被卡住。


4.Serializable（可串行化） 

这种粒度最细，就是所有

终端1：

```
mysql> set @@session.tx_isolation="SERIALIZABLE";
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> show variables like"tx_isolation";
+---------------+--------------+
| Variable_name | Value        |
+---------------+--------------+
| tx_isolation  | SERIALIZABLE |
+---------------+--------------+
1 row in set (0.00 sec)

// 时间点1
mysql> insert into xx values(2,6);
Query OK, 1 row affected (0.00 sec)

// 时间点3
mysql> commit;
Query OK, 0 rows affected (0.01 sec)
```

终端2：

```
mysql> set @@session.tx_isolation="SERIALIZABLE";
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> show variables like"tx_isolation";
+---------------+--------------+
| Variable_name | Value        |
+---------------+--------------+
| tx_isolation  | SERIALIZABLE |
+---------------+--------------+
1 row in set (0.00 sec)

// 时间点2
mysql> select * from xx;
卡住
卡住
卡住

// 时间点4
+----+------+
| id | name |
+----+------+
|  1 |   66 |
|  2 |    6 |
+----+------+
2 rows in set (13.12 sec)
```

串行化时，当数据在某事务中被修改时，其他事务不能查找，卡住。也就是每次增删查改都是排他锁。如果在默认粒度`Repeatable Read（可重读）`下，查找时需要避免幻读，那么后面加上`for update`，会变得和串行的一样。


四种隔离粒度完毕。

### 关于外键

外键在某些情况必须用，否则你必须防止幻读，需要使用最强事务隔离，序列化隔离来做级联。

比如有两张表：`爸爸`表和`儿子`表，儿子的表带上了爸爸的ID，是外键，但是你没建这个外键。事实上，很多公司开发中，都主动省去这个外键，不用外键这个特征，都是手工来做外键关联，原因是建了外键，删除的时候会出现各种问题，也就是懒嘛，但是这种行为我觉得不是特别好。

大家来看。

你开启了事务1：

```
删除老爸
删除儿子们
```

提交事务1

你在另外一个窗口开启了事务2：

```
查询老爸（因为事务 2 是事务 1 提交前进入的，就算事务 1 在之后 commit 了，但老爸在 MVCC 模式下可重复读）
插入儿子
```

提交事务 2

你会发现，老爸不见了，但是莫名其妙多了一个儿子出来。

为什么呢？

你事务1删除了老爸了，但是还没提交，这时事务2查询老爸查询到了，因为可重复读，这时事务1删除儿子并且提交事务，然后事务2发现有爸爸，然后把儿子插进去了。因为没有开启外键，所以儿子插入成功。如果有外键了，儿子一定插不进去，因为老爸都没了。

这种行为叫做幻影的灵异事件，经常发生的事情。

所以有可能的话，老老实实用外键特征，可是我也不想用耶，真香。

谢谢阅读🏃。
