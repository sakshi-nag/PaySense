# PaySense Setup & Deployment Guide

## 🎯 Quick Start (5 minutes)

### Requirements Checklist
- [ ] Java 17+ installed (`java -version`)
- [ ] Maven 3.8+ installed (`mvn -v`)
- [ ] PostgreSQL 14+ running locally
- [ ] Node.js 18+ installed (`node -v`)
- [ ] npm 9+ installed (`npm -v`)
- [ ] Android SDK / Emulator (for testing)

---

## Backend Setup

### Step 1: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE paysense;
CREATE USER paysense_user WITH PASSWORD 'paysense_password';
GRANT ALL PRIVILEGES ON DATABASE paysense TO paysense_user;

# Verify
\l  # List databases
\du # List users
```

### Step 2: Configure Backend

Edit `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/paysense
    username: paysense_user
    password: paysense_password

jwt:
  secret: your-32-character-secret-key-change-this
  expiration: 86400000
```

**⚠️ Important**: Change JWT secret in production!

### Step 3: Build Backend

```bash
cd backend
mvn clean install
```

This will:
- Download all Maven dependencies
- Compile Java source code
- Run database migrations (Flyway)
- Create JAR file in `target/`

### Step 4: Run Backend

```bash
mvn spring-boot:run
```

**Expected Output:**
```
2024-04-19 10:30:45.123  INFO: Started PaySenseApplication
2024-04-19 10:30:45.456  INFO: Server started on port 8080
2024-04-19 10:30:45.789  INFO: Database migration completed
```

**Test Backend:**
```bash
# In another terminal
curl -X GET http://localhost:8080/api/dashboard
# Should return 401 (Unauthorized - expected without token)
```

---

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install:
- React Native & Expo
- React Navigation
- Axios
- Zustand
- And all other dependencies (~500MB)

### Step 2: Create `.env` File (Optional)

Create `frontend/.env`:

```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENV=development
```

(Already configured in code, but can override here)

### Step 3: Start Expo

```bash
npm start
```

**Expected Output:**
```
Starting Expo server...
Expo DevTools at http://localhost:19000

To run app:
  Press 'a' for Android emulator
  Press 'i' for iOS simulator
  Press 'w' for web
```

### Step 4: Choose Target

Press `a` to launch Android emulator.

The app will:
1. Build React Native bundle
2. Install on emulator
3. Launch app on device
4. Show Splash → Onboarding → Login

---

## 🔧 Configuration

### Backend Configuration (`application.yml`)

```yaml
server:
  port: 8080                        # API port
  servlet:
    context-path: /api              # Base path

spring:
  application:
    name: paysense-backend
  jpa:
    hibernate:
      ddl-auto: validate            # Don't drop/create tables
    show-sql: false                 # Log SQL queries
  datasource:
    url: jdbc:postgresql://localhost:5432/paysense
    username: paysense_user
    password: paysense_password
    driver-class-name: org.postgresql.Driver
  flyway:
    locations: classpath:db/migration
    enabled: true

jwt:
  secret: your-secret-key-minimum-32-chars
  expiration: 86400000              # 24 hours in ms

logging:
  level:
    root: INFO
    com.paysense: DEBUG             # More verbose for our code
```

### Frontend Configuration (`app.json`)

```json
{
  "expo": {
    "name": "PaySense",
    "slug": "paysense",
    "version": "1.0.0",
    "android": {
      "package": "com.paysense",
      "permissions": ["READ_SMS", "POST_NOTIFICATIONS"]
    }
  }
}
```

---

## 🧪 Testing

### Test Backend APIs

1. **Create User (Sign Up)**
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

2. **Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

3. **Create Transaction** (with token from login response)
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 150,
    "merchant": "Zomato",
    "category": "Food",
    "upiApp": "Google Pay",
    "timestamp": "2024-04-19T10:30:00",
    "confirmed": true
  }'
```

