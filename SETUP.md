# Money Transfer Comparison Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB (connection string in .env file)

## Installation

1. Clone the repository
2. Install server dependencies:
   ```
   npm install
   ```
3. Install client dependencies:
   ```
   cd client
   npm install
   cd ..
   ```

## Running the Application (Windows)

### Option 1: Using the dev.bat file
Simply run the `dev.bat` file:
```
.\dev.bat
```
This will:
1. Stop any existing Node.js processes
2. Start the server on port 5000
3. Start the client on port 3000

### Option 2: Running manually
1. Start the server:
   ```
   npm run server
   ```
2. In a separate terminal, start the client:
   ```
   cd client
   npm start
   ```

### Access the application
Once both the server and client are running, access the application at:
```
http://localhost:3000
```

## Troubleshooting

### API Connection Issues
- If you see "Connection Refused" errors in the console, make sure the server is running on port 5000.
- The client is configured to proxy API requests to the server via the "proxy" setting in client/package.json.
- All API requests from the client should use relative URLs (e.g., `/api/rates/test`) rather than absolute URLs (e.g., `http://localhost:5000/api/rates/test`).

### Port In Use
If you see "EADDRINUSE" errors:
1. Find the process using the port:
   ```
   netstat -ano | findstr :5000
   ```
2. Kill the process:
   ```
   taskkill /F /PID <process_id>
   ```

### MongoDB Connection Issues
If the server can't connect to MongoDB, check your connection string in the .env file. 