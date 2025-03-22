# MovieRater - Movie Rating Website

MovieRater is a full-stack web application that allows users to browse movies, write reviews, and rate films. Users can also like other users' reviews and admins can manage all content.

## Features

- User authentication (signup, login)
- Browse movies with filtering and pagination
- View movie details and reviews
- Add, edit, and delete your own reviews
- Like/unlike other users' reviews
- Sort reviews by popularity or date
- Admin panel to manage movies and reviews

## Tech Stack

- Frontend: React, Bootstrap, Formik, React Router
- Backend: Node.js, Express
- Database: PostgreSQL
- Authentication: JWT

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL

### Database Setup on Mac

1. Install PostgreSQL (if not already installed):
   ```
   brew install postgresql
   ```

2. Start PostgreSQL service:
   ```
   brew services start postgresql
   ```

3. Create a database:
   ```
   psql postgres
   CREATE DATABASE movierating;
   CREATE USER movieuser WITH ENCRYPTED PASSWORD 'Ritesh@123';
   GRANT ALL PRIVILEGES ON DATABASE movierating TO movieuser;
   \q
   ```

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```
   PORT=5001
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRES_IN=30d
   DATABASE_URL=postgres://movieuser:Ritesh@123@localhost:5432/movierating
   ```
   
   Note: If you encounter database connection issues due to special characters in the password, use the URL-encoded version:
   ```
   DATABASE_URL=postgres://movieuser:Ritesh%40123@localhost:5432/movierating
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```
   REACT_APP_API_URL=http://localhost:5001
   ```

4. Start the React app:
   ```
   npm start
   ```

## Running the Application

You'll need to run both the server and client in separate terminal windows:

### Terminal 1: Server
```bash
cd server
npm run dev
```

### Terminal 2: Client
```bash
cd client
npm start
```

## Adding Movies to the Database

The application needs movies in the database to function properly. You can add movies using the provided script:

1. Create an admin user (if you haven't already):
   ```bash
   curl -X POST http://localhost:5001/api/users/create-admin \
     -H "Content-Type: application/json" \
     -d '{"name":"Admin User","email":"admin@example.com","password":"Admin123"}'
   ```

2. Create a script to add movies:
   ```bash
   # Navigate to the project root
   cd /path/to/your/project/root
   
   # Create the script file
   touch add-movies.js
   
   # Install axios (if needed)
   npm install axios
   ```

3. Open the add-movies.js file and paste the script provided in the documentation.

4. Run the script (with the server running):
   ```bash
   node add-movies.js
   ```

## Project Structure

## Usage

- Register a new account or login with existing credentials
- Browse movies on the homepage
- Click on a movie to view details and reviews
- Add your own review if logged in
- Like other users' reviews
- Admins can access the admin panel to manage content

## Deployment

The application can be deployed on Vercel:

1. Frontend:
   - Add environment variables in Vercel project settings
   - Connect your GitHub repository and deploy

2. Backend:
   - Deploy to Vercel using serverless functions or to a service like Heroku
   - Set up environment variables in the deployment platform

## License

This project is licensed under the MIT License. 