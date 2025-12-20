# 🏗️ Project Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Frontend (Port 3000)                │  │
│  │                                                        │  │
│  │  Components:                                           │  │
│  │  • Navbar          • QueueCard                         │  │
│  │                                                        │  │
│  │  Pages:                                                │  │
│  │  • Home            • QueueList      • QueueDetails     │  │
│  │  • JoinQueue       • MyQueue                          │  │
│  │  • AdminDashboard  • CreateQueue    • ManageQueue     │  │
│  │                                                        │  │
│  │  Services:                                             │  │
│  │  • API Service (Axios) - HTTP Requests                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ (JSON)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         SERVER SIDE                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Node.js + Express (Port 5000)                │  │
│  │                                                        │  │
│  │  Routes:                                               │  │
│  │  • /api/queues     - Queue operations                 │  │
│  │  • /api/users      - User authentication              │  │
│  │  • /api/admin      - Admin operations                 │  │
│  │                                                        │  │
│  │  Middleware:                                           │  │
│  │  • CORS            • JSON Parser                      │  │
│  │  • Auth (JWT)      • Error Handler                    │  │
│  │                                                        │  │
│  │  Models (Mongoose):                                    │  │
│  │  • Queue           • QueueEntry      • User           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ MongoDB
                              │ Driver
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 MongoDB Atlas (Cloud)                  │  │
│  │                                                        │  │
│  │  Collections:                                          │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌────────┐         │  │
│  │  │  queues  │  │ queueentries │  │ users  │         │  │
│  │  └──────────┘  └──────────────┘  └────────┘         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Joining Queue

```
User Action → Frontend Component → API Service → 
Backend Route → Controller Logic → MongoDB → 
Response → Frontend Update → UI Render
```

**Detailed Steps:**
1. User fills join form in `JoinQueue.js`
2. Form submits to `queueAPI.joinQueue()`
3. Axios sends POST to `/api/queues/:id/join`
4. Express route handler validates data
5. Creates new QueueEntry in MongoDB
6. Calculates position and wait time
7. Returns entry data as JSON
8. Frontend receives response
9. Stores entry in localStorage
10. Redirects to `MyQueue` page

### Admin Managing Queue

```
Admin Dashboard → Real-time Polling → Backend Stats → 
Database Queries → Aggregated Data → 
Frontend Display → User Actions → DB Updates
```

## Technology Stack Details

### Frontend Technologies

```
React Ecosystem:
├── React 18.2.0
│   ├── React Hooks (useState, useEffect)
│   ├── Component Architecture
│   └── Virtual DOM
├── React Router DOM 6.20.1
│   ├── Browser Router
│   ├── Route Management
│   └── Navigation
└── Axios 1.6.2
    ├── HTTP Client
    ├── Promise-based
    └── Request/Response Interceptors

Build Tools:
├── React Scripts 5.0.1
│   ├── Webpack
│   ├── Babel
│   └── ESLint
└── Create React App

Styling:
└── CSS3
    ├── Flexbox
    ├── Grid
    ├── Animations
    └── Media Queries
```

### Backend Technologies

```
Node.js Ecosystem:
├── Express.js 4.18.2
│   ├── Routing
│   ├── Middleware
│   └── Error Handling
├── Mongoose 8.0.3
│   ├── Schema Definitions
│   ├── Validation
│   └── Middleware
└── Security
    ├── bcryptjs 2.4.3 (Password Hashing)
    ├── jsonwebtoken 9.0.2 (Authentication)
    └── cors 2.8.5 (Cross-Origin)

Utilities:
├── dotenv 16.3.1 (Environment Variables)
├── express-validator 7.0.1 (Input Validation)
└── nodemon 3.0.2 (Dev Server)
```

### Database Schema

```
MongoDB Collections:

┌─────────────────────────────────────┐
│           QUEUES                    │
├─────────────────────────────────────┤
│ _id                    ObjectId     │
│ name                   String       │
│ description            String       │
│ organizationType       Enum         │
│ isActive               Boolean      │
│ maxCapacity            Number       │
│ estimatedTimePerPerson Number       │
│ organizerName          String       │
│ organizerEmail         String       │
│ currentServingPosition Number       │
│ totalServed            Number       │
│ createdAt              Date         │
│ updatedAt              Date         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        QUEUE ENTRIES                │
├─────────────────────────────────────┤
│ _id                    ObjectId     │
│ queueId                ObjectId     │ ─┐
│ userName               String       │  │
│ userPhone              String       │  │ References
│ userEmail              String       │  │ Queue
│ position               Number       │  │
│ status                 Enum         │ ─┘
│ estimatedWaitTime      Number       │
│ joinedAt               Date         │
│ calledAt               Date         │
│ servedAt               Date         │
│ notes                  String       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│            USERS                    │
├─────────────────────────────────────┤
│ _id                    ObjectId     │
│ name                   String       │
│ email                  String       │
│ phone                  String       │
│ password               String       │
│ role                   Enum         │
│ createdAt              Date         │
└─────────────────────────────────────┘
```

