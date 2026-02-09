# Passenger Management System - Client

React frontend for passenger management CRUD operations.

## Installation

```bash
npm install
```

## Running the Client

```bash
npm start
```

The app will start on `http://localhost:3000`

## Features

- Add new passenger records
- View all passengers in a table format
- Search passengers by name, passport, registration no, or code
- Sort passengers by any column
- Edit existing passenger information
- Delete passenger records
- Real-time form validation
- Responsive design

## Input Fields

The form includes the following fields organized by sections:

### Personal Information
- Passenger Name (required)
- Passport (required)
- Registration No (required)
- Registration Date
- Code
- Sender

### Status & Documents
- Wafid Status (Pending, Approved, Rejected, On Hold)
- Slip File Submit (checkbox)
- Report (text area)
- Unfit Comment (text area)

### Financial Information
- Slip Payment Receive
- Commission
- Slip Payment Send
- Profit Margin

### Notes
- Remark

## API Integration

The client connects to the backend API at `http://localhost:5000/api/passengers`

Make sure the backend server is running before starting the React app.
