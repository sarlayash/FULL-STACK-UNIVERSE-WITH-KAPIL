export const INDUSTRY_MVPS = [
  {
    id: 'shopsphere',
    title: 'ShopSphere — Enterprise E-Commerce Platform',
    domain: 'E-commerce & Retail Tech',
    badge: 'Flagship MVP 1',
    level: 'Beginner → Advanced',
    shortDesc: 'Product catalogs, real-time inventory locking, shopping carts, order state machine, payment sandbox, and admin inventory dashboards.',
    techStack: {
      java: ['Java 21', 'Spring Boot 3.3', 'Spring Data JPA', 'Redis', 'PostgreSQL', 'React 19', 'TailwindCSS'],
      python: ['Python 3.12', 'FastAPI', 'SQLAlchemy 2.0', 'Redis', 'PostgreSQL', 'React 19', 'TailwindCSS']
    },
    architecture: {
      pattern: 'Event-Driven Microservices / Modular Monolith',
      components: [
        'React 19 SPA with optimistic UI cart management',
        'Spring Boot / FastAPI API Gateway with Rate Limiting (Bucket4j / SlowAPI)',
        'Inventory Service with Redis Distributed Locks (Redlock) for flash sales',
        'Order Orchestration Service using Saga Pattern for rollback',
        'Payment Sandbox integration (Simulated UPI & Card 3D-Secure Webhooks)',
        'PostgreSQL with Partitioned Order Tables and B-Tree Indexes'
      ]
    },
    databaseSchema: [
      { table: 'products', columns: ['id (UUID, PK)', 'sku (VARCHAR, UNIQUE)', 'title (VARCHAR)', 'price (NUMERIC(10,2))', 'stock_qty (INT)', 'category_id (FK)', 'created_at (TIMESTAMP)'] },
      { table: 'orders', columns: ['id (UUID, PK)', 'user_id (UUID, FK)', 'status (ENUM: PENDING, PAID, SHIPPED, CANCELLED)', 'total_amount (NUMERIC(10,2))', 'payment_id (VARCHAR)', 'created_at (TIMESTAMP)'] },
      { table: 'order_items', columns: ['id (UUID, PK)', 'order_id (UUID, FK)', 'product_id (UUID, FK)', 'quantity (INT)', 'unit_price (NUMERIC(10,2))'] },
      { table: 'inventory_locks', columns: ['sku (VARCHAR, PK)', 'reserved_qty (INT)', 'expires_at (TIMESTAMP)'] }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/products', desc: 'Paginated product list with search and category filters' },
      { method: 'POST', path: '/api/v1/cart/items', desc: 'Add item to Redis-backed user session cart' },
      { method: 'POST', path: '/api/v1/orders/checkout', desc: 'Create pending order and acquire 10-minute inventory lock' },
      { method: 'POST', path: '/api/v1/payments/verify-webhook', desc: 'Idempotent webhook confirming payment signature' },
      { method: 'GET', path: '/api/v1/admin/inventory/low-stock', desc: 'Admin endpoint querying stock levels <= threshold' }
    ],
    sampleProducts: [
      { id: 'prod-1', name: 'AeroBuds Pro Noise Canceling', category: 'Electronics', price: 129.99, rating: 4.8, stock: 45, icon: 'Headphones' },
      { id: 'prod-2', name: 'QuantumBook L14 Ultrabook', category: 'Electronics', price: 949.00, rating: 4.9, stock: 12, icon: 'Laptop' },
      { id: 'prod-3', name: 'NovaSmart Fitness Watch', category: 'Electronics', price: 199.50, rating: 4.7, stock: 28, icon: 'Watch' },
      { id: 'prod-4', name: 'Modern Velvet Armchair', category: 'Home Decor', price: 349.00, rating: 4.8, stock: 8, icon: 'Armchair' }
    ]
  },
  {
    id: 'fincore',
    title: 'FinCore — Core Banking & Ledger Engine',
    domain: 'FinTech & Banking Infrastructure',
    badge: 'Mission-Critical MVP 2',
    level: 'Intermediate',
    shortDesc: 'Double-entry transaction ledgers, mock bank accounts, role-based access, financial auditing, and simulated money transfers.',
    techStack: {
      java: ['Java 21', 'Spring Boot', 'Spring Security', 'Flyway', 'PostgreSQL (ACID Serializable)', 'React 19'],
      python: ['Python 3.12', 'FastAPI', 'AsyncPG', 'Pydantic V2', 'PostgreSQL (Strict Constraints)', 'React 19']
    },
    architecture: {
      pattern: 'Double-Entry Immutable Accounting Ledger (Martin Fowler Pattern)',
      components: [
        'Strict ACID compliance: Serializable isolation levels preventing race-condition double spending',
        'Append-Only Journal Entries: No row in the ledger is ever updated or deleted; errors require reversing entries',
        'Cryptographic audit trail: SHA-256 hash chaining each ledger batch to prevent insider tampering',
        'Role-Based Authorization: Teller (Max ₹50,000) vs Officer (Approval required) vs Auditor (Read-only)'
      ]
    },
    databaseSchema: [
      { table: 'accounts', columns: ['id (UUID, PK)', 'account_number (VARCHAR, UNIQUE)', 'holder_id (UUID)', 'type (SAVINGS, CURRENT)', 'status (ACTIVE, FROZEN)', 'currency (CHAR(3))'] },
      { table: 'ledger_entries', columns: ['id (UUID, PK)', 'transaction_id (UUID)', 'account_id (UUID, FK)', 'entry_type (DEBIT, CREDIT)', 'amount (NUMERIC(14,2))', 'balance_after (NUMERIC(14,2))', 'created_at (TIMESTAMP)'] },
      { table: 'transactions', columns: ['id (UUID, PK)', 'reference_no (VARCHAR, UNIQUE)', 'source_acc (UUID)', 'dest_acc (UUID)', 'amount (NUMERIC(14,2))', 'status (COMPLETED, FAILED)', 'narration (TEXT)'] }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/accounts/me', desc: 'Get logged in customer balances and tier limit' },
      { method: 'POST', path: '/api/v1/transfers/p2p', desc: 'Execute atomic debit-credit transaction pair within single DB lock' },
      { method: 'GET', path: '/api/v1/ledger/statement', desc: 'Paginated financial statement with balance reconciliation' },
      { method: 'POST', path: '/api/v1/admin/accounts/{id}/freeze', desc: 'Compliance freeze on suspect AML activity' }
    ],
    sampleAccounts: [
      { id: 'acc-101', name: 'Alex Sharma (Demo Student)', accNo: 'IN4592001928', type: 'Savings Account', balance: 28389.98, status: 'ACTIVE' },
      { id: 'acc-102', name: 'Campus Cafeteria Vendors', accNo: 'IN9982716254', type: 'Merchant Current', balance: 145200.50, status: 'ACTIVE' },
      { id: 'acc-103', name: 'Kapil FullStack Universe Treasury', accNo: 'IN1002003004', type: 'Escrow Reserve', balance: 500000.00, status: 'ACTIVE' }
    ]
  },
  {
    id: 'mediflow',
    title: 'MediFlow — Clinical Operations & Telehealth Suite',
    domain: 'Healthcare & HealthTech',
    badge: 'High-Impact MVP 3',
    level: 'Intermediate',
    shortDesc: 'Patient appointment booking, doctor schedules, OPD queue management, synthetic Electronic Health Records (EHR), and clinic administration.',
    techStack: {
      java: ['Java 21', 'Spring Boot 3.3', 'Hibernate Envers', 'PostgreSQL', 'WebSocket for OPD Queue', 'React 19'],
      python: ['Python 3.12', 'FastAPI', 'WebSockets', 'SQLModel', 'PostgreSQL', 'React 19']
    },
    architecture: {
      pattern: 'HIPAA/DISHA-Compliant Clinical Architecture',
      components: [
        'Time-slot booking with optimistic concurrency locking preventing double-booked doctors',
        'Live OPD Token Queue powered by WebSockets broadcasting doctor room readiness',
        'Synthetic Electronic Health Records (EHR) with field-level encryption for diagnostic history',
        'Role-Based Clinic Portals: Receptionist (Token issue) vs Doctor (Consultation & Rx) vs Patient (View records)'
      ]
    },
    databaseSchema: [
      { table: 'doctors', columns: ['id (UUID, PK)', 'full_name (VARCHAR)', 'specialty (VARCHAR)', 'consultation_fee (NUMERIC)', 'room_no (VARCHAR)'] },
      { table: 'patients', columns: ['id (UUID, PK)', 'uhid (VARCHAR, UNIQUE)', 'full_name (VARCHAR)', 'age (INT)', 'blood_group (VARCHAR)', 'phone (VARCHAR)'] },
      { table: 'appointments', columns: ['id (UUID, PK)', 'doctor_id (UUID, FK)', 'patient_id (UUID, FK)', 'slot_time (TIMESTAMP)', 'token_no (INT)', 'status (SCHEDULED, IN_CONSULTATION, COMPLETED)'] },
      { table: 'prescriptions', columns: ['id (UUID, PK)', 'appointment_id (UUID, FK)', 'diagnosis (TEXT)', 'medicines (JSONB)', 'notes (TEXT)'] }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/doctors/{id}/available-slots', desc: 'Returns non-conflicting 15-minute appointment slots' },
      { method: 'POST', path: '/api/v1/appointments/book', desc: 'Books consultation and generates OPD queue token' },
      { method: 'GET', path: '/api/v1/opd/queue/live', desc: 'Real-time WebSocket stream for clinic waiting room monitor' },
      { method: 'POST', path: '/api/v1/prescriptions', desc: 'Save digital prescription with synthetic clinical observations' }
    ],
    sampleDoctors: [
      { id: 'doc-1', name: 'Dr. Aditi Mukherjee, MD', spec: 'Cardiology', room: 'Cabin 104', fee: 800, nextSlot: '10:30 AM' },
      { id: 'doc-2', name: 'Dr. Rajesh Verma, MS', spec: 'Orthopedics', room: 'Cabin 202', fee: 650, nextSlot: '11:15 AM' },
      { id: 'doc-3', name: 'Dr. Sarah Mathews, MD', spec: 'Pediatrics & General', room: 'Cabin 108', fee: 500, nextSlot: '10:45 AM' }
    ]
  },
  {
    id: 'campusos',
    title: 'CampusOS — Next-Gen Academic LMS & Learning ERP',
    domain: 'EdTech & University Operations',
    badge: 'Holistic MVP 4',
    level: 'Beginner → Advanced',
    shortDesc: 'Course enrollment, assignment submissions, automated code testing, attendance records, quizzes, and learner progress dashboards.',
    techStack: {
      java: ['Java 21', 'Spring Boot', 'Spring Batch', 'PostgreSQL', 'Dockerized Code Runner', 'React 19'],
      python: ['Python 3.12', 'Django', 'Celery', 'Redis', 'PostgreSQL', 'React 19']
    },
    architecture: {
      pattern: 'Modular Multi-Tenant Educational Platform',
      components: [
        'Curriculum delivery module with markdown notes, code embeds, and progress tracking',
        'Assignment submission pipeline with automated test suite grading in isolated worker containers',
        'Attendance tracking system calculating eligibility thresholds (>75% mandatory criterion)',
        'Student Gradebook & Analytics generating GPA and cohort percentile distributions'
      ]
    },
    databaseSchema: [
      { table: 'courses', columns: ['id (UUID, PK)', 'code (VARCHAR, e.g. CS301)', 'title (VARCHAR)', 'credits (INT)', 'instructor_id (UUID, FK)'] },
      { table: 'enrollments', columns: ['id (UUID, PK)', 'student_id (UUID, FK)', 'course_id (UUID, FK)', 'semester (VARCHAR)', 'status (ACTIVE, COMPLETED)'] },
      { table: 'assignments', columns: ['id (UUID, PK)', 'course_id (UUID, FK)', 'title (VARCHAR)', 'due_date (TIMESTAMP)', 'max_points (INT)'] },
      { table: 'submissions', columns: ['id (UUID, PK)', 'assignment_id (UUID, FK)', 'student_id (UUID, FK)', 'code_content (TEXT)', 'score (INT)', 'auto_feedback (TEXT)'] }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/student/enrolled-courses', desc: 'Returns all enrolled courses with completion percentages' },
      { method: 'POST', path: '/api/v1/assignments/submit', desc: 'Uploads student solution and enqueues automated test execution' },
      { method: 'GET', path: '/api/v1/attendance/summary', desc: 'Calculates live attendance percentage and shortfall alert' },
      { method: 'GET', path: '/api/v1/grades/transcript', desc: 'Generates official academic transcript record' }
    ],
    sampleCourses: [
      { id: 'c-1', code: 'CS401', name: 'Distributed Systems & Microservices in Java', instructor: 'Prof. Kapil', progress: 78, attendance: 92 },
      { id: 'c-2', code: 'CS402', name: 'High-Concurrency Backends with Python FastAPI', instructor: 'Prof. Kapil', progress: 64, attendance: 88 },
      { id: 'c-3', code: 'CS403', name: 'Database Architecture & Query Optimization', instructor: 'Prof. Kapil', progress: 85, attendance: 96 }
    ]
  }
];
