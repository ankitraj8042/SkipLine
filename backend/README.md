# Backend - Digital Queue Management System

Express.js backend for the queue management system with MongoDB integration.

## Quick Start

1. Install dependencies:
   ```powershell
   npm install
   ```

2. Create `.env` file (copy from `.env.example`):
   ```powershell
   Copy-Item .env.example .env
   ```

3. Update `.env` with your MongoDB Atlas credentials:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/queueDB
   JWT_SECRET=your_random_secret_key
   ```

4. Start the server:
   ```powershell
   npm run dev
   ```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret for JWT tokens | random_secret_123 |
| NODE_ENV | Environment mode | development/production |

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Queue Endpoints

**Get all queues**
```
GET /queues
Response: Array of queue objects
```

**Get queue details**
```
GET /queues/:id
Response: { queue: {}, entries: [] }
```

**Join queue**
```
POST /queues/:id/join
Body: {
  userName: string,
  userPhone: string,
  userEmail?: string,
  notes?: string
}
Response: { entry: {}, queueName: string }
```

**Check position**
```
GET /queues/:queueId/position/:phone
Response: { entry: {}, peopleAhead: number, queue: {} }
```

**Cancel entry**
```
DELETE /queues/:queueId/cancel/:entryId
Response: { message: string }
```

### Admin Endpoints

**Create queue**
```
POST /admin/queues
Body: {
  name: string,
  description: string,
  organizationType: 'clinic' | 'shop' | 'college' | 'other',
  maxCapacity: number,
  estimatedTimePerPerson: number,
  organizerName: string,
  organizerEmail: string
}
```

**Call next person**
```
POST /admin/queues/:id/call-next
Response: { entry: {}, message: string }
```

**Mark as served**
```
POST /admin/entries/:id/served
Response: { entry: {}, message: string }
```

**Mark as missed**
```
POST /admin/entries/:id/missed
Response: { entry: {}, message: string }
```

**Get statistics**
```
GET /admin/queues/:id/stats
Response: { queue: {}, stats: {} }
```

## Database Models

### Queue
- name, description
- organizationType, isActive
- maxCapacity, estimatedTimePerPerson
- organizerName, organizerEmail
- currentServingPosition, totalServed

### QueueEntry
- queueId, userName, userPhone, userEmail
- position, status (waiting/called/served/missed/cancelled)
- estimatedWaitTime
- joinedAt, calledAt, servedAt

### User
- name, email, phone
- password (hashed)
- role (user/admin/organizer)

## Error Handling

All errors return JSON:
```json
{
  "message": "Error description"
}
```

Status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

## Security

- CORS enabled for frontend
- JWT authentication for protected routes
- Password hashing with bcryptjs
- Environment variables for secrets

## Development Tips

- Use Postman or Thunder Client for API testing
- Check MongoDB Atlas dashboard for data
- Monitor console for error logs
- Use nodemon for auto-restart during development
