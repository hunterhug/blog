---
layout: post
title: "C/C++ cmake example"
date: 2019-02-03
author: 大头
desc: "编译程序需要使用各种参数，所以很麻烦，出现了不同的make构建工具..."
categories: ["Golang"]
tags: ["c++"]
permalink: "/language/cmake.html"
--- 

学习 Golang，有时需要 Cgo，所以需要学习 C、C++。

语言入门：

https://item.jd.com/12580612.html

https://item.jd.com/28326539330.html


参见：  https://github.com/hunterhug/cmake_example

# 历史

稍微很长的历史，来源网络，可以先跳过。

## C语言的发展阶段

C 语言之所以命名为 C，是因为 C 语言源自 Ken Thompson 发明的 B 语言，而 B 语言则源自 BCPL 语言。

- 1967年，剑桥大学的Martin Richards对CPL语言进行了简化，于是产生了BCPL（Basic Combined Programming Language）语言。
- 20世纪60年代，美国AT&T公司贝尔实验室（AT&T Bell Laboratory）的研究员Ken Thompson闲来无事，手痒难耐，想玩一个他自己编的，模拟在太阳系航行的电子游戏——Space Travel。他背着老板，找到了台空闲的机器——PDP-7。但这台机器没有操作系统，而游戏必须使用操作系统的一些功能，于是他着手为PDP-7开发操作系统。后来，这个操作系统被命名为——UNIX。
- 1970年，美国贝尔实验室的 Ken Thompson，以BCPL语言为基础，设计出很简单且很接近硬件的B语言（取BCPL的首字母）。并且他用B语言写了第一个UNIX操作系统。
- 1971年，同样酷爱Space Travel的Dennis M.Ritchie为了能早点儿玩上游戏，加入了Thompson的开发项目，合作开发UNIX。他的主要工作是改造B语言，使其更成熟。
- 1972年，美国贝尔实验室的 D.M.Ritchie 在B语言的基础上最终设计出了一种新的语言，他取了BCPL的第二个字母作为这种语言的名字，这就是C语言。
- 1973年初，C语言的主体完成。Thompson和Ritchie迫不及待地开始用它完全重写了UNIX。此时，编程的乐趣使他们已经完全忘记了那个"Space Travel"，一门心思地投入到了UNIX和C语言的开发中。随着UNIX的发展，C语言自身也在不断地完善。直到今天，各种版本的UNIX内核和周边工具仍然使用C语言作为最主要的开发语言，其中还有不少继承Thompson和Ritchie之手的代码。在开发中，他们还考虑把UNIX移植到其他类型的计算机上使用。C语言强大的移植性（Portability）在此显现。机器语言和汇编语言都不具有移植性，为x86开发的程序，不可能在Alpha,SPARC和ARM等机器上运行。而C语言程序则可以使用在任意架构的处理器上，只要那种架构的处理器具有对应的C语言编译器和库，然后将C源代码编译、连接成目标二进制文件之后即可运行。
- 1977年，Dennis M.Ritchie发表了不依赖于具体机器系统的C语言编译文本《可移植的C语言编译程序》。
- 1978年由美国电话电报公司(AT&T）贝尔实验室正式发表了C语言。布莱恩·柯林汉（Brian Kernighan） 和 丹尼斯·里奇（Dennis Ritchie） 出版了一本书，名叫《The C Programming Language》。这本书被 C语言开发者们称为K&R，很多年来被当作 C语言的非正式的标准说明。人们称这个版本的 C语言为K&R C。
- 1982年，很多有识之士和美国国家标准协会为了使这个语言健康地发展下去，决定成立C标准委员会，建立C语言的标准。委员会由硬件厂商，编译器及其他软件工具生产商，软件设计师，顾问，学术界人士，C语言作者和应用程序员组成。
- 1989年，ANSI发布了第一个完整的C语言标准——ANSI X3.159—1989，简称“C89”，不过人们也习惯称其为“ANSI C”。
- 1990年，国际标准化组织（ISO）和国际电工委员会（IEC）把C89标准定为C语言的国际标准，命名为`ISO/IEC 9899:1990 - Programming languages -- C`。因为此标准是在1990年发布的，所以有些人把简称作C90标准。不过大多数人依然称之为C89标准，因为此标准与ANSI C89标准完全等同。
- 1994年，国际标准化组织（ISO）和国际电工委员会（IEC）发布了C89标准修订版，名叫`ISO/IEC 9899:1990/Cor 1:1994` ，有些人简称为C94标准。
- 1995年，国际标准化组织（ISO）和国际电工委员会（IEC）再次发布了C89标准修订版，名叫`ISO/IEC 9899:1990/Amd 1:1995 - C Integrity `，有些人简称为C95标准。
- 1999年，国际标准化组织（ISO）和国际电工委员会（IEC）发布了C语言的新标准，名叫`ISO/IEC 9899:1999 - Programming languages -- C`，简称C99标准。这是C语言的第二个官方标准。
- 2011年，国际标准化组织（ISO）和国际电工委员会（IEC）再次发布了C语言的新标准，名叫`ISO/IEC 9899:2011 - Information technology -- Programming languages -- C` ，简称C11标准，原名C1X。这是C语言的第三个官方标准，也是C语言的最新标准。
- 2018年6月，C18标准，C语言编程的现行标准。它没有引入新的语言特性，只是对C11中的缺陷进行了技术修正和澄清。

标准： **C89**/ANSIC/C90 -- C94 -- C95 -- **C99** -- **C11** -C18

## C++语言的发展阶段

最初导致C++诞生的原因是在Bjarne博士等人试图去分析UNIX的内核的时候，这项工作开始于1979年4月，当时由于没有合适的工具能够有效的分析由于内核分布而造成的网络流量，以及怎样将内核模块化。
同年10月，Bjarne博士完成了一个可以运行的预处理程序，称之为Cpre，它为C加上了类似Simula的类机制。在这个过程中，Bjarne博士开始思考是不是要开发一种新的语言，当时贝尔实验室对这个想法很感兴趣，就让Bjarne博士等人组成一个开发小组，专门进行研究。

当时不是叫做C++，而是C with class，这是把它当作一种C语言的有效扩充。由于当时C语言在编程界居于老大的地位，要想发展一种新的语言，最强大的竞争对手就是C语言，所以当时有两个问题最受关注：C++要在运行时间、代码紧凑性和
数据紧凑性方面能够与C语言相媲美，但是还要尽量避免在语言应用领域的限制。在这种情况下，一个很自然的想法就是让C++从C语言继承过来，但是我们的Bjarne博士更具有先见之明，他为了避免受到C语言的局限性，参考了很多的语言，例如：从Simula继承了类的概念，从Algol68继承了运算符重载、引用以及在任何地方声明变量的能力

第一个带有类编译器的C被称为Cfront，它来自于名为CPre的C编译器。它是一个用类代码将C语言翻译成普通C语言的程序。值得注意的一点是Cfront大部分是用C语言编写的，这使得它成为了一个自托管编译器(一个可以自己编译的编译器)。Cfront后来在1993年被抛弃，因为很难将新的特性集成到其中，即c++异常。尽管如此，Cfront对未来编译器的实现和Unix操作系统产生了巨大的影响。

下面让我们来一起看一下C++历史上的主要事件：

- 1983年， Rick Mascitti建议C with class命名为CPlusPlus，即C++，第一个C++实现投入使用。大约在这个时候添加了许多新特性，其中最引人注目的是虚拟函数、函数重载、带&符号的引用、const关键字和使用两个前斜杠的单行注释(这是从BCPL语言中提取的特性)。
- 1985年2月， 第一个C++ Release E发布。10月，CFront的第一个商业发布：CFront Release 1.0。Bjarne博士完成了经典巨著The C++ Programming Language第一版。同年，c++作为商业产品实现，语言还没有正式标准化，这使得这本书成为一个非常重要的参考
- 1986年11月，C++第一个商业移植CFront 1.1,Glockenspiel。
- 1987年2月， CFront Release 1.2发布。11月，第一个USENIX C++会议在新墨西哥州举行。
- 1988年10月，第一次USENIX C++实现者工作会议在科罗拉多州举行。
- 1989年12月，ANSI X3J16在华盛顿组织会议。语言再次更新，包括受保护成员和静态成员，以及来自几个类的继承。
- 1990年3月， 第一次ANSI X3J16技术会议在新泽西州召开。5月， C++的又一个传世经典ARM诞生。7月， 模板被加入。11月，异常被加入。同年，Borland的Turbo c++编译器将作为商业产品发布。Turbo c++增加了大量的额外库，这将对c++的开发产生相当大的影响。虽然Turbo c++的最后一个稳定版本是在2006年，但是编译器仍然被广泛使用。
- 1991年6月， The C++ Programming Language第二版完成。第一次ISO WG21会议在瑞典召开。10月，CFront Release 3.0发布。
- 1993年3月， 运行时类型识别在俄勒冈州被加入。7月， 名字空间在德国慕尼黑被加入。
- 1994年8月， ANSI/ISO委员会草案登记。
- 1997年7月， The C++ Programming Language第三版完成。10月，ISO标准通过表决被接受
- 1998年，c++标准委员会发布了`c++ ISO/IEC 14882:1998`的第一个国际标准，也就是所谓的c++ 98。注释的c++参考手册据说对标准的开发有很大的影响。标准模板库从1979年开始概念开发，也包括在内。
- 2003年，委员会对1998年标准报告的多个问题作出了回应，并对其进行了相应的修订。更改后的语言被称为c++ 03。
- 2005年，c++标准委员会发布了一份技术报告(TR1)，详细描述了他们计划添加到最新的c++标准中的各种特性。新标准被非正式地称为c++ 0x，因为它预计将在第一个十年结束前的某个时候发布。然而，具有讽刺意味的是，新标准要到2011年年中才会发布。在此之前发布了一些技术报告，一些编译器开始为新特性添加实验支持。
- 2011年年中，新的c++标准(被称为c++ 11)完成。Boost库项目对新标准产生了相当大的影响，一些新模块直接来自相应的Boost库。一些新特性包括正则表达式支持(正则表达式的细节可以在这里找到),一个全面的随机化图书馆,一个新的c++库,原子的支持,一个标准的线程库(直到2011 C和c++都缺乏),一个新的循环语法提供功能类似于某些其他语言foreach循环,auto关键字,新的容器类,更好地支持union联合体和数组初始化列表,和可变模板。
- 2014年12月，C++ ISO/IEC标准的最新版本C++14。C++14是对C++11的小范围的扩展，主要内容是修复bug和略微提高性能。
- 2017年12月，ISO C++ 委员会正式发布了 C++ 17 标准，官方名称为 ISO/IEC 14882:2017。基于 C++ 14，C++ 17 旨在使 C++ 成为一个不那么臃肿复杂的编程语言，以简化该语言的日常使用，使开发者可以更简单地编写和维护代码。C++ 17 是对 C++ 语言的重大更新，引入了许多新的语言特性。
- 2019春季会议在夏威夷科纳举办，委员会在这次会议中确定了下一个国际标准 C++20 的全部特性，这标志着 C++20 的特性设计工作已完成。

标准： **C++98** -- C++03 -- **C++11** -- **C++14** -- **C++17** -- C++20

STL（Standard Template Library，标准模板库)是惠普实验室开发的一系列软件的统称。它是由Alexander Stepanov、Meng Lee和David R Musser在惠普实验室工作时所开发出来的。STL的代码从广义上讲分为三类：algorithm（算法）、container（容器）和iterator（迭代器），几乎所有的代码都采用了模板类和模版函数的方式，这相比于传统的由函数和类组成的库来说提供了更好的代码重用机会。

