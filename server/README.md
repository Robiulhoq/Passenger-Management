# Passenger Management API

Backend API for passenger management CRUD operations built with Node.js and Express.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file with:
```
MONGODB_URI=mongodb://localhost:27017/passenger_management
PORT=5000
NODE_ENV=development
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

- `GET /api/passengers` - Get all passengers
- `GET /api/passengers/:id` - Get passenger by ID
- `GET /api/passengers/search?query=` - Search passengers
- `POST /api/passengers` - Create new passenger
- `PUT /api/passengers/:id` - Update passenger
- `DELETE /api/passengers/:id` - Delete passenger

## Passenger Fields

- slNo: Serial number
- passengerName: Name of passenger
- passport: Passport number
- registrationNo: Registration number
- report: Report details
- wafidStatus: Wafid status (Approved/Pending/Rejected/On Hold)
- unfitCom: Unfit comment
- registrationDate: Date of registration
- slipFileSubmit: Slip file submitted (true/false)
- sender: Sender name
- slipPaymentReceive: Payment received amount
- commission: Commission amount
- slipPaymentSend: Payment sent amount
- profitMargin: Profit margin
- code: Passenger code
- remark: Remarks
