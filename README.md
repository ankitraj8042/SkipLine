# SkipLine - Digital Queue Management System

A modern web-based queue management system that eliminates physical waiting lines using QR code technology. Perfect for clinics, shops, colleges, and any organization that manages customer queues.

## ✨ Key Features

### 🎯 For Customers
- **📱 QR Code Scanning** - Scan QR codes with your phone camera to instantly join queues
- **📁 Upload QR Image** - Upload a screenshot or photo of a QR code
- **⏱️ Real-Time Updates** - Track your position and estimated wait time live
- **🔔 Smart Notifications** - Get notified when your turn is approaching
- **❌ Easy Cancellation** - Leave the queue anytime with a single click
- **📊 Multi-Queue Support** - Manage multiple queue entries simultaneously

### 🎯 For Organizers
- **🎨 Auto QR Generation** - Every queue automatically gets a unique QR code
- **💾 Download & Print** - Export QR codes as PNG images or print with queue details
- **📊 Live Dashboard** - Monitor queue status with real-time statistics
- **📢 Call Next** - Manage queue flow by calling the next person
- **✅ Entry Management** - Mark entries as served, missed, or skipped
- **📈 Analytics** - View served, waiting, and missed entry counts

## 🛠️ Tech Stack

**Frontend:**
- React 18 - Modern UI library
- React Router DOM - Client-side routing
- Axios - HTTP requests
- html5-qrcode - QR scanning and image processing
- CSS3 - Responsive styling

**Backend:**
- Node.js & Express.js - Server framework
- MongoDB Atlas - Cloud database
- Mongoose - MongoDB ODM
- JWT - Secure authentication
- bcryptjs - Password encryption
- qrcode - QR code generation

## 📁 Project Structure

```
SkipLine/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── models/                   # Database schemas
│   │   ├── Queue.js              # Queue model with QR code
│   │   ├── QueueEntry.js         # Entry tracking
│   │   └── User.js               # User authentication
│   ├── routes/                   # API endpoints
│   │   ├── queueRoutes.js        # Public queue operations
│   │   ├── adminRoutes.js        # Admin/organizer operations
│   │   └── userRoutes.js         # User authentication
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification
│   ├── utils/
│   │   ├── qrCodeGenerator.js    # QR code generation
│   │   └── tokenUtils.js         # JWT utilities
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                 # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/           # Reusable components
    │   │   ├── Navbar.js         # Navigation bar
    │   │   └── QueueCard.js      # Queue display card
    │   ├── pages/                # Main application pages
    │   │   ├── Home.js           # Landing page
    │   │   ├── QueueList.js      # Browse all queues
    │   │   ├── QueueDetails.js   # Individual queue view
    │   │   ├── JoinQueue.js      # Join queue form
    │   │   ├── MyQueue.js        # User's queue entries
    │   │   ├── QRScanner.js      # QR scan/upload page
    │   │   ├── AdminDashboard.js # Admin overview
    │   │   ├── CreateQueue.js    # Create new queue
    │   │   └── ManageQueue.js    # Manage queue & QR
    │   ├── services/api.js       # API client
    │   ├── styles/               # CSS modules
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** - [Sign up free](https://www.mongodb.com/cloud/atlas/register)
- **Git** - [Download](https://git-scm.com/)

### 1. Clone the Repository
```powershell
git clone https://github.com/ankitraj8042/SkipLine.git
cd SkipLine
```

### 2. Backend Setup

#### Install Dependencies
```powershell
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/?appName=YourApp
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

**MongoDB Atlas Setup:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user (Database Access → Add New User)
4. Whitelist your IP (Network Access → Add IP Address → Allow from Anywhere for dev)
5. Get connection string:
   - Click **Connect** on your cluster
   - Choose **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your actual database password
   - **Important:** If password has special characters like `%`, `@`, `:`, encode them:
     - `%` becomes `%25`
     - `@` becomes `%40`
     - `:` becomes `%3A`
   - Paste into `MONGODB_URI` in `.env`

#### Start Backend Server
```powershell
npm run dev
```
✅ Server runs on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
Open a **new terminal** window:
```powershell
cd frontend
npm install
```

#### Start Development Server
```powershell
npm start
```
✅ Application opens at `http://localhost:3000`

## 📖 How to Use

### For Customers

#### Option 1: Scan QR Code
1. Visit the website on your phone
2. Click **"📱 Scan QR"** in navigation
3. Click **"📷 Start Camera Scanner"**
4. Allow camera permissions
5. Point camera at organizer's QR code
6. Automatically redirected to join form
7. Fill in your details and join!

#### Option 2: Upload QR Image
1. Take a screenshot/photo of the QR code
2. Visit website and click **"📱 Scan QR"**
3. Click **"📁 Upload QR Image"**
4. Select the QR code image
5. Automatically redirected to join form

#### Option 3: Manual Browse
1. Click **"Browse Queues"**
2. Find your queue from the list
3. Click **"View Details"**
4. Click **"Join Queue"**
5. Fill in your information

#### Track Your Queue
- Go to **"My Queue"** to see your position
- View estimated wait time
- Cancel if needed

### For Organizers/Admins

