# PaySense - Smart Expense Tracking for Indian UPI Users

## 🎯 One-Line Pitch

**Track everything. Feel every rupee. Spend smarter.**

PaySense is a cutting-edge mobile expense tracking app designed for Indian college students and young professionals who use UPI payment apps daily. It automatically detects transactions from SMS messages, unifies expenses across multiple payment apps, and uses behavioral psychology and gamification to help users develop better spending habits.

---

## 🚀 Features

### Core Features
✅ **Auto-Detection**: Automatically detects UPI transactions from SMS messages  
✅ **Smart Categorization**: AI-powered merchant categorization (Food, Travel, Shopping, Bills, etc.)  
✅ **Real-Time Dashboard**: View today's spend, monthly spend, and budget progress at a glance  
✅ **Spending Insights**: Weekly trends, category breakdown, and smart savings recommendations  
✅ **Savings Goals**: Create and track financial goals with progress visualization  
✅ **Behavioral Nudges**: Smart notifications and insights to encourage better spending habits  
✅ **User Settings**: Customizable thresholds, notification preferences, and more  
✅ **Demo Mode**: Built-in transaction simulator for flawless hackathon demos  

### Demo Features
- Simulate realistic UPI transactions instantly
- Test all features without real SMS data
- Perfect for live demonstrations

---

## 📱 Technology Stack

### Frontend
- **React Native** with Expo
- **React Navigation** for routing
- **Zustand** for state management
- **Axios** for API communication
- **Date-fns** for date manipulation
- **Styling**: Custom design system with Colors and Spacing utilities

### Backend
- **Spring Boot 3.2** (Java 17)
- **PostgreSQL** database
- **Flyway** for database migrations
- **JWT** for authentication
- **Spring Security** for authorization
- **Spring Data JPA** for data access

---

## 🏗️ Project Structure

```
PaySense/
├── backend/                          # Spring Boot REST API
│   ├── pom.xml                      # Maven dependencies
│   ├── src/main/
│   │   ├── java/com/paysense/
│   │   │   ├── entity/              # JPA Entities
│   │   │   ├── repository/          # Spring Data repositories
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── service/             # Business logic
│   │   │   ├── controller/          # REST API endpoints
│   │   │   ├── security/            # JWT security
│   │   │   ├── config/              # Spring configuration
│   │   │   └── PaySenseApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/        # Flyway migrations
│   └── .gitignore
│
├── frontend/                        # React Native mobile app
│   ├── App.js                       # Root navigation
│   ├── app.json                     # Expo configuration
│   ├── package.json
│   ├── src/
│   │   ├── screens/                 # All app screens
│   │   ├── store/                   # Zustand stores
│   │   ├── utils/                   # API & design system
│   │   └── components/              # Reusable components
│   └── .gitignore
│
├── README.md                        # This file
├── ARCHITECTURE.md                  # Technical architecture
└── .gitignore
```

---

## 📊 Database Schema

**users** | **transactions** | **goals** | **settings**
- id | - id | - id | - id
- name | - user_id | - user_id | - user_id
- email | - amount | - title | - threshold
- password | - merchant | - target_amount | - auto_category
- monthly_budget | - category | - saved_amount | - notifications
- timestamps | - upi_app | - deadline | - dark_mode
 | - timestamp | - timestamps | - timestamps
 | - confirmed | |
 | - timestamps | |

---

## 🚀 Getting Started

### Prerequisites
- **Backend**: Java 17+, Maven 3.8+, PostgreSQL 14+
- **Frontend**: Node.js 18+, npm 9+
- **Mobile**: Android emulator or device

### Backend Setup

1. **Create PostgreSQL Database**
   ```bash
   createdb paysense
   psql paysence -c "CREATE USER paysense_user WITH PASSWORD 'paysense_password';"
   psql paysence -c "GRANT ALL PRIVILEGES ON DATABASE paysence TO paysense_user;"
   ```