4. **Get Dashboard**
```bash
curl -X GET http://localhost:8080/api/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Frontend

1. **Launch App**
   ```bash
   npm start
   Press 'a'
   ```

2. **Sign Up**
   - Tap "Sign Up" on login screen
   - Enter name, email, password
   - Should navigate to onboarding

3. **Complete Onboarding**
   - Slide through 3 screens
   - Tap "Get Started" on last slide
   - Select permissions

4. **Test Dashboard**
   - Login with created account
   - Should see Dashboard
   - Tap "+ Simulate Transaction"
   - Transaction should appear

---

## 🐛 Troubleshooting

### Backend Issues

**Issue**: `Connection refused on port 8080`
- **Solution**: Backend not running. Run `mvn spring-boot:run` in backend folder

**Issue**: `Database connection failed`
- **Solution**: PostgreSQL not running. Start PostgreSQL service:
  - macOS: `brew services start postgresql`
  - Linux: `sudo systemctl start postgresql`
  - Windows: Start PostgreSQL from Services

**Issue**: `Flyway migration failed`
- **Solution**: Database already has schema. Drop and recreate:
  ```sql
  DROP DATABASE IF EXISTS paysense;
  CREATE DATABASE paysense;
  GRANT ALL PRIVILEGES ON DATABASE paysense TO paysense_user;
  ```

### Frontend Issues

**Issue**: `Metro bundler error`
- **Solution**: Clear cache and restart:
  ```bash
  npm start -- --reset-cache
  ```

**Issue**: `Cannot connect to backend`
- **Solution**: Update API URL in `src/utils/api.js` to match backend address

**Issue**: `Emulator not responding`
- **Solution**: Restart emulator:
  ```bash
  adb devices
  adb kill-server
  ```

---

## 📦 Building for Production

### Backend Build

```bash
cd backend
mvn clean package
# Creates JAR in target/paysense-backend-1.0.0-SNAPSHOT.jar

# Deploy to server
java -jar target/paysense-backend-1.0.0-SNAPSHOT.jar
```

### Frontend Build

```bash
cd frontend
npm run build
# Build apk for Android
npx expo prebuild --platform android
npx expo run:android --release
```

---

## 🚀 Deployment

### On AWS / Heroku / DigitalOcean

1. **Backend**
   - Set environment variables
   - Deploy JAR to server
   - Ensure PostgreSQL is accessible
   - Configure firewall for port 8080

2. **Frontend**
   - Build APK/AAB
   - Submit to Google Play Store
   - Or distribute via Expo

---

## 📝 Development Commands

```bash
# Backend
mvn clean install           # Clean build
mvn spring-boot:run         # Run dev server
mvn test                    # Run tests

# Frontend
npm install                 # Install dependencies
npm start                   # Start Expo dev server
npm run android             # Run on Android emulator
npm run build               # Build for production
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL running and accessible
- [ ] Backend starts without errors
- [ ] All migrations applied successfully
- [ ] Backend APIs respond to test requests
- [ ] Frontend dependencies installed
- [ ] Frontend builds without errors
- [ ] App launches in emulator
- [ ] Can sign up and login
- [ ] Dashboard displays correctly
- [ ] Simulate transaction works
- [ ] Insights page shows data
- [ ] Goals can be created
- [ ] Settings page loads

---

## 🎯 Next Steps

1. **Database Setup**: ✅ Complete
2. **Backend Configuration**: ✅ Complete
3. **Frontend Configuration**: ✅ Complete
4. **Development Testing**: Test all features
5. **Demo Mode**: Practice demo flow
6. **Deployment**: Prepare production build

---

## 🆘 Support

**For issues:**
1. Check application logs
2. Verify all services running (PostgreSQL, backend)
3. Clear cache: `npm start -- --reset-cache`
4. Restart emulator
5. Review ARCHITECTURE.md for system overview

**Contact team** for additional help.

---

**Happy Coding! 🚀**