#### Create a Queue
1. Navigate to **Admin Dashboard**
2. Click **"Create New Queue"**
3. Fill in queue details:
   - Name (e.g., "Dr. Smith Consultation")
   - Description
   - Organization type
   - Max capacity
   - Estimated time per person
   - Contact information
4. Click **"Create Queue"**
5. ✅ QR code auto-generated!

#### Manage Queue & QR Code
1. Go to **Admin Dashboard**
2. Click **"Manage"** on your queue
3. Click **"📱 Show QR Code"** button
4. QR code actions:
   - **💾 Download** - Save as PNG image
   - **🖨️ Print** - Print with queue details
   - **🔗 Copy Link** - Copy join URL to clipboard
5. Share QR code with customers (print posters, social media, email)

#### Manage Queue Flow
- **📢 Call Next Person** - Calls the next waiting customer
- **✅ Mark Served** - When service is complete
- **✗ Mark Missed** - If customer doesn't respond
- View real-time statistics (waiting, served, missed)

## 🔌 API Endpoints

### Public Queue Routes (`/api/queues`)
```
GET    /                        → Get all active queues
GET    /:id                     → Get queue details
POST   /:id/join                → Join a queue
GET    /:queueId/position/:phone → Get user's position
DELETE /:queueId/cancel/:entryId → Cancel entry
```

### Admin Routes (`/api/admin`)
```
POST   /queues                  → Create new queue (auto-generates QR)
PUT    /queues/:id              → Update queue details
DELETE /queues/:id              → Deactivate queue
GET    /queues/:id/entries      → Get all queue entries
POST   /queues/:id/call-next    → Call next person
POST   /entries/:id/served      → Mark entry as served
POST   /entries/:id/missed      → Mark entry as missed
GET    /queues/:id/qrcode       → Get/regenerate QR code
GET    /queues/:id/stats        → Get queue statistics
```

### User Routes (`/api/users`)
```
POST   /register                → Register new user
POST   /login                   → Login user
GET    /profile/:id             → Get user profile
```

## 🎨 QR Code Features

### How QR Codes Work
1. **Generation:** When you create a queue, a unique QR code is automatically generated containing the queue join URL
2. **Scanning:** Customers scan with camera or upload image → QR decoded → Redirected to join form
3. **Format:** QR codes contain: `http://localhost:3000/queue/{queueId}/join`

### QR Code Best Practices
- **Print Size:** Minimum 4x4 inches for easy scanning
- **Placement:** Eye-level, well-lit areas
- **Materials:** High-quality paper or laminated posters
- **Distribution:** Reception desks, entrance doors, social media, email signatures

### Troubleshooting QR Scanning
- **Camera not starting:** Check browser camera permissions
- **QR not detected:** Ensure good lighting, steady hand, focus on QR
- **Invalid QR error:** Make sure it's a SkipLine QR code, not generic
- **Upload not working:** Try different image format (PNG, JPG), ensure QR is clear

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
- Verify connection string in `.env` is correct
- Check username and password (URL encode special characters)
- Ensure IP is whitelisted in MongoDB Atlas Network Access
- Test connection: `npm run dev` should show "MongoDB Connected" message

**Port Already in Use**
- Change `PORT` in `.env` to different number (e.g., 5001)
- Or kill process using port 5000:
  ```powershell
  netstat -ano | findstr :5000
  taskkill /PID <process_id> /F
  ```

**Dependencies Installation Failed**
```powershell
# Clear npm cache
npm cache clean --force
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### Frontend Issues

**npm start fails**
```powershell
# Delete node_modules and package-lock
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
npm start
```

**QR Scanner not working**
- Ensure you're using HTTPS or localhost (camera requires secure context)
- Check browser camera permissions
- Try different browser (Chrome recommended)
- Clear browser cache

**Can't connect to backend**
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify `REACT_APP_API_URL` if using custom backend URL

## 🚀 Production Deployment

### Backend Deployment (Heroku/Render/Railway)
1. Set environment variables on hosting platform
2. Set `NODE_ENV=production`
3. Use production MongoDB cluster
4. Enable HTTPS
5. Deploy with `npm start`

### Frontend Deployment (Vercel/Netlify)
1. Build production bundle:
   ```powershell
   npm run build
   ```
2. Deploy `build` folder to hosting service
3. Set environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```
4. Configure redirects for client-side routing

## 🔒 Security Features
- JWT token-based authentication
- Password hashing with bcryptjs (salt rounds: 10)
- Protected admin routes
- Input validation with express-validator
- CORS configuration
- MongoDB injection protection via Mongoose

## 📱 Mobile Responsive
- Mobile-first design approach
- Touch-optimized buttons and inputs
- Responsive grid layouts
- QR scanner optimized for mobile cameras
- Works on iOS Safari, Android Chrome

## 🤝 Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 License
This project is licensed under the MIT License.

## 👤 Author
**Ankit Raj**
- GitHub: [@ankitraj8042](https://github.com/ankitraj8042)

## 🙏 Acknowledgments
- Built with React and Node.js
- QR code functionality powered by html5-qrcode and qrcode libraries
- MongoDB Atlas for database hosting

## 📞 Support
For issues and questions:
- Create an [Issue](https://github.com/ankitraj8042/SkipLine/issues)
- Pull requests welcome!

---

**Made with ❤️ for better queue management**
