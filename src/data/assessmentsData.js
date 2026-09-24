export const ASSESSMENTS_DATA = {
  mcqs: [
    {
      id: 'mcq-1',
      track: 'java',
      category: 'Java Core & Memory',
      difficulty: 'Intermediate',
      question: 'In Java, what happens in memory when a String literal is created using `String s1 = "Kapil"` vs `String s2 = new String("Kapil")`?',
      options: [
        'Both s1 and s2 are placed strictly on the call stack.',
        's1 refers to the String Constant Pool in heap memory; s2 creates a distinct new String object in the regular heap outside the pool.',
        'Both refer to the exact same object address in heap memory, so s1 == s2 evaluates to true.',
        's2 is stored in Metaspace while s1 is stored in Thread Local Storage.'
      ],
      correctIndex: 1,
      explanation: 's1 uses literal notation which checks the String Constant Pool (SCP) in the heap; if "Kapil" exists, it reuses the reference. s2 using the `new` keyword explicitly allocates a brand new object on the general heap, even if the pool already contains "Kapil". Therefore, `s1 == s2` is false, while `s1.equals(s2)` is true.',
      analogy: 'Think of the String Constant Pool as a shared library book. If you ask for the book title "Kapil", the librarian gives you a bookmark to the already existing copy (s1). But if you say "new book" (s2), the printer prints a separate brand-new physical copy for you, wasting paper!'
    },
    {
      id: 'mcq-2',
      track: 'java',
      category: 'Spring Boot & Microservices',
      difficulty: 'Advanced',
      question: 'Which HTTP status code must an idempotent RESTful endpoint return when an order cancellation is called a second time after already being cancelled?',
      options: [
        '500 Internal Server Error (since the order is no longer in active state)',
        '404 Not Found (since the active order disappeared)',
        '200 OK or 204 No Content reflecting the current cancelled state without re-executing state mutation',
        '301 Moved Permanently'
      ],
      correctIndex: 2,
      explanation: 'Idempotence means making the same request multiple times produces the identical side-effect as making it once. If the order is already cancelled, returning 200 OK (with order status = CANCELLED) or 204 No Content is standard because the resource has reached the requested state.',
      analogy: 'Imagine pressing the elevator button for Floor 4. If someone has already pressed it, the light remains on and nothing breaks. It doesn\'t shock you or shout error; it simply acknowledges Floor 4 is selected!'
    },
    {
      id: 'mcq-3',
      track: 'python',
      category: 'Python Internals & Asynchrony',
      difficulty: 'Intermediate',
      question: 'In Python, what is the key mechanical difference between `asyncio.create_task(coro())` and `await coro()`?',
      options: [
        '`await coro()` pauses the caller and executes sequentially, whereas `create_task()` schedules the coroutine onto the event loop to run concurrently in the background.',
        '`create_task()` spawns a brand new native OS thread, bypassing Python\'s GIL.',
        '`await coro()` can only be used with CPU-bound mathematical operations.',
        '`create_task()` immediately blocks until completion.'
      ],
      correctIndex: 0,
      explanation: '`await coro()` yields execution back to the loop until that specific coroutine finishes before moving to the next line. `asyncio.create_task()` packages the coroutine into a Task object and schedules it immediately, allowing following lines of code to continue executing concurrently.',
      analogy: '`await` is like waiting at the counter until your coffee is poured before you start your email. `create_task` is giving your order to the barista, getting a token, and instantly sitting down to write your email while the coffee is brewing!'
    },
    {
      id: 'mcq-4',
      track: 'python',
      category: 'FastAPI & Pydantic',
      difficulty: 'Advanced',
      question: 'Why does defining a route with `def get_data():` instead of `async def get_data():` in FastAPI sometimes improve performance for blocking database queries?',
      options: [
        'Regular `def` disables all validation checks in FastAPI.',
        'FastAPI executes non-async `def` handlers in an external threadpool (worker threads), preventing blocking calls from freezing the main asyncio event loop.',
        'Regular `def` compiles the Python code directly into C machine instructions.',
        'It makes no difference; FastAPI converts both into identical coroutines.'
      ],
      correctIndex: 1,
      explanation: 'If you perform a blocking operation (like `time.sleep()` or synchronous psycopg2 SQL) inside `async def`, it locks the entire single event loop thread, stopping ALL users. With regular `def`, FastAPI detects synchronous code and offloads it to a background threadpool (`anyio.to_thread.run_sync`), keeping the event loop responsive.',
      analogy: 'If the front-desk receptionist tries to do a 30-minute manual paperwork audit at the counter, the line stalls. Instead, the receptionist hands the audit folder to an assistant in the back office (threadpool) while remaining at the counter to greet new guests!'
    },
    {
      id: 'mcq-5',
      track: 'general',
      category: 'SQL & Database Indexing',
      difficulty: 'Intermediate',
      question: 'Why does adding a B-Tree index on a boolean column like `is_active` (which has only true/false values) in a table of 10,000,000 rows usually get ignored by the PostgreSQL query planner?',
      options: [
        'PostgreSQL does not support indexes on boolean datatypes.',
        'Low cardinality: The database planner recognizes that reading through an index to find 5,000,000 matching rows is slower than a sequential table scan.',
        'Boolean values are stored on external disk sectors.',
        'B-Trees can only balance alphanumeric strings.'
      ],
      correctIndex: 1,
      explanation: 'Cardinailty refers to uniqueness. When a column has only 2 values (true/false), an index does not narrow down rows effectively. Jumping between index blocks and heap pages for 50% of the table is slower than scanning sequential disk blocks. A partial index (`CREATE INDEX ... WHERE is_active = false`) is the industry solution if only 1% of users are inactive.',
      analogy: 'If a college directory had a special color tab for "Is Male / Is Female", thumbing through the color index would not help you find a specific student because 50% of the entire book shares that tab!'
    }
  ],
  codingChallenges: [
    {
      id: 'code-1',
      title: 'Idempotent Transaction Deduplicator',
      difficulty: 'Medium',
      track: 'both',
      problemStatement: 'In payment processing systems like PhonePe and Razorpay, webhook retries can send duplicate transaction payloads. Implement a function that processes a stream of transactions: return True if the transaction is processed for the first time, and False if it has already been processed within the last N seconds.',
      starterCode: {
        java: `import java.util.*;

public class PaymentDeduplicator {
    private final Map<String, Long> processedTransactions = new HashMap<>();
    private final long windowMillis;

    public PaymentDeduplicator(long windowMillis) {
        this.windowMillis = windowMillis;
    }

    public synchronized boolean processTransaction(String transactionId, long timestampMillis) {
        // TODO: Implement idempotency window check
        Long previousTime = processedTransactions.get(transactionId);
        if (previousTime != null && (timestampMillis - previousTime) < windowMillis) {
            return false; // Duplicate rejected!
        }
        processedTransactions.put(transactionId, timestampMillis);
        return true; // Successfully processed
    }

    public static void main(String[] args) {
        PaymentDeduplicator dedup = new PaymentDeduplicator(5000);
        System.out.println("Tx 1 first try: " + dedup.processTransaction("TX_1001", 1000)); // true
        System.out.println("Tx 1 retry after 2s: " + dedup.processTransaction("TX_1001", 3000)); // false (Duplicate)
        System.out.println("Tx 2 first try: " + dedup.processTransaction("TX_1002", 3500)); // true
        System.out.println("Tx 1 after 6s: " + dedup.processTransaction("TX_1001", 7500)); // true (Window expired)
    }
}`,
        python: `import time
from typing import Dict

class PaymentDeduplicator:
    def __init__(self, window_seconds: float = 5.0):
        self.window = window_seconds
        self.seen_tx: Dict[str, float] = {}

    def process_transaction(self, tx_id: str, timestamp: float) -> bool:
        """Returns True if transaction is processed, False if duplicate inside window."""
        if tx_id in self.seen_tx:
            last_seen = self.seen_tx[tx_id]
            if (timestamp - last_seen) < self.window:
                return False # Duplicate detected!
        
        self.seen_tx[tx_id] = timestamp
        return True

# Validation test
if __name__ == "__main__":
    dedup = PaymentDeduplicator(window_seconds=5.0)
    print("TX 1 first try:", dedup.process_transaction("TX_1001", 10.0)) # True
    print("TX 1 retry at 12s:", dedup.process_transaction("TX_1001", 12.0)) # False
    print("TX 2 first try at 13s:", dedup.process_transaction("TX_1002", 13.0)) # True
    print("TX 1 retry after window at 16s:", dedup.process_transaction("TX_1001", 16.0)) # True
`
      },
      testCases: [
        { input: 'processTransaction("TX_1", 1000)', expected: 'true' },
        { input: 'processTransaction("TX_1", 2000)', expected: 'false' },
        { input: 'processTransaction("TX_2", 2500)', expected: 'true' }
      ]
    },
    {
      id: 'code-2',
      title: 'LRU Cache with O(1) Get and Put',
      difficulty: 'Hard',
      track: 'both',
      problemStatement: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache, identical to how Redis manages memory eviction for user sessions and API caches.',
      starterCode: {
        java: `import java.util.*;

public class LRUCache {
    private final int capacity;
    private final LinkedHashMap<Integer, Integer> map;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        // Access-order LinkedHashMap automatically maintains LRU order
        this.map = new LinkedHashMap<Integer, Integer>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > capacity;
            }
        };
    }

    public synchronized int get(int key) {
        return map.getOrDefault(key, -1);
    }

    public synchronized void put(int key, int value) {
        map.put(key, value);
    }

    public static void main(String[] args) {
        LRUCache cache = new LRUCache(2);
        cache.put(1, 100);
        cache.put(2, 200);
        System.out.println("Get key 1: " + cache.get(1)); // 100 (1 is now MRU)
        cache.put(3, 300); // Evicts key 2!
        System.out.println("Get key 2 (should be -1): " + cache.get(2)); // -1
        System.out.println("Get key 3: " + cache.get(3)); // 300
    }
}`,
        python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        # Move accessed key to the end (Most Recently Used)
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            # Pop the first item (Least Recently Used)
            self.cache.popitem(last=False)

if __name__ == "__main__":
    cache = LRUCache(2)
    cache.put(1, 100)
    cache.put(2, 200)
    print("Get key 1:", cache.get(1)) # 100
    cache.put(3, 300) # Evicts key 2
    print("Get key 2 (evicted):", cache.get(2)) # -1
    print("Get key 3:", cache.get(3)) # 300
`
      },
      testCases: [
        { input: 'put(1, 10); put(2, 20); get(1); put(3, 30); get(2);', expected: '-1' }
      ]
    }
  ]
};
