---
layout: post
title: "面试必问：Golang高阶-Golang协程实现原理"
date: 2019-05-15
author: 大头
desc: "并发编程真的很重要..."
categories: ["Golang"]
tags: ["golang"]
permalink: "/language/goroutine.html"
---

# 引言

实现并发编程有进程，线程，IO多路复用的方式。（并发和并行我们这里不区分，如果CPU是多核的，可能在多个核同时进行，我们叫并行，如果是单核，需要排队切换，我们叫并发）

## 进程和线程的区别

进程是计算机资源分配的最小单位，进程是对处理器资源(CPU)，虚拟内存（1）的抽象，

虚拟内存是对主存资源(Memory)和文件（2）的抽象，文件是对I/O设备的抽象。

虚拟内存是操作系统初始化后内部维护的一个程序加载空间，对于32位操作系统来说，也就是寄存器有32位的比特长度，虚拟内存中每个字节都有一个内存地址，内存地址的指针长度为32位(刚好是寄存器可以存放的位数)，算下来2的32次，刚好可以存放4G左右的字节，所以在32位的操作系统上，你的8G内存条只有50%的利用率，所以现在都是64位的操作系统。

其中，CPU，Memory，I/O设备就是我们所说的CPU核，内存，硬盘。

线程是计算机调度的最小单位，也就是CPU大脑调度的最小单位，同个进程下的线程可以共享同个进程分配的计算机资源。

同个进程下的线程间切换需要CPU切换上下文，但不需要创建新的虚拟内存空间，不需要内存管理单元切换上下文，比不同进程切换会显得更轻量。

总上所述，实际并发的是线程。首先，每个进程都有一个主线程，因为线程是调度的最小单位，你可以只有一个线程，但是你也可以创建多几个线程，线程调度需要CPU来切换，需要内核层的上下文切换，如果你跑了A线程，然后切到B线程，内核调用开始，CPU需要对A线程的上下文保留，然后切到B线程，然后把控制权交给你的应用层调度。进程切换也需要内核来切换，因为从C进程的主线程切换到D进程的主线程。。。

## 进程间通信和线程间通信

那么进程间要通讯呀，而且他们资源不共享，这个时候需要用IPC（Inter-Process Communication，进程间通信），常用的有信号量，共享内存，套接字，实际百度上说有六种耶。

而同个进程的多个线程共享资源，通讯起来比进程容易多了，因为它们共享了虚拟内存的空间，直接就可以读取内存，现在很多Python，Java等编程语言都有这种线程库实现。

至于IO多路复用，其实就是维持一个线程队列，然后让一个线程或多个线程，去队列里面拿任务去完成。为什么呢？因为线程的数量是有限的，而且线程间通讯需要点资源，内核也要频繁切换上下文，干脆就弄一个池，有任务就派个小弟出去。

只有一个线程的IO多路复用，典型的就是Redis和Nodejs了，根本不需要切换上下文，一个线程走天下。而多个线程的IP多路复用，就是Golang协程的实现方式了，协程，自己管理线程，把线程控制到一定的数量，然后构造一个规则状态机来调度任务。


# Golang协程

无论是一个进程下的多个线程，还是不同进程，还是不同进程下的线程，切换时都需要损耗资源，浪费一些资源。所以Golang有协程这种东西，就是在语言内部管理自己的一些线程，合理的调度方式，使得线程不那么频繁的切换。

Golang语言的调度器其实就是通过使用数量合适的线程并在每一个线程上执行更多的工作来降低操作系统和硬件的负载。

## 调度器数据结构

Golang调度器有三个主要数据结构。

1. M，操作系统的线程，被操作系统管理的，原生线程。
2. G，协程，被Golang语言本身管理的线程，该结构体中包含一些指令或者调度的信息。
3. P，调度的上下文，运行在M上的调度器。

也就是说，Golang使用`P`来对`M`进行管理，延伸出`G`的概念。

## G:假线程

Goroutine，也就是`G`，只存在于Go语言运行时，是对实际操作系统线程的映射，一般是`M:1`映射。也就是说，可能5个`G`，其实真实情况只有1个`M`。Golang帮你做了调度，帮你进行了抽象。

