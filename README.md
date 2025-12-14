<div align="center">
  <img width="1200" alt="AgriVision AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AgriVision AI

AgriVision AI is a comprehensive web platform designed to empower Indian farmers with data-driven insights for millet cultivation. The application provides AI-powered tools for land analysis, crop disease detection, yield estimation, and access to information about government schemes.

## Architecture

The application is built on a three-part architecture:

1.  **React Frontend:** A modern, responsive user interface built with React, TypeScript, and Vite.
2.  **Node.js Backend:** An Express.js server that provides a REST API for core application functionality and integrates with the Groq AI services.
3.  **Python Model Server:** A Flask-based microservice that serves a PyTorch machine learning model for crop disease detection.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [Python](https://www.python.org/) (v3.8 or higher recommended)
-   `pip` for Python package management

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

Install the required packages for both the Node.js server and the Python model server.

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

*Note: You may need to create a `requirements.txt` file for the Python server.*

### 3. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```
# Groq API Key
GROQ_API_KEY=your_groq_api_key

# MongoDB Connection String
MONGODB_URI=your_mongodb_connection_string
```

Replace `your_groq_api_key` and `your_mongodb_connection_string` with your actual credentials.

### 4. Run the Application

The `dev` script uses `concurrently` to run all three services at once:

```bash
npm run dev
```

This will start:
- The **React frontend** on `http://localhost:5173` (or the next available port)
- The **Node.js backend** on `http://localhost:3000`
- The **Python model server** on `http://localhost:5000`

You can now access the application in your browser at the frontend URL.

### 5. Build for Production

To create a production build of the frontend, run:

```bash
npm run build
```

This will generate a `dist` directory with the optimized static assets. The Node.js server is already configured to serve these files when run in production mode.

To start the application in production:
```bash
npm start
```
