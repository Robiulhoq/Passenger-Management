# Passenger Management System - MERN Stack

A complete MERN (MongoDB, Express, React, Node.js) stack application for managing passenger records with full CRUD functionality.

## Project Structure

```
passenger-management-system/
├── server/                 # Backend (Node.js + Express)
│   ├── models/
│   │   └── Passenger.js   # MongoDB Schema
│   ├── controllers/
│   │   └── passengerController.js  # Business logic
│   ├── routes/
│   │   └── passengerRoutes.js      # API endpoints
│   ├── server.js          # Main server file
│   ├── .env               # Environment variables
│   ├── package.json       # Dependencies
│   └── README.md          # Backend documentation
│
└── client/                # Frontend (React)
    ├── public/
    │   └── index.html     # HTML template
    ├── src/
    │   ├── components/
    │   │   ├── PassengerForm.js     # Form component
    │   │   ├── PassengerForm.css
    │   │   ├── PassengerList.js     # List component
    │   │   └── PassengerList.css
    │   ├── services/
    │   │   └── passengerService.js  # API calls
    │   ├── App.js         # Main component
    │   ├── App.css
    │   ├── index.js       # Entry point
    │   ├── index.css
    │   └── README.md      # Frontend documentation
    ├── package.json       # Dependencies
    └── README.md
```

## Features

✅ **Create** - Add new passenger records
✅ **Read** - View all passengers with sorting and searching
✅ **Update** - Edit existing passenger information
✅ **Delete** - Remove passenger records
✅ **Search** - Find passengers by name, passport, registration no, or code
✅ **Sort** - Sort by any column
✅ **Responsive Design** - Works on desktop and mobile
✅ **Form Validation** - Client and server-side validation
✅ **Modern UI** - Clean and intuitive interface

## Input Fields

All input fields for passenger records:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Passenger Name | Text | Yes | Name of the passenger |
| Passport | Text | Yes | Unique passport number |
| Registration No | Text | Yes | Registration number |
| Report | Text Area | No | Report details |
| Wafid Status | Dropdown | No | Status: Pending, Approved, Rejected, On Hold |
| UNFIT COM | Text Area | No | Unfit comment |
| Registration Date | Date | No | Date of registration |
| Slip File Submit | Checkbox | No | Whether slip file is submitted |
| Sender | Text | No | Name of sender |
| Slip Payment Receive | Number | No | Payment received amount |
| Commission | Number | No | Commission amount |
| Slip Payment Send | Number | No | Payment sent amount |
| Profit Margin | Number | No | Profit margin |
| Code | Text | No | Passenger code |
| Remark | Text Area | No | Additional remarks |

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (running locally or connection string)

## Installation

### 1. Install Backend Dependencies

```bash
cd server
npm install
```

### 2. Install Frontend Dependencies

```bash
cd client
npm install
```

## Configuration

### Backend Setup

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/passenger_management
PORT=5000
NODE_ENV=development
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/passenger_management
PORT=5000
NODE_ENV=development
```

## Running the Application

### Development Mode (Terminal 1 - Backend)

```bash
cd server
npm run dev
```

The backend will run on `http://localhost:5000`

### Development Mode (Terminal 2 - Frontend)

```bash
cd client
npm start
```

The frontend will run on `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm start
```

## API Endpoints

All endpoints are prefixed with `/api/passengers`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all passengers |
| GET | /:id | Get passenger by ID |
| GET | /search?query= | Search passengers |
| POST | / | Create new passenger |
| PUT | /:id | Update passenger |
| DELETE | /:id | Delete passenger |

## Example API Requests

### Create Passenger
```bash
POST /api/passengers
Content-Type: application/json

{
  "passengerName": "John Doe",
  "passport": "AB123456",
  "registrationNo": "REG001",
  "code": "P001",
  "wafidStatus": "Approved",
  "slipPaymentReceive": 500,
  "commission": 50,
  "profitMargin": 450
}
```

### Update Passenger
```bash
PUT /api/passengers/[id]
Content-Type: application/json

{
  "wafidStatus": "Approved",
  "slipPaymentReceive": 600
}
```

### Search Passengers
```bash
GET /api/passengers/search?query=John
```

## Database Schema

### Passenger Document

```javascript
{
  _id: ObjectId,
  slNo: Number,
  passengerName: String (required),
  passport: String (required, unique),
  registrationNo: String (required),
  report: String,
  wafidStatus: String (enum: ["Approved", "Pending", "Rejected", "On Hold"]),
  unfitCom: String,
  registrationDate: Date,
  slipFileSubmit: Boolean,
  sender: String,
  slipPaymentReceive: Number,
  commission: Number,
  slipPaymentSend: Number,
  profitMargin: Number,
  code: String,
  remark: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or connection string is correct
- Check `.env` file for `MONGODB_URI`

### Port Already in Use
- Backend default: 5000
- Frontend default: 3000
- Change ports in `.env` and proxy settings if needed

### CORS Error
- Ensure backend is running before frontend
- Check CORS configuration in `server.js`

### Form Not Submitting
- Check browser console for errors
- Verify backend server is running
- Check network tab in developer tools

## Technologies Used

- **Frontend**: React 18, CSS3, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Database**: MongoDB
- **Package Manager**: npm
- **Development**: Nodemon (auto-reload)

## License

MIT

## Author

Passenger Management System Team

## Contact

For issues or questions, please create an issue in the repository.
