export const CAREER_DATA = {
  placementChecklist: [
    { id: 'p1', title: 'Data Structures & Algorithmic Rigor', target: 'Top 75 LeetCode/GFG patterns (Arrays, Hashes, Trees, Graphs, DP)', status: 'COMPLETED', progress: 100 },
    { id: 'p2', title: 'Backend Framework Mastery', target: 'Spring Boot 3 REST / FastAPI Async with JWT and ORM profiling', status: 'IN_PROGRESS', progress: 85 },
    { id: 'p3', title: 'Database Optimization', target: 'B-Tree indexes, composite keys, EXPLAIN ANALYZE, transaction isolation', status: 'IN_PROGRESS', progress: 75 },
    { id: 'p4', title: 'Industry Domain Capstones', target: 'Complete ShopSphere & FinCore with GitHub CI/CD Actions', status: 'IN_PROGRESS', progress: 60 },
    { id: 'p5', title: 'System Design Fundamentals', target: 'Rate limiter, Caching (Redis), Load Balancers, CAP theorem, WebSockets', status: 'PENDING', progress: 40 },
    { id: 'p6', title: 'Mock Interviews & Behavioral STAR', target: 'Cleared 3 Technical Mocks + 1 HR Behavioral review', status: 'PENDING', progress: 30 }
  ],
  companyBlueprints: [
    {
      company: 'TCS Digital / Ninja / Prime',
      package: '₹7.0 - 11.5 LPA',
      pattern: 'Advanced Coding (Strings, Matrix, Dynamic Programming) + Java/Python OOP internals + SQL complex joins + DBMS ACID questions',
      tip: 'Do not just give the brute-force answer. Explain space complexity O(1) vs O(N) upfront. For SQL, expect GROUP BY with HAVING and window functions (DENSE_RANK).'
    },
    {
      company: 'Amazon SDE-1 / Product Giants',
      package: '₹28.0 - 45.0 LPA',
      pattern: '2 DSA Rounds (Trees, Graphs, DP, PriorityQueue) + 1 Low-Level Design (LLD) Round + Leadership Principles (STAR format)',
      tip: 'In the LLD round, write clean modular classes with SOLID principles. When designing Parking Lot or E-Commerce Cart, write thread-safe singletons and proper strategy patterns.'
    },
    {
      company: 'FinTech High-Growth Startups (PhonePe, Razorpay, CRED)',
      package: '₹18.0 - 32.0 LPA',
      pattern: 'Machine Coding round (2.5 hours to code working In-Memory Cache or Splitwise) + System Design + Concurrency & Locking',
      tip: 'Focus heavily on race conditions! Show how you use optimistic locking (`@Version`), Redis distributed locks, and double-entry bookkeeping ledgers.'
    }
  ],
  starMethodTemplates: [
    {
      question: 'Tell me about a complex technical bug you encountered and how you solved it.',
      situation: 'In our college capstone project (ShopSphere E-Commerce), during load testing with 200 concurrent simulated users, checkout requests were failing with 500 Internal Server Errors.',
      task: 'I was assigned to identify the root cause, eliminate the server crashes, and ensure stock quantities never dropped into negative numbers during flash sales.',
      action: 'I inspected server logs and identified a classic Race Condition: multiple threads were executing `SELECT stock` and `UPDATE stock` simultaneously without row locking. I introduced Redis Distributed Locks (Redlock pattern) with a 5-second automatic TTL to serialize inventory updates per product SKU, and added database optimistic locking using `@Version`.',
      result: 'The error rate dropped to 0%, checkout latency decreased by 34%, and our load test successfully handled 1,500 requests per second without a single phantom inventory mismatch.'
    },
    {
      question: 'Describe a situation where you had to learn a completely new technology quickly.',
      situation: 'Our hackathon team decided to build a real-time medical queue system (MediFlow), but none of us had worked with WebSockets or Docker containerization before.',
      task: 'I had 48 hours to research WebSocket protocols, implement the bidirectional connection in Spring Boot/FastAPI, and containerize the whole backend for AWS deployment.',
      action: 'I isolated the learning into high-priority hands-on sprints: First built a simple ping-pong socket script, then integrated STOMP over SockJS with JWT handshake authentication, and wrote a multi-stage Dockerfile minimizing image size to 180MB.',
      result: 'We successfully delivered the real-time OPD token board live on stage to the judges, winning 1st place in the campus innovation track.'
    }
  ],
  faqs: [
    {
      q: 'Should I choose Java Full Stack or Python Full Stack for 2026/2027 campus placements?',
      a: 'Both are tier-1 choices! Choose Java Full Stack if your primary target is enterprise banking, fintech (PhonePe, Morgan Stanley, JPMorgan, TCS Digital, Infosys Prime) where Spring Boot and Java 21 dominate. Choose Python Full Stack if you love fast prototyping, high-concurrency microservices, AI/ML integration, or modern startup engineering (FastAPI, Django, LangChain, PyTorch).'
    },
    {
      q: 'How many projects should I have on my resume?',
      a: 'Exactly 2 or 3 high-quality, fully deployed full-stack projects beats 10 tutorial clones. Having ShopSphere (E-commerce with payment webhooks) and FinCore (Double-entry banking ledger) with a live GitHub link and deployed URL immediately sets you apart from 99% of candidates.'
    },
    {
      q: 'Do interviewers check GitHub code quality?',
      a: 'Yes! Senior engineers look for: clean commit history, README with architecture diagrams and API docs, test coverage, `.gitignore`, Dockerfile, and clear modular package structure.'
    }
  ]
};
