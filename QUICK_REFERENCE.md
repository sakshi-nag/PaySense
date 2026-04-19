# PaySense - Developer Quick Reference

## 🚀 Quick Start Commands

### Backend
```bash
cd backend
mvn clean package          # Build
mvn spring-boot:run        # Run locally
mvn test                   # Run tests
```

### Frontend
```bash
cd frontend
npm install                # Setup
npm start                  # Dev server
npm run android            # Android emulator
```

---

## 🔌 API Base URL
```
http://localhost:8080/api
```

**Endpoints Summary:**
```
/auth/signup, /auth/login
/transactions (CRUD)
/dashboard
/goals (CRUD)
/settings (GET, PUT)
```

---

## 📁 Key Files

### Backend Core
- `PaySenseApplication.java` - Main spring boot class
- `entity/` - JPA models (User, Transaction, Goal, Settings)
- `service/` - Business logic
- `controller/` - REST endpoints
- `security/JwtTokenProvider.java` - Auth logic
- `db/migration/V1__Initial_Schema.sql` - Database

### Frontend Core
- `App.js` - Root navigation
- `screens/` - All 8 screens
- `store/` - Zustand stores
- `utils/api.js` - Axios client
- `utils/colors.js` - Design system

---

## 🎨 Colors & Styling

```javascript
Primary:    #10B981  (Growth Green)
Secondary:  #1F2937  (Navy)
Danger:     #EF4444  (Red)
Warning:    #F59E0B  (Amber)
Background: #F9FAFB  (Light)
```

Use from `src/utils/colors.js`

---

## 🗄️ Database

### Create User
```sql
INSERT INTO users (name, email, password, monthly_budget, created_at, updated_at)
VALUES ('John', 'john@test.com', 'hashed_pwd', 5000, now(), now());
```

### Add Transaction
```sql
INSERT INTO transactions (user_id, amount, merchant, category, timestamp, confirmed, created_at, updated_at)
VALUES (1, 150, 'Zomato', 'Food', now(), true, now(), now());
```

### View Transactions
```sql
SELECT * FROM transactions WHERE user_id = 1 ORDER BY timestamp DESC;
SELECT SUM(amount) FROM transactions WHERE user_id = 1 AND DATE(timestamp) = CURRENT_DATE;
```

---

## 🔐 Authentication Flow

1. User enters credentials
2. Backend hashes & validates
3. JWT token generated (24h expiration)
4. Token stored in AsyncStorage
5. Token included in all requests: `Authorization: Bearer {token}`

**JWT Secret**: Change in production!

---

## 📱 Key Components

### Dashboard Screen
- Shows today's spend, monthly spend, budget progress
- Lists recent transactions
- Has "+ Simulate Transaction" button for demo

### Insights Screen
- Calculates category breakdown
- Shows weekly trend
- Generates smart recommendations
- Uses math for percentages

### Goals Screen
- Create/edit goals
- Add savings incrementally
- Track progress with percentage
- Delete goals

### Settings Screen
- Toggle features
- Adjust thresholds
- View profile
- Logout

---

## 🐛 Debugging

### Backend
```bash
# Check logs
tail -f logs/app.log

# DB connection test
psql -U paysense_user -d paysense -c "SELECT 1;"

# API test
curl -X GET http://localhost:8080/api/dashboard
```

### Frontend
```bash
# Clear cache
npm start -- --reset-cache

# Debug logs
console.log() in React code

# React DevTools
npx react-native-debugger
```

---

## 📊 Transaction Categories

Food, Travel, Shopping, Bills, Education, Entertainment, Health, Subscription, Other

**Mapping in**: `TransactionCategoryService.java`

---

## 🎯 Demo Mode

**Location**: Dashboard screen, "+ Simulate Transaction" button

**Transactions**:
- ₹149 Zomato (Food)
- ₹220 Uber (Travel)
- ₹20 Tea (Food)
- ₹899 Amazon (Shopping)
- ₹500 Electricity (Bills)

---

## 📦 Deployment

### Backend (JAR)
```bash
java -jar target/paysence-backend-1.0.0-SNAPSHOT.jar
```

### Frontend (APK)
```bash
npx expo prebuild --platform android
npx expo run:android --release
```

---

## ✅ Pre-Demo Checklist

- [ ] Backend running
- [ ] Database connected
- [ ] Migrations applied
- [ ] Frontend builds
- [ ] Can login/signup
- [ ] Simulate transaction works
- [ ] Dashboard displays data
- [ ] No crashes
- [ ] Smooth animations
- [ ] All screens accessible

---

## 🎓 Code Patterns

### Service Layer
```java
@Service
public class UserService {
    public User getUserById(Long id) {
        return repository.findById(id).orElseThrow(...);
    }
}
```

### Zustand Store
```javascript
export const useStore = create((set) => ({
    data: [],
    fetchData: async () => {
        const response = await api.get(...);
        set({ data: response.data });
    }
}));
```

### React Native Screen
```javascript
export default function Screen() {
    const { fetchData } = useStore();
    
    useFocusEffect(() => {
        fetchData();
    }, []);
    
    return <View>...</View>;
}
```

---

## 🔗 Important Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /auth/signup | Register |
| POST | /auth/login | Login |
| POST | /transactions | Create |
| GET | /transactions | List |
| GET | /dashboard | Summary |
| POST | /goals | Create goal |
| POST | /goals/:id/savings | Add savings |
| GET | /settings | Get settings |

---

## 📝 Git Workflow

```bash
git status                  # Check changes
git add .                   # Stage all
git commit -m "message"     # Commit
git push origin main        # Push

# Create feature branch
git checkout -b feature/name
git commit -m "feature"
git push origin feature/name
```

---

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| Backend won't start | Check PostgreSQL running |
| Frontend won't connect | Update API URL in api.js |
| Emulator slow | Restart: `adb kill-server` |
| JWT token invalid | Ensure token sent in Authorization header |
| Transaction not showing | Check user_id matches authenticated user |

---

## 📞 Team Communication

- **Backend Lead**: Handle Spring Boot, database, APIs
- **Frontend Lead**: React Native, navigation, UI
- **Demo Lead**: Practice & execute demo script
- **DevOps**: Deployment, environment setup

---

## 🎯 Success Metrics

- ✅ No crashes during demo
- ✅ <1s dashboard load time
- ✅ All screens render correctly
- ✅ Transactions update instantly
- ✅ Demo runs in <15 minutes
- ✅ Judges understand the value prop

---

## 📚 Documentation Files

- `README.md` - Overview
- `ARCHITECTURE.md` - System design
- `SETUP_GUIDE.md` - Installation
- `DEMO_GUIDE.md` - Demo script
- This file - Quick reference

---

**Last Updated**: April 19, 2024  
**Version**: 1.0.0  
**Status**: Production Ready MVP
