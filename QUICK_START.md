## Quick Start Guide

### Prerequisites
- Node.js v14+
- MongoDB running locally or MongoDB Atlas connection string

### Installation & Setup

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Configure Backend:**
   - Edit `server/.env` with your MongoDB URI:
   ```env
   MONGODB_URI=mongodb://localhost:27017/passenger_management
   PORT=5000
   NODE_ENV=development
   ```

3. **Run in Development Mode (if concurrently is installed):**
   ```bash
   npm run dev
   ```

   Or run in separate terminals:
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd client
   npm start
   ```

4. **Access the Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/passengers

### Project Structure

```
├── server/        # Express backend with MongoDB
├── client/        # React frontend
├── package.json   # Root package.json
└── README.md      # Full documentation
```

### Main Features

✅ Add, view, edit, delete passenger records
✅ Search and sort functionality
✅ Form validation
✅ Responsive design
✅ RESTful API

### Common Commands

**Backend:**
```bash
cd server
npm run dev     # Development with auto-reload
npm start       # Production
npm install     # Install dependencies
```

**Frontend:**
```bash
cd client
npm start       # Start development server
npm build       # Build for production
npm install     # Install dependencies
```

### Troubleshooting

1. **Port already in use:** Change PORT in `server/.env` to 5001
2. **MongoDB connection failed:** Ensure MongoDB is running or correct connection string is set
3. **Dependencies not installed:** Run `npm run install-all` from root
4. **CORS error:** Ensure backend server is running before frontend

### Documentation

- [Backend Documentation](./server/README.md)
- [Frontend Documentation](./client/README.md)
- [Full README](./README.md)
