# Digital Queue Management System

A comprehensive web-based queue management system designed to eliminate physical waiting lines and provide real-time queue tracking for clinics, shops, colleges, and other organizations.

## 🎯 Features

### For Users
- **QR Code Scanning** 📱 - Instantly join queues by scanning QR codes
- **Digital Queue Joining**: Join queues remotely without physical presence
- **Real-Time Status**: Track your position and estimated wait time
- **Smart Notifications**: Get alerts when your turn approaches
- **Easy Cancellation**: Cancel your spot anytime without hassle
- **Multi-Queue Support**: Join and track multiple queues

### For Organizers/Admins
- **Auto QR Code Generation** 🎯 - QR codes automatically created for each queue
- **QR Code Management**: Download, print, or share QR codes
- **Queue Creation**: Set up custom queues with specific parameters
- **Live Management**: Call next person, mark served/missed
- **Real-Time Dashboard**: Monitor queue status and statistics
- **Flexible Controls**: Skip, reorder, or manage entries efficiently
- **Analytics**: View total served, waiting, and missed counts

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling with modern features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
Project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── Queue.js              # Queue schema
│   │   ├── QueueEntry.js         # Queue entry schema
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── queueRoutes.js        # Queue operations
│   │   ├── userRoutes.js         # User auth
│   │   └── adminRoutes.js        # Admin operations
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication
│   ├── utils/
│   │   └── tokenUtils.js         # Token generation
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── QueueCard.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── QueueList.js
    │   │   ├── QueueDetails.js
    │   │   ├── JoinQueue.js
    │   │   ├── MyQueue.js
    │   │   ├── AdminDashboard.js
    │   │   ├── CreateQueue.js
    │   │   └── ManageQueue.js
    │   ├── services/
    │   │   └── api.js             # API service layer
    │   ├── styles/                # CSS files
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn package manager

### Backend Setup

1. **Navigate to backend directory**
   ```powershell
   cd "c:\5th SEM\WebDev\Project\backend"
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```powershell
   Copy-Item .env.example .env
   ```
   - Edit `.env` and update with your values:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```

4. **Start the backend server**
   ```powershell
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
   ```powershell
   cd "c:\5th SEM\WebDev\Project\frontend"
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Start the development server**
   ```powershell
   npm start
   ```
   Application will open at http://localhost:3000

## 🔧 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with username and password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Update `MONGODB_URI` in `.env` file

## 📡 API Endpoints

### Queue Routes (`/api/queues`)
- `GET /` - Get all active queues
- `GET /:id` - Get queue details with entries
- `POST /:id/join` - Join a queue
- `GET /:queueId/position/:phone` - Get user position
- `DELETE /:queueId/cancel/:entryId` - Cancel entry

### Admin Routes (`/api/admin`)
- `POST /queues` - Create new queue
- `PUT /queues/:id` - Update queue
- `DELETE /queues/:id` - Deactivate queue
- `GET /queues/:id/entries` - Get all entries
- `POST /queues/:id/call-next` - Call next person
- `POST /entries/:id/served` - Mark as served
- `POST /entries/:id/missed` - Mark as missed
- `GET /queues/:id/stats` - Get queue statistics

### User Routes (`/api/users`)
- `POST /register` - Register user
- `POST /login` - Login user
- `GET /profile/:id` - Get user profile

## 🎨 Key Features Implementation

### Real-Time Queue Updates
- Frontend polls queue status every 10 seconds
- Admin dashboard refreshes every 5 seconds
- Ensures users see latest queue position

### Wait Time Estimation
```javascript
estimatedWaitTime = (position - currentServingPosition) * avgTimePerPerson
```

### Queue Management
- Admins can call next person
- Mark entries as served/missed
- Skip to specific positions
- View comprehensive statistics

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected admin routes
- Input validation
- CORS enabled for frontend

## 📱 Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Touch-friendly buttons
- Optimized for all screen sizes

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB connection string is correct
- Ensure PORT 5000 is not in use
- Verify all dependencies are installed

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check proxy setting in frontend package.json
- Clear browser cache

### Database connection issues
- Verify MongoDB Atlas IP whitelist
- Check database user credentials
- Ensure network connectivity

## 🔄 Development Workflow

1. **Backend Development**
   ```powershell
   cd backend
   npm run dev  # Uses nodemon for auto-restart
   ```

2. **Frontend Development**
   ```powershell
   cd frontend
   npm start  # Hot reload enabled
   ```

## 📦 Production Deployment

### Backend
1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2
3. Deploy to services like Heroku, Railway, or Render

### Frontend
1. Build the production bundle
   ```powershell
   npm run build
   ```
2. Deploy to Netlify, Vercel, or any static hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Built with React and Node.js
- MongoDB Atlas for database hosting
- Inspiration from real-world queue management needs

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Contact: your-email@example.com

---

**Happy Queueing! 🎉**