在C++标准中，STL被组织为下面的13个头文件：`<algorithm>、<deque>、<functional>、<iterator>、<vector>、<list>、<map>、<memory>、<numeric>、<queue>、<set>、<stack>和<utility>`。

[Boost](https://www.boost.org) 库通过加入一些在实践中非常有用的函数对 C++ 标准进行了补充。 由于 Boost C++ 库是基于 C++ 标准的，所以它们是使用最先进的 C++ 来实现的。 它们是平台独立的，并由于有一个大型的开发人员社区，它可以被包括 Windows 和 Linux 在内的许多操作系统所支持。 Boost库由C++标准委员会库工作组成员发起，其中有些内容有望成为下一代C++标准库内容。在C++社区中影响甚大，是不折不扣的“准”标准库。Boost由于其对跨平台的强调，对标准C++的强调，与编写平台无关。大部分boost库功能的使用只需包括相应头文件即可，少数（如正则表达式库，文件系统库等）需要链接库。可以说，Boost库是为C++语言标准库提供扩展的一些C++程序库的总称。C++11, C++14很多特性都是从boost库来的，如果所在的公司使用的编译器可以支持C++11或以上那么可以先用标准的来就行，不够再去翻翻boost。


# 正文

编译程序需要使用各种参数，所以很麻烦，出现了不同的make构建工具，这些工具遵循不同的规范和标准，所执行的Makefile格式也不同，但如果想让软件跨平台，必须要保证能够在不同平台编译，但使用这些make工具就得为每一种标准写一次Makefile，因此CMake应运而生。CMake首先允许开发者编写一种与平台无关的CMakeList.txt来定制整个编译流程，然后再根据目标用户的平台进一步生成所需的本地化Makefile和工程文件，如Unix的Makefile或Windows的Visual Studio。

## 温习基本知识

一般程序写完后需要编译成二进制机器码，然后再调用执行。

下面是一个本人工作中遇到的经典编译：

```sh
gcc read.c -o read.exe -g -Wall "common/common.c" "common/ss_help.c" "lib/base64/base64.c" "lib/cJSON/cJSON.c" \
-I"../include" -I"./common" -I"./lib" -I"./lib/base64" -I"./lib/cJSON"  \
-lslm_runtime -lslm_control -lss_user_login  -lm -ldl -lpthread \
-L"./" -L"./../lib64" \
-Wl,-rpath="./" -Wl,-rpath="./../lib64"
```

具体参数解释如下：

```
gcc     编译工具
read.c  主函数文件
-o read.exe     编译成read.exe二进制
-g              可以使用gdb调试
-Wall           生成所有警告信息
"common/common.c" "common/ss_help.c" "lib/base64/base64.c" "lib/cJSON/cJSON.c"  一起编译的其他C源文件
-I"../include" -I"./common" -I"./lib" -I"./lib/base64" -I"./lib/cJSON"          依赖的头文件所在目录
-lslm_runtime -lslm_control -lss_user_login  -lm -ldl -lpthread                 链接的动态库 libslm_runtime等，可用ldd read.exe查看
-L"./" -L"./../lib64"   放在/lib和/usr/lib和/usr/local/lib里的库直接用-l参数就能链接，否则要加上库文件所在的目录名
-Wl,-rpath=./           编译时指定的 -L  的目录，只是在程序链接成可执行文件时使用的。程序执行时动态链接库加载不到动态链接库，所以要加上。或者加上环境变量也可以：export LD_LIBRARY_PATH
```

是有点麻烦，因此使用构建工具很有必要。我们先重温一下编译过程，再学习构建工具。

### C语言编译过程

*.c文件 -- 预处理 -- 编译 -- 汇编 -- 链接 -- 可执行函数

预处理器->编译器->汇编器->链接器

1. 由.c文件到.i文件，这个过程叫预处理
2. 由.i文件到.s文件，这个过程叫编译
3. 由.s文件到.o文件，这个过程叫汇编
4. .o文件到可执行文件，这个过程叫链接

查看：

```
cd Demo0
```

1.编辑 hello.c:

```cgo
#include <stdio.h>
#include <stdlib.h>
int main()
{
        printf("hello world!\n");
        return 0;
}
```

2.预处理过程实质上是处理“#”，将#include包含的头文件直接拷贝到hell.c当中；将#define定义的宏进行替换，同时将代码中没用的注释部分删除等。

具体做的事儿如下：

（1）将所有的#define删除，并且展开所有的宏定义。说白了就是字符替换

（2）处理所有的条件编译指令，#ifdef #ifndef #endif等，就是带#的那些

（3）处理#include，将#include指向的文件插入到该行处

（4）删除所有注释

（5）添加行号和文件标示，这样的在调试和编译出错的时候才知道是是哪个文件的哪一行

（6）保留#pragma编译器指令，因为编译器需要使用它们。

预编译：

```
gcc -E hello.c -o a.i

cat a.i
```

3.编译的过程实质上是把高级语言翻译成机器语言的过程，即对a.c做：
  
（1）词法分析，
  
（2）语法分析
  
（3）语义分析
  
（4）优化后生成相应的汇编代码
  
从 高级语言->汇编语言->机器语言（二进制）

编译器生成汇编代码:

```
gcc -S a.i -o a.s

cat a.s
```

汇编器生成机器代码：

```
gcc -c hello.c -o a.o
```

4.链接器将翻译成的二进制与需要用到库绑定在一块。它将所有二进制形式的目标文件和系统组件组合成一个可执行文件:

```
gcc a.o -o a

./a 
hello world!
```

更直接生成不同环节的文件，省缺中间环节：

```
# 预处理
gcc -E hello.c -o a.i
# 编译
gcc -S hello.c -o a.s
# 汇编
gcc -c hello.c -o a.o
# 链接
gcc hello.c -o a
```

### 静态库和动态库

根据链接方式的不同，链接过程可以分为：

1. 静态链接：目标文件直接进入可执行文件
2. 动态链接：在程序启动后才动态加载目标文件

文件夹下有三个文件：

```
cd link
tree
├── add.c
├── add.h
└── main.c
```

add.h:

```cgo
#ifndef __ADD_H__
#define __ADD_H_

int add(int a, int b);

#endif
```

add.c:

```cgo
#include "add.h"
int add(int a, int b)
{
        return a+b;
}
```

main.c:

```cgo
#include  "add.h"
#include  "stdio.h"

int main()
{
        int sum = add(5,6);
        printf("%d",sum);
        return 0;
}
```

我们可以将 add.c 封装成静态库和动态库来使用。

#### 静态库

首先将 add.c 编译成目标文件:

```
gcc -c add.c -o add.o
```

然后根据目标文件生成静态库:

```
ar -cr libadd.a add.o
```

ar命令可以用来创建、修改库，也可以从库中提出单个模块

1. -c 选项表示 创建一个库。不管库是否存在，都将创建
2. -r 选项表示 将模块插入库，如果库中有对应的模块，那么进行更新

如果把多个 .o 文件插入库 .a 里,只需要在后面用空格分开写出来，格式：

```
ar -cr 静态库libname.a  name1.o name2.o
```

生成静态库 l ibadd.a 后，编译 main.c 连接静态库生成可执行文件main:

```
gcc main.c -o main -I./ -L./ -ladd

./main
```

1. -I选项表示头文件路径
2. -L表示静态库或者动态库的路径

#### 动态库

动态库需要使用 -shared 选项以及 -fPIC 选项

```
gcc -c -fPIC add.c -o a.o
```

-fPIC表示代码是和地址无关的，不需要被不同模块重定位

然后根据目标文件生成动态库.so文件

```
gcc -shared -o libadd.so a.o
```

-shared 选项表示生成的是.so动态库文件


上面的步骤可以直接写成:

```
gcc -shared -fPIC main.c -o libadd.so
```

链接动态库:

```
gcc main.c -o main -I./ -L./ -ladd
```

运行：

```
./main
./main: error while loading shared libraries: libadd.so: cannot open shared object file: No such file or directory
```


我们现在有几种方式配置动态库的方法：

```
export LD_LIBRARY_PATH="./:$LD_LIBRARY_PATH"
./main
```

这种方式将动态库路径配置到LD_LIBRARY_PATH,只是暂时生效。

或者使用 ldconfig 机制（需 root 权限）：

1. 首先，在 /etc/ld.so.conf.d/ 下创建一个 .conf 文件，如 libadd.conf ，内容为共享库所在目录的绝对路径
2. 然后，运行 ldconfig

## Cmake

参考: [Cmake](https://www.hahack.com/codes/cmake)，以下所有例子都是转载的网络并自己实验一遍的。

你或许听过好几种 Make 工具，例如 GNU Make ，QT 的 qmake ，微软的 MS nmake，BSD Make（pmake），Makepp，等等。这些 Make 工具遵循着不同的规范和标准，所执行的 Makefile 格式也千差万别。这样就带来了一个严峻的问题：如果软件想跨平台，必须要保证能够在不同平台编译。而如果使用上面的 Make 工具，就得为每一种标准写一次 Makefile ，这将是一件让人抓狂的工作。

CMake就是针对上面问题所设计的工具：它首先允许开发者编写一种平台无关的 CMakeList.txt 文件来定制整个编译流程，然后再根据目标用户的平台进一步生成所需的本地化 Makefile 和工程文件，如 Unix 的 Makefile 或 Windows 的 Visual Studio 工程。从而做到“Write once, run everywhere”。显然，CMake 是一个比上述几种 make 更高级的编译配置工具。一些使用 CMake 作为项目架构系统的知名开源项目有 VTK、ITK、KDE、OpenCV、OSG 等。

在 linux 平台下使用 CMake 生成 Makefile 并编译的流程如下：

1. 编写 CMake 配置文件 CMakeLists.txt 。
2. 执行命令 cmake PATH 或者 ccmake PATH 生成 Makefile。ccmake 和 cmake 的区别在于前者提供了一个交互式的界面。其中， PATH 是 CMakeLists.txt 所在的目录。
3. 使用 make 命令进行编译。

Debian/Ubuntu等系列apt套件安装：

```
sudo apt install cmake
cmake --version
```

### 单个源文件

可以进入查看:

```
cd Demo1
```

计算指数乘方的 main.c:

```cgo
#include <stdio.h>
#include <stdlib.h>
/**
 * power - Calculate the power of number.
 * @param base: Base value.
 * @param exponent: Exponent value.
 *
 * @return base raised to the power exponent.
 */
double power(double base, int exponent)
{
    int result = base;
    int i;

    if (exponent == 0) {
        return 1;
    }

    for(i = 1; i < exponent; ++i){
        result = result * base;
    }
    return result;
}
int main(int argc, char *argv[])
{
    if (argc < 3){
        printf("Usage: %s base exponent \n", argv[0]);
        return 1;
    }
    double base = atof(argv[1]);
    int exponent = atoi(argv[2]);
    double result = power(base, exponent);
    printf("%g ^ %d is %g\n", base, exponent, result);
    return 0;
}
```

CMakeLists.txt:

```
# CMake 最低版本号要求
cmake_minimum_required (VERSION 2.8)
# 项目信息
project (Demo1)
# 指定生成目标
add_executable(main main.c)
```

上面的 CMakeLists.txt 文件，依次出现了几个命令：

1. cmake_minimum_required：指定运行此配置文件所需的 CMake 的最低版本；
2. project：参数值是 Demo1，该命令表示项目的名称是 Demo1 。
3. add_executable： 将名为 main.c 的源文件编译成一个名称为 main 的可执行文件。


执行：

```
cmake .
make
./main 2 3
```

### 多个源文件

可以进入查看:

```
cd Demo2
```

把 `power`拆出来，变成两个源文件。

```
├── main.c
├── MathFunctions.c
└── MathFunctions.h
```

main.c:

```cgo
#include <stdio.h>
#include <stdlib.h>
#include "MathFunctions.h"

int main(int argc, char *argv[])
{
    if (argc < 3){
        printf("Usage: %s base exponent \n", argv[0]);
        return 1;
    }
    double base = atof(argv[1]);
    int exponent = atoi(argv[2]);
    double result = power(base, exponent);
    printf("%g ^ %d is %g\n", base, exponent, result);
    return 0;
}
```

MathFunctions.h:

```cgo
#ifndef POWER_H
#define POWER_H

extern double power(double base, int exponent);

#endif
```

CMakeLists.txt:

```
# CMake 最低版本号要求
cmake_minimum_required (VERSION 2.8)

# 项目信息
project (Demo2)

# 查找目录下的所有源文件
# 并将名称保存到 DIR_SRCS 变量
aux_source_directory(. DIR_SRCS)

# 指定生成目标
add_executable(main ${DIR_SRCS})
```


本来多个源文件可以使用`add_executable(main main.c MathFunctions.c)`，但源文件一多就抓急，所以使用：

```
# 查找目录下的所有源文件
# 并将名称保存到 DIR_SRCS 变量
aux_source_directory(. DIR_SRCS)
```

执行：

```
cmake .
make
./main 2 3
```

### 多个目录多个源文件

可以进入查看:

```
cd Demo3

tree 

├── CMakeLists.txt
├── main.c
└── math
    ├── CMakeLists.txt
    ├── MathFunctions.c
    └── MathFunctions.h
```

需要分别在项目根目录 Demo3 和 math 目录里各编写一个 CMakeLists.txt 文件。为了方便，我们可以先将 math 目录里的文件编译成静态库再由 main 函数调用。

根目录的 CMakeLists.txt:

```
# CMake 最低版本号要求
cmake_minimum_required (VERSION 2.8)

# 项目信息
project (Demo3)

# 查找目录下的所有源文件
# 并将名称保存到 DIR_SRCS 变量
aux_source_directory(. DIR_SRCS)

# 添加 math 子目录
add_subdirectory(math)

# 指定生成目标
add_executable(main ${DIR_SRCS})

# 添加链接库
target_link_libraries(main MathFunctions)
```

使用命令 `add_subdirectory` 指明本项目包含一个子目录 math，这样 math 目录下的 CMakeLists.txt 文件和源代码也会被处理。

使用命令 `target_link_libraries` 指明可执行文件 main 需要连接一个名为 MathFunctions 的链接库 。

根目录的 CMakeLists.txt:

```
# 查找当前目录下的所有源文件
# 并将名称保存到 DIR_LIB_SRCS 变量
aux_source_directory(. DIR_LIB_SRCS)

# 指定生成 MathFunctions 链接库
add_library (MathFunctions ${DIR_LIB_SRCS})
```

在该文件中使用命令 `add_library` 将 src 目录中的源文件编译为静态链接库：`libMathFunctions.a`。

执行：

```
cmake .
make
./main 2 3
```

### 自定义编译选项

CMake 允许为项目增加编译选项，从而可以根据用户的环境和需求选择最合适的编译方案。


可以进入查看:

```
cd Demo4

tree 
├── CMakeLists.txt
├── config.h.in
├── main.c
└── math
    ├── CMakeLists.txt
    ├── MathFunctions.c
    └── MathFunctions.h
```

main.c：

```cgo
#include <stdio.h>
#include <stdlib.h>
#include <config.h>

#ifdef USE_MYMATH
  #include <MathFunctions.h>
#else
  #include <math.h>
#endif


int main(int argc, char *argv[])
{
    if (argc < 3){
        printf("Usage: %s base exponent \n", argv[0]);
        return 1;
    }

    double base = atof(argv[1]);
    int exponent = atoi(argv[2]);

#ifdef USE_MYMATH
    printf("Now we use our own Math library. \n");
    double result = power(base, exponent);
#else
    printf("Now we use the standard library. \n");
    double result = pow(base, exponent);
#endif
    
    printf("%g ^ %d is %g\n", base, exponent, result);
    return 0;
}
```

我们定义了一个宏：`USE_MYMATH`来决定使用我们自己的库还是标准库的。

这里引用了一个 `config.h` 文件，这个文件预定义了 USE_MYMATH 的值。但我们并不直接编写这个文件。

根目录的 CMakeLists.txt:

```
# CMake 最低版本号要求
cmake_minimum_required (VERSION 2.8)

# 项目信息
project (Demo4)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

# 加入一个配置头文件，用于处理 CMake 对源码的设置
configure_file (
  "${PROJECT_SOURCE_DIR}/config.h.in"
  "${PROJECT_BINARY_DIR}/config.h"
  )

# 是否使用自己的 MathFunctions 库
option (USE_MYMATH
	   "Use provided math implementation" ON)

# 是否加入 MathFunctions 库
if (USE_MYMATH)
  include_directories ("${PROJECT_SOURCE_DIR}/math")
  add_subdirectory (math)
  set (EXTRA_LIBS ${EXTRA_LIBS} MathFunctions)
else ()
  set (EXTRA_LIBS ${EXTRA_LIBS} m)
endif (USE_MYMATH)

# 查找当前目录下的所有源文件
# 并将名称保存到 DIR_SRCS 变量
aux_source_directory(. DIR_SRCS)

# 指定生成目标
add_executable (main ${DIR_SRCS})

# 添加链接库
target_link_libraries (main  ${EXTRA_LIBS})

```

其中：

1.`set(CMAKE_INCLUDE_CURRENT_DIR ON)`。自定义变量使用`SET(OBJ_NAME xxxx)`，使用时`${OBJ_NAME}`，
这个`CMAKE_INCLUDE_CURRENT_DIR`参数默认OFF,当ON时表示`${CMAKE_CURRENT_SOURCE_DIR}` 和 `${CMAKE_CURRENT_BINARY_DIR}` 被加入到include path中，即头文件路径中。

cmake的常用变量：

```
CMAKE_BINARY_DIR,PROJECT_BINARY_DIR,_BINARY_DIR：这三个变量内容一致，如果是内部编译，就指的是工程的顶级目录，如果是外部编译，指的就是工程编译发生的目录。
CMAKE_SOURCE_DIR,PROJECT_SOURCE_DIR,_SOURCE_DIR：这三个变量内容一致，都指的是工程的顶级目录。
CMAKE_CURRENT_BINARY_DIR：外部编译时，指的是target目录，内部编译时，指的是顶级目录
CMAKE_CURRENT_SOURCE_DIR：CMakeList.txt所在的目录
CMAKE_CURRENT_LIST_DIR：CMakeList.txt的完整路径
CMAKE_CURRENT_LIST_LINE：当前所在的行
CMAKE_MODULE_PATH：如果工程复杂，可能需要编写一些cmake模块，这里通过SET指定这个变量
LIBRARY_OUTPUT_DIR,BINARY_OUTPUT_DIR：库和可执行的最终存放目录
```

2.`configure_file`命令用于加入一个配置头文件 config.h ，这个文件由 CMake 从 config.h.in 生成，通过这样的机制，将可以通过预定义一些参数和变量来控制代码的生成。

3.`option`命令添加了一个 USE_MYMATH 选项，并且默认值为 ON。

4.`include_directories ("${PROJECT_SOURCE_DIR}/math")`指定头文件路径。

5.`set (EXTRA_LIBS ${EXTRA_LIBS} MathFunctions)`表示设置`${EXTRA_LIBS`}和`MathFunctions`两个作为数组设置进变量，为后面链接库做准备。


config.h.in：

```
#cmakedefine USE_MYMATH
```

这样 CMake 会自动根据 CMakeLists 配置文件中的设置自动生成 config.h 文件。

为了便于交互式的选择该变量的值，可以使用 ccmake 命令来编译：

安装 ccmake 和创建编译目录：

```
sudo apt install cmake-curses-gui

mkdir build
```

编译：

```
cd build

ccmake ..

EMPTY CACHE


EMPTY CACHE:                                                                                                                                    
Press [enter] to edit option                                                                                                 CMake Version 3.5.1
Press [c] to configure
Press [h] for help           Press [q] to quit without generating
Press [t] to toggle advanced mode (Currently On)
```

按键盘的方向键可以在不同的选项窗口间跳转，按下 enter 键可以修改该选项。修改完成后可以按下 c 选项完成配置，之后再按 g 键确认生成 Makefile 。ccmake 的其他操作可以参考窗口下方给出的指令提示。

```
make 
./main 2 3
Now we use our own Math library. 
2 ^ 3 is 8
```

我们再清除一下 `build`目录然后更改选项：

```
mkdir build
cd build
ccmake ..
make 
./main 2 3
Now we use the standard library. 
2 ^ 3 is 8
```

### 安装和测试

CMake 也可以指定安装规则，以及添加测试。这两个功能分别可以通过在产生 Makefile 后使用 make install 和 make test 来执行。在以前的 GNU Makefile 里，你可能需要为此编写 install 和 test 两个伪目标和相应的规则，但在 CMake 里，这样的工作同样只需要简单的调用几条命令。


可以进入查看:

```
cd Demo5
```

首先先在 `math/CMakeLists.txt` 文件里添加下面两行：

```
# 指定 MathFunctions 库的安装路径
install (TARGETS MathFunctions DESTINATION bin)
install (FILES MathFunctions.h DESTINATION include)
```

指明 MathFunctions 库的安装路径。将目标`TARGETS`静态库`libMathFunctions`安装在`bin`文件夹中，而将文件`FILES`头文件`MathFunctions.h`安装在`include`文件夹中。

之后同样修改根目录的 CMakeLists 文件，在末尾添加下面几行：

```
# 指定安装路径
install (TARGETS main DESTINATION bin)
install (FILES "${PROJECT_BINARY_DIR}/config.h"
         DESTINATION include)
```

通过上面的定制，生成的 main 文件和 MathFunctions 函数库 libMathFunctions.o 文件将会被复制到 /usr/local/bin 中，而 MathFunctions.h 和生成的 config.h 文件则会被复制到 /usr/local/include 中。

编译：

```
mkdir  build
cd build
ccmake ..
make


sudo make install
[ 50%] Built target MathFunctions
[100%] Built target main
Install the project...
-- Install configuration: ""
-- Installing: /usr/local/bin/main
-- Installing: /usr/local/include/config.h
-- Installing: /usr/local/lib/libMathFunctions.a
-- Installing: /usr/local/include/MathFunctions.h

main 2 3
Now we use our own Math library. 
2 ^ 3 is 8

```

测试完毕我们清除 install 的文件：

```
sudo rm -rf /usr/local/bin/main 
sudo rm -rf /usr/local/include/config.h 
sudo rm -rf /usr/local/lib/libMathFunctions.a 
sudo rm -rf /usr/local/include/MathFunctions.h
```

### 为工程添加测试
    
添加测试同样很简单。CMake 提供了一个称为 CTest 的测试工具。我们要做的只是在项目根目录的 CMakeLists 文件中调用一系列的 add_test 命令。

仍然是 Demo5。

根目录的 CMakeLists 文件添加：

```
# 启用测试
enable_testing()

# 测试程序是否成功运行
add_test (test_run main 5 2)

# 测试帮助信息是否可以正常提示
add_test (test_usage main)
set_tests_properties (test_usage
  PROPERTIES PASS_REGULAR_EXPRESSION "Usage: .* base exponent")
  
# 测试 5 的平方
add_test (test_5_2 main 5 2)
set_tests_properties (test_5_2
 PROPERTIES PASS_REGULAR_EXPRESSION "is 25")
 
# 测试 10 的 5 次方
add_test (test_10_5 main 10 5)
set_tests_properties (test_10_5
 PROPERTIES PASS_REGULAR_EXPRESSION "is 100000")
 
# 测试 2 的 10 次方
add_test (test_2_10 main 2 10)
set_tests_properties (test_2_10
 PROPERTIES PASS_REGULAR_EXPRESSION "is 1024")
```

上面的代码包含了四个测试。第一个测试 test_run 用来测试程序是否成功运行并返回 0 值。

剩下的三个测试分别用来测试 5 的 平方、10 的 5 次方、2 的 10 次方是否都能得到正确的结果。其中 `PASS_REGULAR_EXPRESSION` 用来测试输出是否包含后面跟着的字符串。

```
add_test (test_5_2 main 5 2)
set_tests_properties (test_5_2
 PROPERTIES PASS_REGULAR_EXPRESSION "is 25")
 ```
 
加了一个叫`test_5_2`名字的测试测试，检查输出是否是`is 25`。
 
执行测试：
 
```
make test
Running tests...
Test project /opt/cmake_example/Demo5/build
    Start 1: test_run
1/5 Test #1: test_run .........................   Passed    0.00 sec
    Start 2: test_usage
2/5 Test #2: test_usage .......................   Passed    0.00 sec
    Start 3: test_5_2
3/5 Test #3: test_5_2 .........................   Passed    0.00 sec
    Start 4: test_10_5
4/5 Test #4: test_10_5 ........................   Passed    0.00 sec
    Start 5: test_2_10
5/5 Test #5: test_2_10 ........................   Passed    0.00 sec
```

如果有很多的测试要写，很麻烦，所以可以定义一个重复利用的宏：

```
# 定义一个宏，用来简化测试工作
macro (do_test arg1 arg2 result)
  add_test (test_${arg1}_${arg2} main ${arg1} ${arg2})
  set_tests_properties (test_${arg1}_${arg2}
    PROPERTIES PASS_REGULAR_EXPRESSION ${result})
endmacro (do_test)

# 利用 do_test 宏，测试一系列数据
do_test (5 2 "is 25")
do_test (10 5 "is 100000")
do_test (2 10 "is 1024")
```

产生的效果是一样的。


### 支持 gdb 调试

让 CMake 支持 gdb 的设置也很容易，只需要指定 Debug 模式下开启 -g 选项：

```
set(CMAKE_BUILD_TYPE "Debug")
set(CMAKE_CXX_FLAGS_DEBUG "$ENV{CXXFLAGS} -O0 -Wall -g -ggdb")
set(CMAKE_CXX_FLAGS_RELEASE "$ENV{CXXFLAGS} -O3 -Wall")
```

执行并调试：

```
ccmake .
make


gdb main

(gdb) r 2 3
Starting program: /opt/cmake_example/Demo5/build/main 2 3
Now we use our own Math library. 
2 ^ 3 is 8

(gdb) l
1       #include <stdio.h>
2       #include <stdlib.h>
3       #include <config.h>
4       
5       #ifdef USE_MYMATH
6         #include <MathFunctions.h>
7       #else
8         #include <math.h>
9       #endif
10      

(gdb) b 18
Breakpoint 1 at 0x4008ae: file /opt/cmake_example/Demo5/main.c, line 18.
(gdb) r 2 3
Starting program: /opt/cmake_example/Demo5/build/main 2 3

Breakpoint 1, main (argc=3, argv=0x7fffffffdc48) at /opt/cmake_example/Demo5/main.c:18
18          double base = atof(argv[1]);
(gdb) c
Continuing.
Now we use our own Math library. 
2 ^ 3 is 8
[Inferior 1 (process 3119) exited normally]

```

gdb调试指令一条龙：

1. l列出代码
2. b设置断点
3. r运行程序
4. s进入断点内部
5. c断点继续
6. q退出


### 添加环境检查

有时候可能要对系统环境做点检查，例如要使用一个平台相关的特性的时候。在这个例子中，我们检查系统是否自带 pow 函数。如果带有 pow 函数，就使用它；否则使用我们定义的 power 函数。

可以进入查看:

```
cd Demo6
```

根目录的 CMakeLists:

```
# CMake 最低版本号要求
cmake_minimum_required (VERSION 2.8)

# 项目信息
project (Demo6)

set (CMAKE_INCLUDE_CURRENT_DIR ON)

# 检查系统是否支持 pow 函数
message ("doing check pow")
include (${CMAKE_ROOT}/Modules/CheckFunctionExists.cmake)

check_function_exists (pow HAVE_POW)
check_function_exists (printf HAVE_XXXX)

# 加入一个配置头文件，用于处理 CMake 对源码的设置
configure_file (
  "${PROJECT_SOURCE_DIR}/config.h.in"
  "${PROJECT_BINARY_DIR}/config.h"
  )

# 是否加入 MathFunctions 库
if (NOT HAVE_POW)
  include_directories ("${PROJECT_SOURCE_DIR}/math")
  add_subdirectory (math)
  set (EXTRA_LIBS ${EXTRA_LIBS} MathFunctions)
endif (NOT HAVE_POW)

# 查找当前目录下的所有源文件
# 并将名称保存到 DIR_SRCS 变量
aux_source_directory(. DIR_SRCS)

# 指定生成目标
add_executable(main ${DIR_SRCS})
target_link_libraries (main  ${EXTRA_LIBS})

# 指定安装路径
install (TARGETS main DESTINATION bin)
install (FILES "${PROJECT_BINARY_DIR}/config.h"
         DESTINATION include)

# 启用测试
enable_testing()

# 测试程序是否成功运行
add_test (test_run main 5 2)

# 测试帮助信息是否可以正常提示
add_test (test_usage main)
set_tests_properties (test_usage
  PROPERTIES PASS_REGULAR_EXPRESSION "Usage: .* base exponent")

# 定义一个宏，用来简化测试工作
macro (do_test arg1 arg2 result)
  add_test (test_${arg1}_${arg2} main ${arg1} ${arg2})
  set_tests_properties (test_${arg1}_${arg2}
    PROPERTIES PASS_REGULAR_EXPRESSION ${result})
endmacro (do_test)
 
# 利用 do_test 宏，测试一系列数据
do_test (5 2 "is 25")
do_test (10 5 "is 100000")
do_test (2 10 "is 1024")
```


其中添加 CheckFunctionExists.cmake 宏，并调用 check_function_exists 命令测试链接器是否能够在链接阶段找到 pow 函数：

```
# 检查系统是否支持 pow 函数
message ("doing check pow")
include (${CMAKE_ROOT}/Modules/CheckFunctionExists.cmake)

check_function_exists (pow HAVE_POW)
check_function_exists (printf HAVE_XXXX)
```

如果存在，宏 HAVE_POW 将会被设置。

执行：

```
mkdir build
cd build
cmake ..
doing check pow
-- Looking for pow
-- Looking for pow - not found
-- Looking for printf
-- Looking for printf - found

make
```

为什么 pow 找不到呢，而 printf 找得到，因为数学函数位于libm.so库文件中（这些库文件通常位于/lib目录下），-lm选项告诉编译器，我们程序中用到的数学函数要到这个库文件里找。printf位于libc.so库文件中，使用libc.so中的库函数在编译时不需要加-lc选项，当然加了也不算错，因为这个选项是gcc的默认选项。

### 添加版本号

可以进入查看:

```
cd Demo7
```

给项目添加和维护版本号是一个好习惯，这样有利于用户了解每个版本的维护情况，并及时了解当前所用的版本是否过时，或是否可能出现不兼容的情况。

首先修改顶层 CMakeLists 文件，在 project 命令之后加入如下两行：


```
set (Demo_VERSION_MAJOR 1)
set (Demo_VERSION_MINOR 0)
```

分别指定当前的项目的主版本号和副版本号。

之后，为了在代码中获取版本信息，我们可以修改 config.h.in 文件，添加两个预定义变量：

```
// the configured options and settings for Tutorial
#define Demo_VERSION_MAJOR @Demo_VERSION_MAJOR@
#define Demo_VERSION_MINOR @Demo_VERSION_MINOR@
```

此时 main.c:

```cgo
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "config.h"
#include "math/MathFunctions.h"
int main(int argc, char *argv[])
{
    if (argc < 3){
        // print version info
        printf("%s Version %d.%d\n",
            argv[0],
            Demo_VERSION_MAJOR,
            Demo_VERSION_MINOR);
        printf("Usage: %s base exponent \n", argv[0]);
        return 1;
    }
    double base = atof(argv[1]);
    int exponent = atoi(argv[2]);
    
#if defined (HAVE_POW)
    printf("Now we use the standard library. \n");
    double result = pow(base, exponent);
#else
    printf("Now we use our own Math library. \n");
    double result = power(base, exponent);
#endif
    
    printf("%g ^ %d is %g\n", base, exponent, result);
    return 0;
}
```

编译后可以打印版本号:

```
mkdir build
cd build 
cmake ..
make 
./main
./main Version 1.0
Usage: ./main base exponent 

```

### 生成安装包

我们要学习如何配置生成各种平台上的安装包，包括二进制安装包和源码安装包。为了完成这个任务，我们需要用到 CPack ，它同样也是由 CMake 提供的一个工具，专门用于打包。

这是最重要的部分，因为我们工程完成后需要交付或者部署。

可以进入查看:

```
cd Demo8
```

我们在顶层 CMakeLists 文件最后添加：

```
# 构建一个 CPack 安装包
include (InstallRequiredSystemLibraries)
set (CPACK_RESOURCE_FILE_LICENSE
  "${CMAKE_CURRENT_SOURCE_DIR}/License.txt")
set (CPACK_PACKAGE_VERSION_MAJOR "${Demo_VERSION_MAJOR}")
set (CPACK_PACKAGE_VERSION_MINOR "${Demo_VERSION_MINOR}")
include (CPack)
```


1. 导入 InstallRequiredSystemLibraries 模块，以便之后导入 CPack 模块；
2. 设置一些 CPack 相关变量，包括版权信息和版本信息，其中版本信息用了上一节定义的版本号；
3. 导入 CPack 模块。

执行：

```
mkdir build
cd build
cmake ..
cpack -C CPackConfig.cmake

cpack -C CPackConfig.cmake
CPack: Create package using STGZ
CPack: Install projects
CPack: - Run preinstall target for: Demo8
CPack: - Install project: Demo8
CPack: Create package
CPack: - package: /opt/cmake_example/Demo8/build/Demo8-1.0.1-Linux.sh generated.
CPack: Create package using TGZ
CPack: Install projects
CPack: - Run preinstall target for: Demo8
CPack: - Install project: Demo8
CPack: Create package
CPack: - package: /opt/cmake_example/Demo8/build/Demo8-1.0.1-Linux.tar.gz generated.
CPack: Create package using TZ
CPack: Install projects
CPack: - Run preinstall target for: Demo8
CPack: - Install project: Demo8
CPack: Create package
CPack: - package: /opt/cmake_example/Demo8/build/Demo8-1.0.1-Linux.tar.Z generated.
```

执行 cpack -C CPackConfig.cmake 命令后生成三个二进制包：

```
Demo8-1.0.1-Linux.sh  Demo8-1.0.1-Linux.tar.gz  Demo8-1.0.1-Linux.tar.Z
```

这 3 个二进制包文件所包含的内容是完全相同的。我们可以执行其中一个 Demo8-1.0.1-Linux.sh  。此时会出现一个由 CPack 自动生成的交互式安装界面：

```
./Demo8-1.0.1-Linux.sh

Do you accept the license? [yN]: 
y
By default the Demo8 will be installed in:
  "/opt/cmake_example/Demo8/build/Demo8-1.0.1-Linux"
Do you want to include the subdirectory Demo8-1.0.1-Linux?
Saying no will install in: "/opt/cmake_example/Demo8/build" [Yn]: 
y
```


安装好了：

```
cd Demo8-1.0.1-Linux/bin
./main
```

[qmake转cmake](https://gitlab.kitware.com/cmake/community/wikis/contrib/scripts/ConvertFromQmake)


### 生产库实例

可以参考 [OpenSSL with CMake build system ](https://github.com/pol51/OpenSSL-CMake)

顶层 CMakeLists 文件：

```
project( openssl )
cmake_minimum_required( VERSION 2.8.3 )

set(BUILD_OBJECT_LIBRARY_ONLY OFF BOOL)

include_directories ( BEFORE SYSTEM ${CMAKE_CURRENT_BINARY_DIR}/crypto ${CMAKE_CURRENT_BINARY_DIR}/ssl crypto . )

add_definitions( -DOPENSSL_NO_ASM )

if( WIN32 AND NOT CYGWIN )
  add_definitions( -DOPENSSL_SYSNAME_WIN32 )
  add_definitions( -DWIN32_LEAN_AND_MEAN )
endif ( )

if( MINGW )
  set( CMAKE_SHARED_LINKER_FLAGS "-Wl,--export-all" )
endif()

add_subdirectory( crypto )
add_subdirectory( ssl )
if( BUILD_OBJECT_LIBRARY_ONLY)
  file( COPY e_os2.h DESTINATION ${CMAKE_CURRENT_BINARY_DIR} )
else()
  add_subdirectory( apps )

  install( FILES e_os2.h DESTINATION include/openssl )

  install( FILES tools/c_hash tools/c_info tools/c_issuer tools/c_name tools/c_rehash
      FAQ LICENSE PROBLEMS README README.ASN1 README.ENGINE
      DESTINATION share/openssl )

  install( DIRECTORY doc DESTINATION ./ )

  install( FILES e_os2.h DESTINATION include/openssl )

  # Generate the package target
  set( CPACK_GENERATOR ZIP TGZ )
  set( CPACK_PACKAGE_NAME "openssl-cmake" )
  set( CPACK_PACKAGE_VERSION_MAJOR 1  )
  set( CPACK_PACKAGE_VERSION_MINOR 0  )
  set( CPACK_PACKAGE_VERSION_PATCH 1u )

  include( CPack )
endif()
```

更多参考: [https://cmake.org/cmake-tutorial/](https://cmake.org/cmake-tutorial/)


### 补充 

readelf命令，一般用于查看ELF格式的文件信息，常见的文件如在Linux上的可执行文件，动态库(*.so)或者静态库(*.a) 等包含ELF格式的文件。

```
readelf -dl main
```

动态库路径设置：

```
export LD_LIBRARY_PATH=LD_LIBRARY_PATH:/XXX
./main
```