## API Endpoints Map

```
/api
├── /queues
│   ├── GET    /              → Get all active queues
│   ├── GET    /:id           → Get queue details
│   ├── POST   /:id/join      → Join a queue
│   ├── GET    /:queueId/position/:phone → Get user position
│   └── DELETE /:queueId/cancel/:entryId → Cancel entry
│
├── /admin
│   ├── POST   /queues                   → Create queue
│   ├── PUT    /queues/:id               → Update queue
│   ├── DELETE /queues/:id               → Deactivate queue
│   ├── GET    /queues/:id/entries       → Get all entries
│   ├── POST   /queues/:id/call-next     → Call next person
│   ├── POST   /entries/:id/served       → Mark as served
│   ├── POST   /entries/:id/missed       → Mark as missed
│   ├── POST   /entries/:id/skip-to      → Skip to entry
│   └── GET    /queues/:id/stats         → Get statistics
│
└── /users
    ├── POST   /register      → Register user
    ├── POST   /login         → Login user
    └── GET    /profile/:id   → Get user profile
```

## Component Hierarchy

```
App
├── Navbar (always visible)
│
└── Routes
    ├── Home
    │   ├── Hero Section
    │   ├── Features Grid
    │   └── How It Works
    │
    ├── QueueList
    │   ├── Filter Controls
    │   └── QueueCard[] (multiple)
    │
    ├── QueueDetails
    │   ├── Queue Info
    │   ├── Statistics
    │   └── Waiting List
    │
    ├── JoinQueue
    │   └── Join Form
    │
    ├── MyQueue
    │   ├── Search Form OR
    │   └── Status Display
    │
    ├── AdminDashboard
    │   ├── Stats Cards
    │   └── Queues Table
    │
    ├── CreateQueue
    │   └── Create Form
    │
    └── ManageQueue
        ├── Queue Header
        ├── Stats Grid
        ├── Call Next Button
        ├── Called Entries
        └── Waiting Entries
```

## State Management Strategy

```
Local State (useState):
├── Form data
├── Loading states
├── Error messages
└── UI toggles

Effect Hooks (useEffect):
├── Data fetching on mount
├── Auto-refresh timers
├── Cleanup functions
└── Dependency tracking

Local Storage:
└── Current queue entry
    ├── queueId
    ├── entryId
    ├── phone
    └── queueName

URL Parameters:
├── Queue ID
├── Entry ID
└── Dynamic routing
```

## Security Measures

```
Frontend:
├── Input validation
├── XSS prevention
├── HTTPS only (production)
└── Token storage

Backend:
├── CORS configuration
├── JWT authentication
├── Password hashing (bcrypt)
├── Input sanitization
├── Rate limiting (recommended)
└── Environment variables

Database:
├── Connection string security
├── IP whitelisting
├── User authentication
├── Role-based access
└── Encrypted connections
```

## Performance Optimizations

```
Frontend:
├── Component memoization
├── Lazy loading (potential)
├── Efficient re-renders
├── Debounced API calls
└── Optimized images

Backend:
├── Database indexing
├── Query optimization
├── Response caching (potential)
├── Connection pooling
└── Compression

Database:
├── Indexed fields
│   ├── queueId + position
│   └── queueId + status
├── Efficient queries
└── Proper schema design
```

## Deployment Architecture

```
Production Setup:

Frontend (Static Hosting):
├── Netlify / Vercel
├── Build: npm run build
├── Serve: optimized static files
└── CDN distribution

Backend (Node.js Hosting):
├── Heroku / Railway / Render
├── Environment variables
├── Process manager (PM2)
└── Auto-scaling

Database:
├── MongoDB Atlas (Cloud)
├── Automated backups
├── Replica sets
└── Geographic distribution
```

## Development Workflow

```
1. Local Development
   ├── Backend: npm run dev (nodemon)
   ├── Frontend: npm start (hot reload)
   └── Database: MongoDB Atlas

2. Version Control
   ├── Git repository
   ├── .gitignore for sensitive files
   └── Branch strategy

3. Testing
   ├── Manual testing
   ├── API testing (Postman)
   └── Browser testing

4. Deployment
   ├── Build frontend
   ├── Deploy backend
   ├── Configure environment
   └── Test production
```

## File Size & Performance Metrics

```
Backend:
├── node_modules: ~150MB
├── Source code: ~50KB
└── API response time: <200ms

Frontend:
├── node_modules: ~300MB
├── Source code: ~100KB
├── Production build: ~500KB
└── Initial load: <2s

Database:
├── Average document size: 1-5KB
└── Query response: <50ms
```

---

**This architecture ensures scalability, maintainability, and performance!** 🚀
