# Architecture and Design Documentation

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER DEVICE (Android)                       │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │              React Native Mobile Application               │ │
│  │                                                            │ │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │ │
│  │  │   Dashboard    │  │   Insights     │  │     Goals      │ │ │
│  │  │    Screen      │  │    Screen      │  │    Screen      │ │ │
│  │  └────────────────┘  └────────────────┘  └────────────────┘ │ │
│  │                                                            │ │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │ │
│  │  │   Settings     │  │     Auth       │  │    Onboarding  │ │ │
│  │  │    Screen      │  │   Screens      │  │    Screens     │ │ │
│  │  └────────────────┘  └────────────────┘  └────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │              Zustand State Management                │ │ │
│  │  │  (authStore, transactionStore, local caching)       │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │   SMS Detection Service                             │ │ │
│  │  │   (Reads payment SMS, parses transactions)          │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │               Axios HTTP Client                              │ │
│  │          (REST API Communication Layer)                      │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                    HTTPS REST API Calls
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     BACKEND SERVER (Cloud)                          │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │              Spring Boot REST API (Port 8080)                 │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │ │
│  │  │ Auth         │  │ Transaction  │  │ Dashboard        │   │ │
│  │  │ Controller   │  │ Controller   │  │ Controller       │   │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │ │
│  │                                                               │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │ │
│  │  │ Goal         │  │ Settings     │  │ SMS Parser       │   │ │
│  │  │ Controller   │  │ Controller   │  │ Service          │   │ │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │ │
│  │                                                               │ │
│  ├────────────────────────────────────────────────────────────────┤ │
│  │                    Business Logic Layer                       │ │
│  │                                                               │ │
│  │  ┌────────────────┐ ┌────────────────┐ ┌─────────────────┐  │ │
│  │  │ User Service   │ │ Transaction    │ │ Goal Service    │  │ │
│  │  │                │ │ Service        │ │                 │  │ │
│  │  └────────────────┘ └────────────────┘ └─────────────────┘  │ │
│  │                                                               │ │
│  │  ┌────────────────┐ ┌────────────────┐ ┌─────────────────┐  │ │
│  │  │ Dashboard      │ │ Category       │ │ Settings        │  │ │
│  │  │ Service        │ │ Service        │ │ Service         │  │ │
│  │  │ (Analytics)    │ │ (Merchant map) │ │                 │  │ │
│  │  └────────────────┘ └────────────────┘ └─────────────────┘  │ │
│  │                                                               │ │
│  ├────────────────────────────────────────────────────────────────┤ │
│  │           Security & Auth Layer                              │ │
│  │                                                               │ │
│  │  ┌────────────────┐ ┌────────────────────────────────────┐  │ │
│  │  │ JWT Token      │ │ Spring Security Configuration     │  │ │
│  │  │ Provider       │ │ CORS, Password Encryption         │  │ │
│  │  └────────────────┘ └────────────────────────────────────┘  │ │
│  │                                                               │ │
│  ├────────────────────────────────────────────────────────────────┤ │
│  │           Data Access Layer (Spring Data JPA)               │ │
│  │                                                               │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌────────────────────────┐ │ │
│  │  │ User        │ │ Transaction │ │ Goal & Settings      │ │ │
│  │  │ Repository  │ │ Repository  │ │ Repositories         │ │ │
│  │  └─────────────┘ └─────────────┘ └────────────────────────┘ │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                  Flyway Database Migrations                   │ │
│  │  (Schema versioning and evolution)                            │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                      │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
                    PostgreSQL Driver
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database Server                         │
│                                                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│  │ users        │ │ transactions │ │ goals        │ │ settings   │ │
│  │ table        │ │ table        │ │ table        │ │ table      │ │
│  │              │ │              │ │              │ │            │ │
│  │ - id         │ │ - id         │ │ - id         │ │ - id       │ │
│  │ - name       │ │ - user_id    │ │ - user_id    │ │ - user_id  │ │
│  │ - email      │ │ - amount     │ │ - title      │ │ - threshold│ │
│  │ - password   │ │ - merchant   │ │ - target_amt │ │ - auto_cat │ │
│  │ - budget     │ │ - category   │ │ - saved_amt  │ │ - notif    │ │
│  │ - timestamps │ │ - upi_app    │ │ - deadline   │ │ - dark_mode│ │
│  │              │ │ - timestamp  │ │ - timestamps │ │ - timestamps
│  │              │ │ - confirmed  │ │              │ │            │ │
│  │              │ │ - timestamps │ │              │ │            │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │
│                                                                      │
│  Indexes:                                                            │
│  - user_id on transactions, goals, settings                         │
│  - timestamp on transactions (for range queries)                    │
│  - category on transactions (for filtering)                         │
│  - email on users (for login)                                       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