2. **Build and Run**
   ```bash
   cd backend
   mvn clean package
   mvn spring-boot:run
   ```
   Backend will start on `http://localhost:8080/api`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run on Android**
   ```bash
   npm run android
   ```

3. **Or with Expo**
   ```bash
   npm start
   # Press 'a' for Android
   ```

---

## 🎮 Demo Mode

Tap **"+ Simulate Transaction"** on the Dashboard to add realistic test transactions:
- ₹149 - Zomato (Food)
- ₹220 - Uber (Travel)
- ₹20 - Tea Stall (Food)
- ₹899 - Amazon (Shopping)
- ₹500 - Electricity Bill (Bills)

Perfect for live demos without real SMS data!

---

## 📱 User Flow

1. **Splash** → App initialization
2. **Onboarding** → 3-slide feature carousel
3. **Permissions** → SMS and notification access
4. **Auth** → Sign up or login
5. **Dashboard** → Home with spending overview
6. **Insights** → Analytics and trends
7. **Goals** → Savings goal tracking
8. **Settings** → Preferences and account

---

## 🔌 API Endpoints

```
POST   /api/auth/signup              Register user
POST   /api/auth/login               Login user

POST   /api/transactions             Create transaction
PUT    /api/transactions/:id         Update transaction
GET    /api/transactions             List transactions
GET    /api/dashboard                Get dashboard metrics

POST   /api/goals                    Create goal
POST   /api/goals/:id/savings        Add savings
GET    /api/goals                    List goals
DELETE /api/goals/:id                Delete goal

GET    /api/settings                 Get settings
PUT    /api/settings/threshold       Update threshold
PUT    /api/settings/auto-category   Toggle categorization
PUT    /api/settings/notifications   Toggle notifications
```

---

## 🎨 Design System

- **Primary Color**: `#10B981` (Growth Green)
- **Secondary Color**: `#1F2937` (Navy)
- **Danger**: `#EF4444` (Red)
- **Warning**: `#F59E0B` (Amber)
- **Spacing**: 4px, 8px, 16px, 24px, 32px scale
- **Border Radius**: 8px, 12px, 16px, 20px scale
- **Typography**: Clean, modern, readable

---

## 💡 Smart Features

### SMS Parsing Engine
- Regex pattern matching for amount extraction
- Merchant name recognition
- Automatic categorization into 9 categories
- Handles multiple SMS formats (Rs, ₹, INR)

### Behavioral Psychology
- "Pain of Paying" alerts after transactions
- Weekly spending comparisons
- Small spend detection ($<50 tracking)
- Goal achievement celebrations
- Gamified streaks and badges

### Analytics
- Category breakdown with percentages
- 7-day spending trends
- Daily average calculations
- Overspending warnings
- Savings opportunity recommendations

---

## 🔒 Security

- **Passwords**: BCrypt hashing
- **Auth**: JWT tokens (24-hour expiration)
- **Database**: SQL injection prevention via ORM
- **Privacy**: SMS processed locally, never stored
- **CORS**: Configured for frontend domain

---

## 🎯 Hackathon Checklist

- ✅ Beautiful onboarding
- ✅ Smooth auth flows
- ✅ Polished dashboard
- ✅ Working analytics
- ✅ Functional goals
- ✅ Settings customization
- ✅ Demo mode for testing
- ✅ Zero crashes
- ✅ Fast performance
- ✅ Production-ready code

---

## 📖 Documentation

- See **ARCHITECTURE.md** for detailed system design
- See **SETUP_GUIDE.md** for step-by-step installation
- API documentation in each controller

---

## 🚀 Future Enhancements

- AI spending forecasts
- Subscription detection
- Cashback alerts
- Receipt OCR scanning
- Multi-language support
- Voice assistant
- Peer analytics
- Investment recommendations

---

## 👥 Team

Built with ❤️ for the PaySense Hackathon

**Live the change, track the rupees, spend smarter.** 💚

---

## 📄 License

MIT License - Educational and hackathon use permitted

For detailed technical architecture, see **ARCHITECTURE.md**.