数据结构定义可以在此查看：[/src/runtime/runtime2.go](https://github.com/golang/go/blob/d6ffc1d8394d6f6420bb92d79d320da88720fbe0/src/runtime/runtime2.go#L387-L450)

```
type g struct {
	// Stack parameters.
	// stack describes the actual stack memory: [stack.lo, stack.hi).
	// stackguard0 is the stack pointer compared in the Go stack growth prologue.
	// It is stack.lo+StackGuard normally, but can be StackPreempt to trigger a preemption.
	// stackguard1 is the stack pointer compared in the C stack growth prologue.
	// It is stack.lo+StackGuard on g0 and gsignal stacks.
	// It is ~0 on other goroutine stacks, to trigger a call to morestackc (and crash).
	stack       stack   // offset known to runtime/cgo
	stackguard0 uintptr // offset known to liblink
	stackguard1 uintptr // offset known to liblink

	_panic         *_panic // innermost panic - offset known to liblink
	_defer         *_defer // innermost defer
	m              *m      // current m; offset known to arm liblink
	sched          gobuf
	syscallsp      uintptr        // if status==Gsyscall, syscallsp = sched.sp to use during gc
	syscallpc      uintptr        // if status==Gsyscall, syscallpc = sched.pc to use during gc
	stktopsp       uintptr        // expected sp at top of stack, to check in traceback
	param          unsafe.Pointer // passed parameter on wakeup
	atomicstatus   uint32
	stackLock      uint32 // sigprof/scang lock; TODO: fold in to atomicstatus
	goid           int64
	schedlink      guintptr
	waitsince      int64      // approx time when the g become blocked
	waitreason     waitReason // if status==Gwaiting
	preempt        bool       // preemption signal, duplicates stackguard0 = stackpreempt
	paniconfault   bool       // panic (instead of crash) on unexpected fault address
	preemptscan    bool       // preempted g does scan for gc
	gcscandone     bool       // g has scanned stack; protected by _Gscan bit in status
	gcscanvalid    bool       // false at start of gc cycle, true if G has not run since last scan; TODO: remove?
	throwsplit     bool       // must not split stack
	raceignore     int8       // ignore race detection events
	sysblocktraced bool       // StartTrace has emitted EvGoInSyscall about this goroutine
	sysexitticks   int64      // cputicks when syscall has returned (for tracing)
	traceseq       uint64     // trace event sequencer
	tracelastp     puintptr   // last P emitted an event for this goroutine
	lockedm        muintptr
	sig            uint32
	writebuf       []byte
	sigcode0       uintptr
	sigcode1       uintptr
	sigpc          uintptr
	gopc           uintptr         // pc of go statement that created this goroutine
	ancestors      *[]ancestorInfo // ancestor information goroutine(s) that created this goroutine (only used if debug.tracebackancestors)
	startpc        uintptr         // pc of goroutine function
	racectx        uintptr
	waiting        *sudog         // sudog structures this g is waiting on (that have a valid elem ptr); in lock order
	cgoCtxt        []uintptr      // cgo traceback context
	labels         unsafe.Pointer // profiler labels
	timer          *timer         // cached timer for time.Sleep
	selectDone     uint32         // are we participating in a select and did someone win the race?

	// Per-G GC state

	// gcAssistBytes is this G's GC assist credit in terms of
	// bytes allocated. If this is positive, then the G has credit
	// to allocate gcAssistBytes bytes without assisting. If this
	// is negative, then the G must correct this by performing
	// scan work. We track this in bytes to make it fast to update
	// and check for debt in the malloc hot path. The assist ratio
	// determines how this corresponds to scan work debt.
	gcAssistBytes int64
}
```

结构`G`定义了一个字段`atomicstatus`，表示当前这个协程的状态：

```
// defined constants
const (
	// G status
	//
	// Beyond indicating the general state of a G, the G status
	// acts like a lock on the goroutine's stack (and hence its
	// ability to execute user code).
	//
	// If you add to this list, add to the list
	// of "okay during garbage collection" status
	// in mgcmark.go too.
	//
	// TODO(austin): The _Gscan bit could be much lighter-weight.
	// For example, we could choose not to run _Gscanrunnable
	// goroutines found in the run queue, rather than CAS-looping
	// until they become _Grunnable. And transitions like
	// _Gscanwaiting -> _Gscanrunnable are actually okay because
	// they don't affect stack ownership.

	// _Gidle means this goroutine was just allocated and has not
	// yet been initialized.
	// 刚刚被分配并且还没有被初始化
	_Gidle = iota // 0

	// _Grunnable means this goroutine is on a run queue. It is
	// not currently executing user code. The stack is not owned.
	// 没有执行代码、没有栈的所有权、存储在运行队列中
	_Grunnable // 1

	// _Grunning means this goroutine may execute user code. The
	// stack is owned by this goroutine. It is not on a run queue.
	// It is assigned an M and a P.
	// 可以执行代码、拥有栈的所有权，被赋予了内核线程 M 和处理器 P
	_Grunning // 2

	// _Gsyscall means this goroutine is executing a system call.
	// It is not executing user code. The stack is owned by this
	// goroutine. It is not on a run queue. It is assigned an M.
	// 正在执行系统调用、拥有栈的所有权、没有执行用户代码，被赋予了内核线程 M 但是不在运行队列上
	_Gsyscall // 3

	// _Gwaiting means this goroutine is blocked in the runtime.
	// It is not executing user code. It is not on a run queue,
	// but should be recorded somewhere (e.g., a channel wait
	// queue) so it can be ready()d when necessary. The stack is
	// not owned *except* that a channel operation may read or
	// write parts of the stack under the appropriate channel
	// lock. Otherwise, it is not safe to access the stack after a
	// goroutine enters _Gwaiting (e.g., it may get moved).
	// 由于运行时而被阻塞，没有执行用户代码并且不在运行队列上，但是可能存在于 Channel 的等待队列上
	_Gwaiting // 4

	// _Gmoribund_unused is currently unused, but hardcoded in gdb
	// scripts.
	// 暂无作用
	_Gmoribund_unused // 5

	// _Gdead means this goroutine is currently unused. It may be
	// just exited, on a free list, or just being initialized. It
	// is not executing user code. It may or may not have a stack
	// allocated. The G and its stack (if any) are owned by the M
	// that is exiting the G or that obtained the G from the free
	// list.
	// 没有被使用，没有执行代码，可能有分配的栈
	_Gdead // 6

	// _Genqueue_unused is currently unused.
	// 暂无作用
	_Genqueue_unused // 7

	// _Gcopystack means this goroutine's stack is being moved. It
	// is not executing user code and is not on a run queue. The
	// stack is owned by the goroutine that put it in _Gcopystack.
	// 栈正在被拷贝、没有执行代码、不在运行队列上
	_Gcopystack // 8

	// _Gscan combined with one of the above states other than
	// _Grunning indicates that GC is scanning the stack. The
	// goroutine is not executing user code and the stack is owned
	// by the goroutine that set the _Gscan bit.
	//
	// _Gscanrunning is different: it is used to briefly block
	// state transitions while GC signals the G to scan its own
	// stack. This is otherwise like _Grunning.
	//
	// atomicstatus&~Gscan gives the state the goroutine will
	// return to when the scan completes.
	// 为了更友好，把0加上些前缀
	_Gscan         = 0x1000
	_Gscanrunnable = _Gscan + _Grunnable // 0x1001
	_Gscanrunning  = _Gscan + _Grunning  // 0x1002
	_Gscansyscall  = _Gscan + _Gsyscall  // 0x1003
	_Gscanwaiting  = _Gscan + _Gwaiting  // 0x1004
)
```

主要有 `_Grunnable`、`_Grunning`、`_Gsyscall` 和 `_Gwaiting` 四个状态：

```
_Grunnable	没有执行代码、没有栈的所有权、存储在运行队列中
_Grunning	可以执行代码、拥有栈的所有权，被赋予了内核线程 M 和处理器 P
_Gsyscall	正在执行系统调用、拥有栈的所有权、没有执行用户代码，被赋予了内核线程 M 但是不在运行队列上
_Gwaiting	由于运行时而被阻塞，没有执行用户代码并且不在运行队列上，但是可能存在于 Channel 的等待队列上
```

上面进行抽象，`Goroutine`可能在等待某些满足条件，处于`等待中`，当满足条件时会变成`可运行`状态，等待被调度到真实的线程`M`，如果伙伴太多可能需要等很久，等到了会进入`运行中`，表示正在某个M上执行。

## M:真线程

Golang默认情况下，调度器可以创建很多线程，但是最多只有`gomaxprocs`个`M`真线程能真正正常运行。

```
    allp       []*p  // len(allp) == gomaxprocs; may change at safe points, otherwise immutable  每一个真线程M都会被绑定一个调度器P
	allpLock   mutex // Protects P-less reads of allp and all writes
	gomaxprocs int32
```

通常情况下，`gomaxprocs`的数量等于核数，如果你的CPU有四个核，那么就是最多有4个`M`。这样每个核对应一个真线程，不会切换上下文，节省了一些开销，当然你可以改变`runtime.GOMAXPROCS`的值。

```
type m struct {
	g0      *g     // goroutine with scheduling stack 带有调度堆栈信息的G
	morebuf gobuf  // gobuf arg to morestack
	divmod  uint32 // div/mod denominator for arm - known to liblink

	// Fields not known to debuggers.
	procid        uint64       // for debuggers, but offset not hard-coded
	gsignal       *g           // signal-handling g
	goSigStack    gsignalStack // Go-allocated signal handling stack
	sigmask       sigset       // storage for saved signal mask
	tls           [6]uintptr   // thread-local storage (for x86 extern register)
	mstartfn      func()
	curg          *g       // current running goroutine
	caughtsig     guintptr // goroutine running during fatal signal
	p             puintptr // attached p for executing go code (nil if not executing go code)  这就是绑定到M的调度器P
	nextp         puintptr
	oldp          puintptr // the p that was attached before executing a syscall
	id            int64
	mallocing     int32
	throwing      int32
	preemptoff    string // if != "", keep curg running on this m
	locks         int32
	dying         int32
	profilehz     int32
	spinning      bool // m is out of work and is actively looking for work
	blocked       bool // m is blocked on a note
	newSigstack   bool // minit on C thread called sigaltstack
	printlock     int8
	incgo         bool   // m is executing a cgo call
	freeWait      uint32 // if == 0, safe to free g0 and delete m (atomic)
	fastrand      [2]uint32
	needextram    bool
	traceback     uint8
	ncgocall      uint64      // number of cgo calls in total
	ncgo          int32       // number of cgo calls currently in progress
	cgoCallersUse uint32      // if non-zero, cgoCallers in use temporarily
	cgoCallers    *cgoCallers // cgo traceback if crashing in cgo call
	park          note
	alllink       *m // on allm
	schedlink     muintptr
	mcache        *mcache
	lockedg       guintptr
	createstack   [32]uintptr // stack that created this thread.
	lockedExt     uint32      // tracking for external LockOSThread
	lockedInt     uint32      // tracking for internal lockOSThread
	nextwaitm     muintptr    // next m waiting for lock
	waitunlockf   func(*g, unsafe.Pointer) bool
	waitlock      unsafe.Pointer
	waittraceev   byte
	waittraceskip int
	startingtrace bool
	syscalltick   uint32
	thread        uintptr // thread handle
	freelink      *m      // on sched.freem

	// these are here because they are too large to be on the stack
	// of low-level NOSPLIT functions.
	libcall   libcall
	libcallpc uintptr // for cpu profiler
	libcallsp uintptr
	libcallg  guintptr
	syscall   libcall // stores syscall parameters on windows

	vdsoSP uintptr // SP for traceback while in VDSO call (0 if not in call)
	vdsoPC uintptr // PC for traceback while in VDSO call

	dlogPerM

	mOS
}
```

其中：

```
curg          *g       // current running goroutine
```

表示正在真线程`M`上运行的`G`。

## P:将G调度到M的调度器

每一个真线程`M`都会被绑定一个调度器`P`。

```
type p struct {
	id          int32
	status      uint32 // one of pidle/prunning/...  真线程的状态
	link        puintptr
	schedtick   uint32     // incremented on every scheduler call
	syscalltick uint32     // incremented on every system call
	sysmontick  sysmontick // last tick observed by sysmon
	m           muintptr   // back-link to associated m (nil if idle)
	mcache      *mcache
	raceprocctx uintptr

	deferpool    [5][]*_defer // pool of available defer structs of different sizes (see panic.go)
	deferpoolbuf [5][32]*_defer

	// Cache of goroutine ids, amortizes accesses to runtime·sched.goidgen.
	goidcache    uint64
	goidcacheend uint64

	// Queue of runnable goroutines. Accessed without lock.
	runqhead uint32
	runqtail uint32
	runq     [256]guintptr
	// runnext, if non-nil, is a runnable G that was ready'd by
	// the current G and should be run next instead of what's in
	// runq if there's time remaining in the running G's time
	// slice. It will inherit the time left in the current time
	// slice. If a set of goroutines is locked in a
	// communicate-and-wait pattern, this schedules that set as a
	// unit and eliminates the (potentially large) scheduling
	// latency that otherwise arises from adding the ready'd
	// goroutines to the end of the run queue.
	runnext guintptr

	// Available G's (status == Gdead)
	gFree struct {
		gList
		n int32
	}

	sudogcache []*sudog
	sudogbuf   [128]*sudog

	tracebuf traceBufPtr

	// traceSweep indicates the sweep events should be traced.
	// This is used to defer the sweep start event until a span
	// has actually been swept.
	traceSweep bool
	// traceSwept and traceReclaimed track the number of bytes
	// swept and reclaimed by sweeping in the current sweep loop.
	traceSwept, traceReclaimed uintptr

	palloc persistentAlloc // per-P to avoid mutex

	_ uint32 // Alignment for atomic fields below

	// Per-P GC state
	gcAssistTime         int64    // Nanoseconds in assistAlloc
	gcFractionalMarkTime int64    // Nanoseconds in fractional mark worker (atomic)
	gcBgMarkWorker       guintptr // (atomic)
	gcMarkWorkerMode     gcMarkWorkerMode

	// gcMarkWorkerStartTime is the nanotime() at which this mark
	// worker started.
	gcMarkWorkerStartTime int64

	// gcw is this P's GC work buffer cache. The work buffer is
	// filled by write barriers, drained by mutator assists, and
	// disposed on certain GC state transitions.
	gcw gcWork

	// wbBuf is this P's GC write barrier buffer.
	//
	// TODO: Consider caching this in the running G.
	wbBuf wbBuf

	runSafePointFn uint32 // if 1, run sched.safePointFn at next safe point

	pad cpu.CacheLinePad
}
```

其中`status`表示调度器的状态：

```
const (
	// P status

	// _Pidle means a P is not being used to run user code or the
	// scheduler. Typically, it's on the idle P list and available
	// to the scheduler, but it may just be transitioning between
	// other states.
	//
	// The P is owned by the idle list or by whatever is
	// transitioning its state. Its run queue is empty.
	// 处理器没有运行用户代码或者调度器.
	_Pidle = iota

	// _Prunning means a P is owned by an M and is being used to
	// run user code or the scheduler. Only the M that owns this P
	// is allowed to change the P's status from _Prunning. The M
	// may transition the P to _Pidle (if it has no more work to
	// do), _Psyscall (when entering a syscall), or _Pgcstop (to
	// halt for the GC). The M may also hand ownership of the P
	// off directly to another M (e.g., to schedule a locked G).
	// 被线程 M 持有，并且正在执行用户代码或者调度器
	_Prunning

	// _Psyscall means a P is not running user code. It has
	// affinity to an M in a syscall but is not owned by it and
	// may be stolen by another M. This is similar to _Pidle but
	// uses lightweight transitions and maintains M affinity.
	//
	// Leaving _Psyscall must be done with a CAS, either to steal
	// or retake the P. Note that there's an ABA hazard: even if
	// an M successfully CASes its original P back to _Prunning
	// after a syscall, it must understand the P may have been
	// used by another M in the interim.
	// 没有执行用户代码，当前线程陷入系统调用
	_Psyscall

	// _Pgcstop means a P is halted for STW and owned by the M
	// that stopped the world. The M that stopped the world
	// continues to use its P, even in _Pgcstop. Transitioning
	// from _Prunning to _Pgcstop causes an M to release its P and
	// park.
	//
	// The P retains its run queue and startTheWorld will restart
	// the scheduler on Ps with non-empty run queues.
	// 被线程 M 持有，当前处理器由于STW(垃圾回收)被停止
	_Pgcstop

	// _Pdead means a P is no longer used (GOMAXPROCS shrank). We
	// reuse Ps if GOMAXPROCS increases. A dead P is mostly
	// stripped of its resources, though a few things remain
	// (e.g., trace buffers).
	// 当前处理器已经不被使用
	_Pdead
)
```

处理器执行用户代码时会`_Prunning`，当`M`正在系统调用时，会`_Psyscall`，当垃圾回收，Stop the world(STW)时，会`_Pgcstop`。

## 协程创建，销毁，调度过程

详见：[src/runtime/proc.go](https://github.com/golang/go/blob/cf630586ca5901f4aa7817a536209f2366f9c944/src/runtime/proc.go#L3070-L3107)

```
// Goroutine scheduler
// The scheduler's job is to distribute ready-to-run goroutines over worker threads.
//
// The main concepts are:
// G - goroutine.
// M - worker thread, or machine.
// P - processor, a resource that is required to execute Go code.
//     M must have an associated P to execute Go code, however it can be
//     blocked or in a syscall w/o an associated P.
//
// Design doc at https://golang.org/s/go11sched.
```


入口：

```
//go:linkname main_main main.main
func main_main()

// The main goroutine.
func main() {
	g := getg()

	// Racectx of m0->g0 is used only as the parent of the main goroutine.
	// It must not be used for anything else.
	g.m.g0.racectx = 0

	// Max stack size is 1 GB on 64-bit, 250 MB on 32-bit.
	// Using decimal instead of binary GB and MB because
	// they look nicer in the stack overflow failure message.
	if sys.PtrSize == 8 {
		maxstacksize = 1000000000
	} else {
		maxstacksize = 250000000
	}

	// Allow newproc to start new Ms.
	mainStarted = true

	if GOARCH != "wasm" { // no threads on wasm yet, so no sysmon
		systemstack(func() {
			newm(sysmon, nil)
		})
	}

	// Lock the main goroutine onto this, the main OS thread,
	// during initialization. Most programs won't care, but a few
	// do require certain calls to be made by the main thread.
	// Those can arrange for main.main to run in the main thread
	// by calling runtime.LockOSThread during initialization
	// to preserve the lock.
	lockOSThread()

	if g.m != &m0 {
		throw("runtime.main not on m0")
	}

	doInit(&runtime_inittask) // must be before defer
	if nanotime() == 0 {
		throw("nanotime returning zero")
	}

	// Defer unlock so that runtime.Goexit during init does the unlock too.
	needUnlock := true
	defer func() {
		if needUnlock {
			unlockOSThread()
		}
	}()

	// Record when the world started.
	runtimeInitTime = nanotime()

	gcenable()

	main_init_done = make(chan bool)
	if iscgo {
		if _cgo_thread_start == nil {
			throw("_cgo_thread_start missing")
		}
		if GOOS != "windows" {
			if _cgo_setenv == nil {
				throw("_cgo_setenv missing")
			}
			if _cgo_unsetenv == nil {
				throw("_cgo_unsetenv missing")
			}
		}
		if _cgo_notify_runtime_init_done == nil {
			throw("_cgo_notify_runtime_init_done missing")
		}
		// Start the template thread in case we enter Go from
		// a C-created thread and need to create a new thread.
		startTemplateThread()
		cgocall(_cgo_notify_runtime_init_done, nil)
	}

	doInit(&main_inittask)

	close(main_init_done)

	needUnlock = false
	unlockOSThread()

	if isarchive || islibrary {
		// A program compiled with -buildmode=c-archive or c-shared
		// has a main, but it is not executed.
		return
	}
	fn := main_main // make an indirect call, as the linker doesn't know the address of the main package when laying down the runtime
	fn()
	if raceenabled {
		racefini()
	}

	// Make racy client program work: if panicking on
	// another goroutine at the same time as main returns,
	// let the other goroutine finish printing the panic trace.
	// Once it does, it will exit. See issues 3934 and 20018.
	if atomic.Load(&runningPanicDefers) != 0 {
		// Running deferred functions should not take long.
		for c := 0; c < 1000; c++ {
			if atomic.Load(&runningPanicDefers) == 0 {
				break
			}
			Gosched()
		}
	}
	if atomic.Load(&panicking) != 0 {
		gopark(nil, nil, waitReasonPanicWait, traceEvGoStop, 1)
	}

	exit(0)
	for {
		var x *int32
		*x = 0
	}
}
```

我们自己的`main`包下的`main方法`入口执行前，都会先执行运行时的`The main goroutine.`，类似于注入。Golang先准备好各种资源，然后开始执行我们的方法，然后收尾。

从这里开始分析是极好的。

设计文档在：[https://golang.org/s/go11sched](https://golang.org/s/go11sched)