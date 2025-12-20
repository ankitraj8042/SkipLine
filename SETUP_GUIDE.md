# 🚀 Quick Setup Guide

Follow these steps to get your Digital Queue Management System up and running!

## ✅ Prerequisites Checklist

- [ ] Node.js installed (v14+) - Download from https://nodejs.org/
- [ ] MongoDB Atlas account - Sign up at https://www.mongodb.com/cloud/atlas
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/PowerShell access

## 📋 Step-by-Step Setup

### Step 1: MongoDB Atlas Setup (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or log in
3. Click "Build a Database" → Choose FREE tier
4. Select a cloud provider and region (closest to you)
5. Click "Create Cluster" (takes 3-5 minutes)
6. **Create Database User:**
   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `queueadmin`
   - Password: Create a strong password (save it!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

7. **Whitelist IP Address:**
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

8. **Get Connection String:**
   - Click "Database" in left menu
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://queueadmin:<password>@...`)
   - **Important:** Replace `<password>` with your actual password

### Step 2: Backend Setup (3 minutes)

1. Open PowerShell in your project folder

2. Navigate to backend:
   ```powershell
   cd "c:\5th SEM\WebDev\Project\backend"
   ```

3. Install dependencies:
   ```powershell
   npm install
   ```

4. Create environment file:
   ```powershell
   Copy-Item .env.example .env
   ```

5. Edit `.env` file (use Notepad or VS Code):
   ```powershell
   notepad .env
   ```

6. Update the file with your values:
   ```
   PORT=5000
   MONGODB_URI=your_connection_string_from_step1
   JWT_SECRET=my_super_secret_key_12345
   NODE_ENV=development
   ```
   **Replace** `your_connection_string_from_step1` with the actual MongoDB connection string!

7. Save and close the file

8. Start the backend server:
   ```powershell
   npm run dev
   ```

9. ✅ You should see:
   ```
   Server is running on port 5000
   MongoDB Connected: cluster0-xxxxx.mongodb.net
   ```

### Step 3: Frontend Setup (2 minutes)

1. Open a NEW PowerShell window

2. Navigate to frontend:
   ```powershell
   cd "c:\5th SEM\WebDev\Project\frontend"
   ```

3. Install dependencies:
   ```powershell
   npm install
   ```

4. Start the development server:
   ```powershell
   npm start
   ```

5. ✅ Your browser should automatically open to http://localhost:3000

## 🎉 Testing Your Application

### Test as a User:

1. Click "Find a Queue" in the navigation
2. You'll see no queues initially
3. Go to "Admin" → "Create Queue"
4. Fill in the form:
   - Queue Name: "Test Clinic Queue"
   - Description: "General consultation"
   - Type: Clinic
   - Max Capacity: 50
   - Time per Person: 5
   - Organizer Name: Your name
   - Organizer Email: Your email
5. Click "Create Queue"
6. Now go back to "Find Queues" - you'll see your queue!
7. Click "Join Queue"
8. Fill in your details and join
9. Click "My Queue" to see your position

### Test as an Admin:

1. Go to "Admin" in the navigation
2. Click "Manage" on your queue
3. Try these actions:
   - Click "Call Next Person" - calls the first person
   - Mark them as "Served" or "Missed"
   - See the statistics update in real-time

## 🔧 Troubleshooting

### Backend won't start?

**Error: "Cannot connect to MongoDB"**
- Check your connection string in `.env`
- Make sure you replaced `<password>` with actual password
- Verify IP address is whitelisted in MongoDB Atlas

**Error: "Port 5000 already in use"**
- Change PORT in `.env` to 5001
- Update proxy in frontend/package.json to match

**Error: "Module not found"**
- Run `npm install` again in backend folder

### Frontend won't start?

**Error: "Cannot connect to backend"**
- Make sure backend is running
- Check that backend is on port 5000
- Verify proxy setting in package.json

**Error: "Module not found"**
- Run `npm install` again in frontend folder

**Browser shows blank page**
- Check browser console (F12) for errors
- Try clearing browser cache
- Ensure no ad blockers are interfering

### Data not showing?

- Open MongoDB Atlas dashboard
- Click "Browse Collections"
- You should see `queues`, `queueentries` collections after creating a queue
- If not, check backend console for errors

## 💡 Quick Tips

1. **Keep both terminals open** - One for backend, one for frontend
2. **Don't close the terminals** - Both servers need to keep running
3. **Save your .env file** - You'll need it every time
4. **Check the console** - Errors usually show there first
5. **Use Chrome DevTools** - F12 to debug frontend issues

## 🎯 Next Steps

Once everything is working:

1. Create multiple queues for different purposes
2. Test joining queues from different browser tabs (simulate multiple users)
3. Experiment with the admin controls
4. Customize the styling in CSS files
5. Add more features as needed!

## 📞 Need Help?

Common commands:

```powershell
# Stop a server: Press Ctrl + C in the terminal

# Restart backend:
cd "c:\5th SEM\WebDev\Project\backend"
npm run dev

# Restart frontend:
cd "c:\5th SEM\WebDev\Project\frontend"
npm start

# Check if Node.js is installed:
node --version

# Check if npm is installed:
npm --version
```

## ✨ Success Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] MongoDB connection successful
- [ ] Can create a queue
- [ ] Can join a queue
- [ ] Can view queue status
- [ ] Can manage queue as admin

**All checked?** Congratulations! 🎉 Your Queue Management System is ready!

---

**Happy Coding!** 🚀
