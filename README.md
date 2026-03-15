# MSM Events Backend Server

Backend API server built with Node.js, Express, TypeScript, and MongoDB for MSM Events platform.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Morgan** - HTTP request logger
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root of the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/msm-events
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

3. **Start MongoDB:**
   Make sure MongoDB is running on your machine or use MongoDB Atlas.

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

### Ratings

- **POST** `/api/ratings` - Submit a new rating
  ```json
  {
    "email": "user@example.com",
    "rating": 5,
    "comments": "Great service!"
  }
  ```

- **GET** `/api/ratings` - Get all ratings (admin)

### Quiz

- **POST** `/api/quiz` - Submit quiz form
  ```json
  {
    "eventType": "Corporate event",
    "eventDate": "2024-12-25",
    "guestCount": "100-200",
    "budget": "$10,000-$20,000",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "details": "Additional details"
  }
  ```

- **GET** `/api/quiz` - Get all quiz submissions (admin)

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.ts      # MongoDB connection
│   ├── models/
│   │   ├── Rating.ts        # Rating schema
│   │   └── Quiz.ts          # Quiz schema
│   ├── routes/
│   │   ├── ratings.ts       # Rating routes
│   │   └── quiz.ts          # Quiz routes
│   └── index.ts             # Main server file
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

## Development

The server runs on port 5000 by default. Make sure to configure CORS to allow requests from your client application running on port 3000.
