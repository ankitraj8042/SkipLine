# ⚡ Quick Reference Card

## 🚀 Quick Start Commands

### Backend
```powershell
cd "c:\5th SEM\WebDev\Project\backend"
npm install
Copy-Item .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

### Frontend
```powershell
cd "c:\5th SEM\WebDev\Project\frontend"
npm install
npm start
```

## 🔑 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | React app |
| Backend | http://localhost:5000 | API server |
| API Health | http://localhost:5000/api/health | Server status |
| MongoDB Atlas | https://cloud.mongodb.com | Database |

## 📋 Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/queueDB
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## 🎯 Main Routes

### User Routes
- `/` - Home page
- `/queues` - Browse all queues
- `/queue/:id` - Queue details
- `/queue/:id/join` - Join queue
- `/my-queue` - Track your position

### Admin Routes
- `/admin` - Dashboard
- `/admin/create-queue` - Create new queue
- `/admin/manage/:id` - Manage specific queue

## 📡 API Endpoints Quick Reference

### Queue Operations
```
GET    /api/queues              - Get all queues
GET    /api/queues/:id          - Get queue details
POST   /api/queues/:id/join     - Join queue
GET    /api/queues/:queueId/position/:phone
DELETE /api/queues/:queueId/cancel/:entryId
```

### Admin Operations
```
POST   /api/admin/queues                 - Create queue
PUT    /api/admin/queues/:id             - Update queue
POST   /api/admin/queues/:id/call-next   - Call next
POST   /api/admin/entries/:id/served     - Mark served
POST   /api/admin/entries/:id/missed     - Mark missed
GET    /api/admin/queues/:id/stats       - Get stats
```

## 🐛 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| Backend won't start | Check MongoDB URI in .env |
| Port 5000 in use | Change PORT in .env |
| Frontend can't connect | Verify backend is running |
| Module not found | Run `npm install` again |
| MongoDB connection failed | Check IP whitelist in Atlas |

## 💻 Useful Commands

### Stop Server
```powershell
Ctrl + C
```

### Restart Backend
```powershell
npm run dev
```

### Restart Frontend
```powershell
npm start
```

### Check Node Version
```powershell
node --version
```

### Clear npm Cache
```powershell
npm cache clean --force
```

### Reinstall Dependencies
```powershell
Remove-Item node_modules -Recurse -Force
npm install
```

## 📊 Data Models Quick Reference

### Queue
- name, description, organizationType
- isActive, maxCapacity
- estimatedTimePerPerson
- currentServingPosition, totalServed

### QueueEntry
- queueId, userName, userPhone
- position, status
- estimatedWaitTime
- joinedAt, calledAt, servedAt

### User
- name, email, phone
- password (hashed)
- role (user/admin/organizer)

## 🎨 Color Codes

```css
Primary Gradient: #667eea to #764ba2
Success: #28a745
Danger: #dc3545
Warning: #ffc107
Background: #f5f7fa
Text: #333
Light Gray: #f8f9fa
Border: #ddd
```

## 🔧 Package Scripts

### Backend
```json
"start": "node server.js"
"dev": "nodemon server.js"
```

### Frontend
```json
"start": "react-scripts start"
"build": "react-scripts build"
"test": "react-scripts test"
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| backend/server.js | Main server entry |
| backend/.env | Environment config |
| backend/config/db.js | Database connection |
| frontend/src/App.js | Main React component |
| frontend/src/services/api.js | API integration |

## 🔐 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

## 📚 Documentation Files

1. **README.md** - Main overview
2. **SETUP_GUIDE.md** - Step-by-step setup
3. **FEATURES.md** - Feature details
4. **ARCHITECTURE.md** - Technical architecture
5. **PROJECT_SUMMARY.md** - Complete summary
6. **QUICK_REFERENCE.md** - This file!

## 🎯 Testing Flow

1. Start backend server
2. Start frontend server
3. Go to http://localhost:3000
4. Navigate to Admin → Create Queue
5. Create a test queue
6. Go to Find Queues
7. Join the queue
8. Check My Queue
9. Manage from Admin Dashboard

## ⚡ Keyboard Shortcuts (VS Code)

| Shortcut | Action |
|----------|--------|
| Ctrl + ` | Open terminal |
| Ctrl + C | Stop server |
| Ctrl + S | Save file |
| F5 | Refresh browser |
| F12 | Open DevTools |

## 📞 Quick Help

**Can't find something?**
- Check README.md for overview
- Check SETUP_GUIDE.md for setup
- Check console for errors
- Check Network tab in DevTools

**Server not responding?**
- Check if both servers are running
- Check for port conflicts
- Verify .env configuration

**Database issues?**
- Check MongoDB Atlas connection
- Verify IP whitelist
- Check credentials

## 🎉 Quick Win Checklist

- [ ] Backend running ✅
- [ ] Frontend running ✅
- [ ] MongoDB connected ✅
- [ ] Can create queue ✅
- [ ] Can join queue ✅
- [ ] Can view position ✅
- [ ] Admin panel works ✅

---

**Keep this card handy for quick reference!** 📌

**For detailed help, see SETUP_GUIDE.md**