### User Registration & Authentication Flow
```
1. User enters credentials → SignupScreen
2. Client sends POST /api/auth/signup
3. Backend: UserService.registerUser()
   - Hash password (BCrypt)
   - Save user to database
   - Create default Settings
   - Generate JWT token
4. Token stored in AsyncStorage
5. User navigated to MainApp
```

### Transaction Detection & Processing Flow
```
1. SMS received on Android device
2. SMSService reads permission-approved messages
3. TransactionCategoryService parses SMS
   - Extract amount using regex
   - Extract merchant name
   - Auto-categorize merchant
4. Transaction shown in confirmation modal
5. User confirms or edits
6. TransactionService.createTransaction()
7. Transaction saved to PostgreSQL
8. DashboardService recalculates metrics
9. Frontend fetches updated dashboard
10. Dashboard screen updates in real-time
```

### Dashboard Data Processing
```
1. User opens Dashboard or tab navigates
2. useFocusEffect triggers fetchDashboard()
3. Frontend sends GET /api/dashboard
4. Backend: DashboardService.getDashboard(userId)
   - Query: SELECT SUM(amount) WHERE date = TODAY
   - Query: SELECT SUM(amount) WHERE month = CURRENT
   - Calculate budget utilization %
   - Return DashboardDTO
5. Zustand store updates: transactionStore.dashboard
6. Dashboard component re-renders with new data
```

### Insights Analytics Flow
```
1. User opens Insights screen
2. fetchTransactions() gets all transactions
3. Frontend calculates:
   - Category breakdown (groupBy, sum)
   - Weekly trend (7-day rolling)
   - Average daily spend
   - Small spend detection
   - Top category identification
4. Charts rendered with Victory Native
5. Smart nudge generated based on patterns
```

### Goals Tracking Flow
```
1. User creates goal: "Goa Trip - ₹50,000"
2. POST /api/goals with title and target
3. Backend: GoalService.createGoal()
4. Goal saved with 0% progress
5. User adds savings: "₹5,000"
6. POST /api/goals/{id}/savings
7. Backend: GoalService.addSavings()
   - Updates saved_amount
   - Returns updated goal with progress %
8. Frontend stores in Zustand
9. Goal card updates with new progress bar
```

## Transaction Parsing Logic

### SMS Pattern Recognition
```javascript
Input: "Rs 220 paid to SWIGGY using Google Pay"

Patterns matched:
1. Amount: R/regex "Rs (\d+)" → 220
2. Merchant: /paid.*?to\s+([A-Z][a-zA-Z]+)/ → SWIGGY
3. UPI App: /using\s+([A-Za-z\s]+)/ → Google Pay

Category matching in TransactionCategoryService:
- Merchant "swiggy" in foodKeywords → Category: "Food"
```

### Category Auto-Mapping Rules
```
Input Merchant → Output Category

Zomato, Swiggy, Restaurant → Food
Uber, Ola, Metro → Travel
Amazon, Flipkart, Myntra → Shopping
Recharge, Electricity, Broadband → Bills
Udemy, Course, Exam → Education
Netflix, YouTube, Movie → Entertainment
Pharmacy, Hospital, Gym → Health
Netflix Premium, Spotify → Subscription
```

## Performance Optimizations

### Frontend
- **Memoization**: useCallback, useMemo for expensive calculations
- **Lazy Loading**: Screens loaded on demand via React Navigation
- **Caching**: AsyncStorage for user token and dashboard data
- **Batching**: Multiple API calls combined where possible

### Backend
- **Database Indexes**: 
  - B-tree on user_id (fast user lookups)
  - B-tree on timestamp (range queries for date filtering)
  - Hash on category (fast category filtering)
- **Query Optimization**: 
  - Efficient SUM queries with WHERE clauses
  - Avoid N+1 problems with proper joins
  - Prepared statements via Spring Data JPA
- **Caching**: Consider Redis for frequent dashboard queries

### Network
- **Compression**: GZIP compression on API responses
- **Pagination**: Transactions endpoint ready for pagination
- **Error Handling**: Exponential backoff retry logic

## Security Measures

### Authentication
- JWT with 24-hour expiration
- Refresh token mechanism (ready to implement)
- Secure password hashing (BCrypt with salt rounds)

### Data Protection
- HTTPS enforcement for all API calls
- CORS configured for frontend domain
- SQL injection prevention via ORM (Spring Data JPA)
- XSS protection through input validation

### Privacy
- SMS data processed locally on device
- No storage of personal SMS content
- Only merchant/amount extracted and stored
- User can clear data anytime

## Scalability Considerations

### Horizontal Scaling
- Stateless API design (no session state)
- JWT for distributed authentication
- Database connection pooling via HikariCP

### Vertical Scaling
- PostgreSQL can handle millions of transactions
- Index strategy for fast queries
- Archive old transactions if needed

### Future Scaling
- Implement caching layer (Redis)
- Message queue for async processing (RabbitMQ)
- Microservices separation by domain
- Analytics database (separate read replica)
