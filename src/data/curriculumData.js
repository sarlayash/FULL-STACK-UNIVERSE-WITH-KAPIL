export const TRACKS_DATA = {
  java: {
    id: 'java',
    title: 'Java Full Stack Universe',
    tagline: 'Enterprise-grade Scalability: Java 21, Spring Boot 3.3, React 19, PostgreSQL & Microservices',
    stats: {
      modules: 8,
      lessons: 48,
      projects: 8,
      practiceProblems: 120,
      placementReadinessRate: '94.6%'
    },
    modules: [
      {
        id: 'java-oop-inheritance',
        title: 'Core Java: OOP & Inheritance Deep Dive',
        level: 'Beginner to Intermediate',
        duration: '3 hours hands-on',
        theoryPercent: 10,
        handsOnPercent: 90,
        studentAnalogy: {
          title: 'The Family Bike & Custom Tuned Engine Analogy',
          concept: 'Inheritance & Method Overriding',
          story: 'Imagine your father gives you his classic Royal Enfield (Parent Class). You automatically inherit its engine chassis, wheels, and headlight without having to rebuild them from scratch (Code Reusability). However, the original horn sound is too quiet for college traffic. You replace just the horn mechanism with your own custom horn (`@Override public void blowHorn()`). When you press the horn, your custom sound plays, but the fuel tank and steering remain exactly what your father gave you. If your father marked the engine block as `final`, you are legally forbidden from modifying it!'
        },
        industryUseCase: {
          company: 'HDFC / PhonePe FinTech Architecture',
          scenario: 'Payment Gateway Account Hierarchy',
          explanation: 'At PhonePe, `BankAccount` is an abstract base class holding account number, IFSC code, and base debit logic. Specific implementations like `SavingsAccount`, `CurrentAccount`, and `OverdraftAccount` inherit common verification logic but override `calculateOverdraftInterest()` and `enforceDailyTransferLimit()` according to RBI regulatory specifications.'
        },
        codeSnippet: {
          language: 'java',
          filename: 'AccountHierarchyDemo.java',
          code: `// Base Parent Class with Encapsulated Fields
public abstract class BankAccount {
    private final String accountNumber;
    private final String holderName;
    protected double balance;

    public BankAccount(String accountNumber, String holderName, double initialDeposit) {
        if (initialDeposit < 0) {
            throw new IllegalArgumentException("Initial balance cannot be negative");
        }
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.balance = initialDeposit;
    }

    public synchronized void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Amount must be positive");
        this.balance += amount;
        System.out.printf("[Audit] Deposit ₹%.2f. New Balance: ₹%.2f%n", amount, balance);
    }

    // Abstract method: Every child MUST provide its own overdraft/withdrawal logic
    public abstract boolean withdraw(double amount);

    public double getBalance() {
        return this.balance;
    }
}

// Child Class overriding withdraw for Overdraft Account
public class CurrentAccount extends BankAccount {
    private final double overdraftLimit;

    public CurrentAccount(String accNo, String name, double balance, double overdraftLimit) {
        super(accNo, name, balance); // Reusing parent constructor
        this.overdraftLimit = overdraftLimit;
    }

    @Override
    public synchronized boolean withdraw(double amount) {
        if (amount <= (balance + overdraftLimit)) {
            balance -= amount;
            System.out.printf("[CurrentAccount] Withdrew ₹%.2f. Current balance: ₹%.2f%n", amount, balance);
            return true;
        }
        System.err.println("[Declined] Transaction exceeds combined balance and overdraft facility!");
        return false;
    }
}`
        },
        solvedExample: {
          question: 'How do you prevent a subclass from breaking invariants while overriding methods in Java?',
          solution: '1. Mark core validation methods as `final` in the superclass (Template Method Pattern).\n2. Expose protected hook methods like `beforeTransfer()` or `afterTransfer()` for subclasses to customize.\n3. Always call `super.method()` if state reconciliation is maintained in the parent class.\n4. Apply `@Override` annotation strictly so the compiler detects signature mismatches immediately.'
        },
        interviewQuestions: [
          {
            q: 'Why does Java not support multiple inheritance with classes, but allows it with interfaces?',
            a: 'To avoid the "Diamond Problem" where two parent classes define the same method with different implementations, creating ambiguity for the JVM. Interfaces traditionally had only abstract method signatures without state (fields), removing state-conflict ambiguity.'
          },
          {
            q: 'What is the exact difference between Method Overloading (Compile-time) and Method Overriding (Runtime)?',
            a: 'Overloading happens within the same class with identical name but different parameters (resolved statically by the compiler). Overriding happens between parent-child with identical signatures where the JVM uses virtual method invocation (`invokevirtual`) at runtime based on the actual object on the heap.'
          }
        ],
        practiceChallenge: {
          title: 'Implement an Immutable Student Transcript Record',
          objective: 'Create a class `StudentRecord` using modern Java record or final immutable pattern, ensuring internal List cannot be mutated from outside.'
        }
      },
      {
        id: 'spring-boot-di-rest',
        title: 'Spring Boot 3: Dependency Injection & Clean REST APIs',
        level: 'Intermediate',
        duration: '4 hours hands-on',
        theoryPercent: 10,
        handsOnPercent: 90,
        studentAnalogy: {
          title: 'The College Hostel Mess vs Cooking in Room Analogy',
          concept: 'Inversion of Control (IoC) & Dependency Injection',
          story: 'If every student in a hostel had to buy their own gas stove, raw vegetables, spices, and utensils just to eat lunch (`OrderService service = new OrderService(new DatabaseConnection(), new EmailSender(), new PaymentGateway())`), the entire hostel room would collapse in clutter and duplicate maintenance. Instead, the college administration provides a centralized Mess / Dining Hall (Spring IoC Container). The master chef prepares meals and delivers ready-to-eat plates to your table when you arrive (`@Autowired OrderService`). You focus on eating and studying (business logic), while the mess manager manages the cooking gear lifecycle.'
        },
        industryUseCase: {
          company: 'Swiggy / Zomato Real-time Dispatch System',
          scenario: 'Decoupling Payment and Notification Gateways',
          explanation: 'When an order is placed, `OrderProcessingService` does not hardcode SMS or WhatsApp. It injects a `NotificationService` interface. During testing, Spring injects `MockNotificationService`. In production, Spring injects `AwsSnsNotificationService` without changing a single line of business code.'
        },
        codeSnippet: {
          language: 'java',
          filename: 'OrderController.java',
          code: `@RestController
@RequestMapping("/api/v1/orders")
@Validated
public class OrderController {

    private final OrderService orderService;

    // Constructor Injection (Best Practice: enables immutability & easy testing)
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse response = orderService.processOrder(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.getOrderId())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.findOrderById(id));
    }
}`
        },
        solvedExample: {
          question: 'Why is Constructor Injection preferred over Field Injection (@Autowired on private field)?',
          solution: '1. Immutability: Dependencies can be declared `final`, ensuring thread-safety.\n2. No hidden dependencies: All prerequisites are explicit in the constructor.\n3. Unit Testing: Easy to instantiate the class with mock objects without launching the Spring Context.\n4. Avoids NullPointerExceptions during manual class instantiation.'
        },
        interviewQuestions: [
          {
            q: 'Explain the internal lifecycle of a Spring Bean from definition to destruction.',
            a: '1. Bean Definition loading -> 2. Instantiation (Reflection) -> 3. Populate Properties (DI) -> 4. BeanNameAware / ApplicationContextAware -> 5. BeanPostProcessor beforeInitialization -> 6. @PostConstruct / InitializingBean -> 7. BeanPostProcessor afterInitialization -> 8. Ready for usage -> 9. @PreDestroy / DisposableBean on shutdown.'
          },
          {
            q: 'What does @Transactional do under the hood in Spring Boot?',
            a: 'Spring creates a CGLIB or JDK Dynamic Proxy around the bean. When the method is invoked, the proxy starts a JDBC transaction, opens a connection, executes your code, and commits if no unchecked exception (RuntimeException) occurs. If an unhandled RuntimeException is thrown, it executes a rollback.'
          }
        ],
        practiceChallenge: {
          title: 'Implement an Idempotent Payment Webhook',
          objective: 'Build a Spring Boot controller endpoint that handles payment status callbacks, deduplicating incoming events using an idempotency key stored in Redis/DB.'
        }
      },
      {
        id: 'spring-data-jpa-tuning',
        title: 'Spring Data JPA: High-Performance Data Access & N+1 Fixes',
        level: 'Advanced',
        duration: '4 hours hands-on',
        theoryPercent: 10,
        handsOnPercent: 90,
        studentAnalogy: {
          title: 'The College Library Register vs Card Scanner Analogy',
          concept: 'Database Indexing & N+1 Query Problem',
          story: 'Imagine a teacher wants to inspect all 60 students in a class and list each student\'s issued library books. If the teacher calls each student one-by-one to the desk and makes 60 separate phone calls to the library counter for each child (`1 query for students + 60 queries for books = 61 round-trips!`), the whole day is wasted. That is the dreaded N+1 query problem! Instead, the teacher submits one single list of student IDs to the library counter, and the librarian hands over all records in one batch (`JOIN FETCH` or `@EntityGraph`).'
        },
        industryUseCase: {
          company: 'Blinkit / Zepto Instant Delivery Catalog',
          scenario: 'Fetching 1,000 product categories with live discounts without crashing the DB',
          explanation: 'Without `@Query("SELECT c FROM Category c JOIN FETCH c.products")`, rendering a mobile home screen caused 1,200 database queries in 800ms. Applying `JOIN FETCH` and DTO projection reduced DB calls to 1 single query executing in 14ms.'
        },
        codeSnippet: {
          language: 'java',
          filename: 'ProductRepository.java',
          code: `public interface ProductRepository extends JpaRepository<Product, Long> {

    // Resolves N+1 problem: Fetches product, category and reviews in a single SQL JOIN
    @Query("SELECT DISTINCT p FROM Product p " +
           "JOIN FETCH p.category " +
           "LEFT JOIN FETCH p.reviews " +
           "WHERE p.active = true AND p.stockQuantity > 0")
    List<Product> findAllActiveWithDetails();

    // DTO Projection: Only selects required columns, saving massive heap memory
    @Query("SELECT new com.kapil.universe.dto.ProductSummaryDTO(p.id, p.title, p.price, p.category.name) " +
           "FROM Product p WHERE p.category.id = :categoryId")
    Page<ProductSummaryDTO> findSummariesByCategory(@Param("categoryId") Long categoryId, Pageable pageable);
}`
        },
        solvedExample: {
          question: 'How do you detect and permanently prevent N+1 queries in Spring Boot?',
          solution: '1. Enable SQL logging: `spring.jpa.properties.hibernate.generate_statistics=true`.\n2. Use `@EntityGraph(attributePaths = {"category", "brand"})` on repository methods.\n3. Use DTO projections instead of entities when read-only reporting.\n4. Write integration tests using QuickPerf or hypersistence-utils to assert query count <= 1.'
        },
        interviewQuestions: [
          {
            q: 'What is the difference between Lazy and Eager fetching in JPA?',
            a: 'Lazy creates a dynamic bytecode proxy (HibernateProxy) and delays SQL execution until the collection or relation is explicitly accessed. Eager immediately issues joins or additional select queries upon loading the parent entity.'
          }
        ],
        practiceChallenge: {
          title: 'Write a Batch Updating Repository',
          objective: 'Configure Hibernate JDBC batch sizing (`spring.jpa.properties.hibernate.jdbc.batch_size=50`) and insert 10,000 transaction records efficiently.'
        }
      },
      {
        id: 'spring-security-jwt',
        title: 'Spring Security 6: Stateless JWT & Role-Based Access Control',
        level: 'Advanced',
        duration: '5 hours hands-on',
        theoryPercent: 10,
        handsOnPercent: 90,
        studentAnalogy: {
          title: 'The College Gate Security Hologram Pass Analogy',
          concept: 'Stateless JWT Authentication',
          story: 'In an old session-based system, the security guard at the college gate has a massive paper register. Every time you enter, the guard has to stop you, walk into the administrative office, look up your name in a dusty filing cabinet, and verify your ID (Session stored in server memory). If 10,000 students show up at 8:50 AM, the server crashes! With JWT, the college signs your plastic ID badge with a tamper-proof cryptographic hologram (Digital Signature). The security guard at the gate just shines an ultraviolet light (Public/Secret verification key) on your badge. Without asking anyone or checking a database, the guard instantly knows your name, roll number, and whether you are allowed into the Admin building!'
        },
        industryUseCase: {
          company: 'Razorpay / Stripe Merchant Dashboard',
          scenario: 'Granular Role Permissions (OWNER, DEVELOPER, FINANCE_VIEWER)',
          explanation: 'JWT access tokens contain claims `{"roles": ["ROLE_DEVELOPER"], "merchant_id": "m_9831"}`. Spring Security filter chain validates the signature in under 1ms, enabling microservices to authorize API calls without querying the master authentication database.'
        },
        codeSnippet: {
          language: 'java',
          filename: 'SecurityConfig.java',
          code: `@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/actuator/health", "/swagger-ui/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}`
        },
        solvedExample: {
          question: 'How do you handle JWT revocation if tokens are stateless?',
          solution: '1. Short token lifetimes: Set Access Token TTL to 10-15 minutes and use Refresh Tokens.\n2. Distributed Blacklist in Redis: When a user logs out, store the JWT `jti` (unique token ID) in Redis with an expiration matching the token\'s remaining lifetime.\n3. Auth filter checks Redis only for suspect or logged-out tokens, preserving high throughput.'
        },
        interviewQuestions: [
          {
            q: 'Explain the difference between Authentication (401) and Authorization (403).',
            a: '401 Unauthorized means "Who are you? You have not proved your identity." 403 Forbidden means "I know who you are, but you do not have permission to access this resource."'
          }
        ],
        practiceChallenge: {
          title: 'Implement a Token Refresh Endpoint',
          objective: 'Build a secure Refresh Token rotation flow that invalidates compromised refresh tokens.'
        }
      }
    ]
  },
  python: {
    id: 'python',
    title: 'Python Full Stack Universe',
    tagline: 'Modern High-Velocity Web: Python 3.12, FastAPI, Django, React 19, PostgreSQL & Celery',
    stats: {
      modules: 8,
      lessons: 48,
      projects: 8,
      practiceProblems: 120,
      placementReadinessRate: '95.2%'
    },
    modules: [
      {
        id: 'python-oop-dunder',
        title: 'Python OOP: Magic Methods & Metaclasses in Production',
        level: 'Beginner to Intermediate',
        duration: '3 hours hands-on',
        theoryPercent: 10,
        handsOnPercent: 90,
        studentAnalogy: {
          title: 'The College Canteen Token Counter Analogy',
          concept: 'Dunder Methods & Operator Overloading (`__str__`, `__eq__`, `__add__`)',
          story: 'When you walk into a college canteen, you order a Samosa and a Chai. If Python tried to add them without rules, it would throw `TypeError: unsupported operand type(s) for +: Samosa and Chai`. But if the canteen manager defines a rule (`__add__`), then `Samosa + Chai` automatically returns a discounted `ComboMeal(items=["Samosa", "Chai"], price=25)`. Magic/Dunder methods are Python\'s way of teaching your custom objects how to behave naturally with standard operators!'
        },
        industryUseCase: {
          company: 'Zerodha / Upstox Order Execution Engine',
          scenario: 'Mathematical Precision in Portfolio Objects',
          explanation: 'In financial trading, rounding floats causes severe penny-leak bugs. Python Full Stack developers build custom `Money` classes with `__add__`, `__sub__`, and `__mul__` wrapping `decimal.Decimal`, ensuring currency arithmetic is mathematically exact across millions of transactions.'
        },
        codeSnippet: {
          language: 'python',
          filename: 'financial_models.py',
          code: `from decimal import Decimal
from typing import Self

class Money:
    """Immutable monetary representation ensuring zero float precision loss."""
    __slots__ = ('_amount', '_currency')

    def __init__(self, amount: str | float | Decimal, currency: str = "INR"):
        self._amount = Decimal(str(amount)).quantize(Decimal("0.01"))
        self._currency = currency.upper()

    @property
    def amount(self) -> Decimal:
        return self._amount

    @property
    def currency(self) -> str:
        return self._currency

    def __add__(self, other: Self) -> Self:
        if not isinstance(other, Money) or self._currency != other._currency:
            raise ValueError(f"Cannot add money across mismatched currencies: {self._currency} vs {getattr(other, '_currency', None)}")
        return Money(self._amount + other._amount, self._currency)

    def __repr__(self) -> str:
        return f"Money({self._amount}, '{self._currency}')"

    def __str__(self) -> str:
        return f"₹{self._amount:,.2f}" if self._currency == "INR" else f"{self._currency} {self._amount:,.2f}"

# Real-world usage
order_item_1 = Money("499.50")
order_item_2 = Money("1250.75")
total = order_item_1 + order_item_2
print(f"Checkout Total: {total}") # Outputs: Checkout Total: ₹1,750.25`
        },
        solvedExample: {
          question: 'What is the purpose of `__slots__` in Python classes?',
          solution: 'Normally, Python stores instance attributes in a dictionary (`__dict__`). By defining `__slots__`, Python reserves static space for only specified attributes in C-level struct memory, saving 40-60% RAM and accelerating attribute lookups when creating millions of instances.'
        },
        interviewQuestions: [
          {
            q: 'Explain Python\'s Global Interpreter Lock (GIL) and how Python 3.13+ addresses free-threaded execution.',
            a: 'The GIL is a mutex that prevents multiple native OS threads from executing Python bytecodes simultaneously to protect CPython\'s reference counting memory management. I/O-bound tasks release the GIL during network/disk waiting. CPU-bound concurrency is achieved via `multiprocessing` or the new PEP 703 free-threaded Python builds.'
          }
        ],
        practiceChallenge: {
          title: 'Build a Custom LRU Cache Decorator',
          objective: 'Write a Python decorator using dictionary and doubly-linked list logic that caches function returns with a maximum capacity.'
        }
      },
      {
        id: 'fastapi-async-pydantic',
        title: 'FastAPI & Pydantic V2: High-Throughput Asynchronous APIs',
        level: 'Intermediate to Advanced',
        duration: '4 hours hands-on',
        theoryPercent: 10,
        handsOnPercent: 90,
        studentAnalogy: {
          title: 'The Single-Window Ticket Booking vs Multiple Counter Analogy',
          concept: 'Synchronous vs Asynchronous I/O (`async` / `await`)',
          story: 'In an old synchronous ticket counter (Flask/traditional WSGI), the booking clerk asks for your train station, then stands up, walks to the back office, waits 3 minutes for the printer to print the ticket, walks back, and hands it to you. While the clerk is waiting for the printer, 50 people in line are completely blocked! In an asynchronous counter (FastAPI with `async/await`), the clerk submits the print job to the machine (`await printer.print()`), and while the paper prints, the clerk immediately attends to the next customer in line. The single clerk handles 1,000 customers per hour without sweating!'
        },
        industryUseCase: {
          company: 'Netflix / Uber Data Gateway',
          scenario: 'Aggregating microservice telemetry concurrently',
          explanation: 'FastAPI allows handling 25,000 concurrent WebSocket and HTTP requests using `asyncio.gather()` to fetch data from Redis, PostgreSQL, and external APIs simultaneously, reducing latency from 650ms to 45ms.'
        },
        codeSnippet: {
          language: 'python',
          filename: 'main.py',
          code: `from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, Field, EmailStr
from typing import Annotated
import asyncio

app = FastAPI(title="CampusOS API", version="2.0.0")

class StudentRegistration(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(..., example="Computer Science")
    gpa: float = Field(..., ge=0.0, le=10.0, description="Scale of 10.0")

class RegistrationResponse(BaseModel):
    student_id: str
    status: str
    allocated_hostel: str

async def allocate_hostel_slot(department: str) -> str:
    # Simulating async non-blocking external call
    await asyncio.sleep(0.05)
    return "Aryabhatta Hall of Residence - Block B"

@app.post("/api/v1/students/register", response_model=RegistrationResponse, status_code=status.HTTP_201_CREATED)
async def register_student(payload: StudentRegistration):
    hostel = await allocate_hostel_slot(payload.department)
    return RegistrationResponse(
        student_id="KAPIL-2026-9812",
        status="CONFIRMED",
        allocated_hostel=hostel
    )`
        },
        solvedExample: {
          question: 'When should you NOT use `async def` in FastAPI?',
          solution: 'Never use `async def` if you are executing blocking CPU-intensive calculations or calling synchronous third-party libraries (like `requests.get()` or blocking database drivers). That blocks the event loop! Use standard `def` instead; FastAPI will automatically run it inside an external threadpool (`anyio.to_thread`).'
        },
        interviewQuestions: [
          {
            q: 'How does Pydantic V2 achieve 5x-10x performance improvement over V1?',
            a: 'Pydantic V2 core was rewritten entirely in Rust (`pydantic-core`), handling data validation, serialization, and schema generation natively at compiled C/Rust speed rather than Python bytecode iteration.'
          }
        ],
        practiceChallenge: {
          title: 'Build a Streaming AI Response Endpoint',
          objective: 'Implement an asynchronous generator endpoint using `StreamingResponse` that streams chunked responses to a React client.'
        }
      },
      {
        id: 'django-orm-optimization',
        title: 'Django & PostgreSQL: Query Optimization & Zero-Downtime Migrations',
        level: 'Advanced',
        duration: '4 hours hands-on',
        theoryPercent: 10,
        handsOnPercent: 90,
        studentAnalogy: {
          title: 'The College Event Pass Delivery Analogy',
          concept: '`select_related` (SQL JOIN) vs `prefetch_related` (Separate IN queries)',
          story: 'If an event organizer needs to deliver festival passes to 100 students and needs their department name (ForeignKey = One-to-Many), they can bring the student and their department together in one car (`select_related` -> SQL JOIN). But if each student has 5 registered hobby clubs (ManyToManyField), stuffing all students and clubs into one car causes duplicate passenger chaos (cartesian product). Instead, the organizer sends one car for the students and one van for the clubs with a master list (`prefetch_related` -> Two clean queries combined in Python memory).'
        },
        industryUseCase: {
          company: 'Instagram / Pinterest Django Core',
          scenario: 'Feed generation without database lockups',
          explanation: 'Using `select_related(\'author\')` and `prefetch_related(\'tags\', \'comments\')` on Django QuerySets eliminates 500+ query cascades, keeping database CPU load under 20% during peak traffic spikes.'
        },
        codeSnippet: {
          language: 'python',
          filename: 'services.py',
          code: `from django.db.models import Prefetch, Count
from .models import Course, Enrollment, Assignment

def get_optimized_student_dashboard_courses(student_id: int):
    """
    Fetches courses with teacher and active assignments in exactly 2 optimized SQL queries.
    Never causes N+1 queries in templates or serializer serialization.
    """
    active_assignments_prefetch = Prefetch(
        'assignments',
        queryset=Assignment.objects.filter(is_published=True).order_by('due_date'),
        to_attr='published_assignments'
    )

    return Course.objects.filter(
        enrollments__student_id=student_id,
        enrollments__is_active=True
    ).select_related(
        'instructor', # 1-to-1 or Many-to-1: Single SQL INNER JOIN
        'department'
    ).prefetch_related(
        active_assignments_prefetch # Many-to-Many or Reverse 1-to-Many
    ).annotate(
        total_students=Count('enrollments')
    )`
        },
        solvedExample: {
          question: 'How do you perform a safe zero-downtime database migration in Django on a table with 10 million rows?',
          solution: '1. Never add non-nullable columns without defaults in one migration.\n2. Three-step migration pattern: Step A: Add nullable column -> Step B: Backfill existing rows via background celery worker -> Step C: Alter column to `null=False`.\n3. Add indexes concurrently using `AddIndexConcurrently` from `django.contrib.postgres.operations` to prevent table locking.'
        },
        interviewQuestions: [
          {
            q: 'Explain Django QuerySet evaluation laziness.',
            a: 'Creating a QuerySet (e.g., `qs = Student.objects.filter(active=True)`) does not touch the database. The database is only queried when the QuerySet is evaluated: iteration (`for s in qs`), slicing with step, pickling, `len()`, `list()`, or `bool()` checks.'
          }
        ],
        practiceChallenge: {
          title: 'Implement Custom Database Connection Pooling',
          objective: 'Configure PgBouncer with Django persistent connections (`CONN_MAX_AGE=600`) and test connection reuse.'
        }
      }
    ]
  }
};
