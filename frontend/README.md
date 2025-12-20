# Frontend - Digital Queue Management System

React-based frontend for the queue management system.

## Quick Start

1. Install dependencies:
   ```powershell
   npm install
   ```

2. Start development server:
   ```powershell
   npm start
   ```

3. Open http://localhost:3000

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.js       # Navigation bar
│   └── QueueCard.js    # Queue display card
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── QueueList.js    # Browse queues
│   ├── QueueDetails.js # View queue details
│   ├── JoinQueue.js    # Join form
│   ├── MyQueue.js      # Track position
│   ├── AdminDashboard.js
│   ├── CreateQueue.js
│   └── ManageQueue.js
├── services/
│   └── api.js          # API integration
├── styles/             # CSS files
├── App.js             # Main app component
└── index.js           # Entry point
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Landing page |
| `/queues` | QueueList | Browse all queues |
| `/queue/:id` | QueueDetails | View queue details |
| `/queue/:id/join` | JoinQueue | Join a queue |
| `/my-queue` | MyQueue | Track your position |
| `/admin` | AdminDashboard | Admin overview |
| `/admin/create-queue` | CreateQueue | Create new queue |
| `/admin/manage/:id` | ManageQueue | Manage queue |

## Key Features

### For Users
1. **Browse Queues**: View all available queues with filters
2. **Join Queue**: Simple form to join any queue
3. **Track Position**: Real-time position tracking
4. **Cancel Entry**: Easy cancellation option

### For Admins
1. **Dashboard**: Overview of all queues
2. **Create Queue**: Set up new queues
3. **Manage Queue**: 
   - Call next person
   - Mark as served/missed
   - View waiting list
   - Real-time statistics

## API Integration

The app uses Axios for API calls. All API functions are in `src/services/api.js`.

Example usage:
```javascript
import { queueAPI } from '../services/api';

// Get all queues
const queues = await queueAPI.getAllQueues();

// Join queue
const result = await queueAPI.joinQueue(queueId, userData);
```

## State Management

- React hooks (useState, useEffect)
- LocalStorage for queue entry tracking
- URL parameters for navigation

## Styling

- Modern CSS3 with flexbox and grid
- Responsive design (mobile-first)
- Gradient themes and smooth animations
- Consistent color palette

### Color Scheme
- Primary: Purple gradient (#667eea to #764ba2)
- Success: Green (#28a745)
- Danger: Red (#dc3545)
- Background: Light gray (#f5f7fa)

## Auto-Refresh

- Queue details: Every 10 seconds
- Admin dashboard: Every 5 seconds
- My queue status: On demand

## Local Storage

The app stores current queue entry:
```javascript
{
  queueId: string,
  entryId: string,
  phone: string,
  queueName: string
}
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Build for Production

```powershell
npm run build
```

Creates optimized production build in `build/` folder.

## Environment Variables

Create `.env.local` for custom API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Development Tips

1. **Component Organization**
   - Keep components focused and reusable
   - Separate logic from presentation
   - Use props for data passing

2. **Styling**
   - Each component has its own CSS file
   - Common styles in index.css
   - Use CSS variables for consistency

3. **API Calls**
   - Always handle loading states
   - Show error messages to users
   - Use try-catch for async operations

4. **Performance**
   - Lazy load components if needed
   - Optimize images
   - Minimize re-renders

## Common Issues

**API not connecting**
- Ensure backend is running on port 5000
- Check proxy setting in package.json

**Styles not loading**
- Verify CSS import paths
- Clear browser cache

**Queue not updating**
- Check browser console for errors
- Verify API responses
- Ensure proper state management
