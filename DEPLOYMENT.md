# Deployment Instructions

## MongoDB Setup (Crucial for Production)

This application supports two modes for the database:
1. **Mock Mode (Default/Fallback)**: If no database connection string is provided, the app runs in-memory. Data is lost when the server restarts.
2. **MongoDB Atlas (Production)**: Stores data persistently.

### To use MongoDB Atlas in Production (e.g., Render, Vercel):

1. **Create a Cluster**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. **Network Access**: 
   - Go to **Network Access** in the sidebar.
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`).
   - *Reason*: Serverless platforms like Render use dynamic IP addresses, so you must whitelist all IPs.
3. **Get Connection String**:
   - Go to **Database** -> **Connect** -> **Drivers**.
   - Copy the connection string (e.g., `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`).
   - Replace `<username>` and `<password>` with your actual database user credentials.
4. **Set Environment Variable**:
   - In your deployment dashboard (e.g., Render):
   - Go to **Environment** settings.
   - Add a new variable:
     - Key: `MONGODB_URI`
     - Value: (Your connection string from step 3)

## Build Settings

If you are deploying to Render or similar platforms, use these settings:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Output Directory**: `dist` (This is where Vite builds the frontend)

## Troubleshooting

- **404 Errors**: If you see 404 errors for API routes, ensure your `server.js` is running and the `MONGODB_URI` is correct. If the DB connection fails, the server logs will show "Switching to OFFLINE MOCK MODE".
- **"User already exists"**: This means the database (or mock DB) already has a user with that phone number.
