🌍 TravelPath - Smart Travel Route Planner
Live Demo: https://destination-recommendation-platform-3.onrender.com

TravelPath is a modern, full-stack web application that helps travelers discover and plan optimal routes between destinations with multiple transport options, pricing, and station details across Europe and India.

🚀 Live Application
🌐 Production URL: https://destination-recommendation-platform-3.onrender.com

🎯 Quick Test Routes
Try these popular routes on the live site:

Europe: Paris → Rome, Berlin → Prague, London → Paris

India: Delhi → Mumbai, Bangalore → Chennai, Mumbai → Goa

Search: Type any city name for smart suggestions

✨ Features
🗺️ Smart Route Planning
Multi-Transport Options: Compare trains, buses, flights, and cars

Real-time Pricing: Cost breakdowns for each station and transport type

Interactive Visualization: Visual journey maps with station timing

Route Comparison: Side-by-side comparison of multiple routes

🌍 Global Coverage
European Routes: Paris, Rome, Berlin, London, Barcelona, and more

Indian Routes: Delhi, Mumbai, Bangalore, Chennai, Goa, and major cities

Smart Search: Autocomplete with city and country suggestions

🔐 User Experience
Secure Authentication: JWT-based login/signup system

Search History: Track and revisit your recent searches

Responsive Design: Perfect experience on all devices

Real-time Feedback: Loading states and error handling

🎨 Modern Interface
Beautiful UI: Gradient backgrounds and smooth animations

Intuitive Navigation: Easy-to-use search and route selection

Professional Design: Tailwind CSS with modern components

🛠 Tech Stack
Frontend
React 18 - Modern React with hooks

React Router DOM - Client-side routing

Tailwind CSS - Utility-first CSS framework

Context API - State management

Axios/Fetch - API communication

Backend
Node.js & Express.js - Server framework

MongoDB - NoSQL database

Mongoose - MongoDB object modeling

JWT - Authentication

bcryptjs - Password security

CORS - Cross-origin requests

Deployment
Render - Full-stack deployment platform

MongoDB Atlas - Cloud database

Environment Variables - Secure configuration

📸 Application Preview
🏠 Homepage
Beautiful hero section with gradient background

Smart search box with autocomplete

Feature showcase and testimonials

Popular destinations grid

🔍 Search & Results
Smart Autocomplete: City and country suggestions as you type

Multiple Routes: Different path options with varying stops

Transport Options: Train, bus, flight, and car comparisons

Price Breakdown: Cost at each station with total calculation

🛤️ Route Visualization
Interactive Path: Visual station-to-station journey

Timing Information: Arrival/departure times at each stop

Price Progression: Cumulative cost throughout the journey

Transport Details: Comfort levels and amenities

🚀 Getting Started
Prerequisites
Node.js (v14 or higher)

MongoDB (local or Atlas)

Modern web browser

Local Development
Clone the repository

bash
git clone <your-repo-url>
cd travelpath
Setup Backend

bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
Setup Frontend


cd ../frontend
npm install
cp .env.example .env
# Configure your environment variables
Environment Configuration

Backend .env:

env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
Frontend .env:

env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
Run the Application


# Backend (Terminal 1)
cd backend && npm run dev

# Frontend (Terminal 2)  
cd frontend && npm start
Access the Application

Frontend: http://localhost:3000

Backend API: http://localhost:5000

📊 API Documentation
Authentication Endpoints
POST /api/auth/register - User registration

POST /api/auth/login - User login

GET /api/auth/profile - Get user profile

Destination Endpoints
GET /api/destinations/search?query=par - Search destinations

GET /api/destinations/paths?from=Paris&to=Rome - Find routes

GET /api/destinations/paths/:id - Get route details

GET /api/destinations/popular - Popular destinations

User Endpoints
GET /api/users/profile - User profile

POST /api/users/search-history - Save search

GET /api/users/search-history - Get search history

GET /api/users/statistics - User statistics

🎯 Usage Examples
1. Planning a European Trip
text
Search: "Paris" to "Rome"
Results: 
- Route 1: Paris → Lyon → Nice → Rome (Train: $299, 12h 30m)
- Route 2: Paris → Geneva → Milan → Florence → Rome (Train: $380, 14h 20m)
2. Indian Journey Planning
text
Search: "Delhi" to "Mumbai"
Results:
- Rajdhani Express: Delhi → Jaipur → Ahmedabad → Mumbai ($1200, 18h 30m)
- Flight: Direct ($3500, 2h 15m)
- Bus: Volvo AC ($1800, 22h 00m)
3. Quick City Connections
text
Search: "Bangalore" to "Chennai"
Results:
- Shatabdi Express: $400, 5h 30m
- Flight: $2500, 1h 15m
- Bus: $600, 6h 30m
🚀 Deployment
The application is deployed on Render with:

Frontend Deployment
Platform: Render Static Site

Build Command: npm run build

Publish Directory: build

Backend Deployment
Platform: Render Web Service

Environment: Node.js

Build Command: npm install

Start Command: node server.js

Database
MongoDB Atlas - Cloud database service

Automated Backups - Data security

Scalable - Handles multiple concurrent users

🔧 Configuration
Environment Variables
env
# Backend
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelpath
JWT_SECRET=your-super-secure-jwt-secret
NODE_ENV=production

# Frontend
REACT_APP_API_URL=https://your-backend.onrender.com/api
🤝 Contributing
We welcome contributions! Please feel free to submit issues and enhancement requests.

Development Process
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🆘 Support
If you encounter any issues or have questions:

Check the live demo: https://destination-recommendation-platform-3.onrender.com

Create an issue on GitHub

Contact support through the application feedback form

🙏 Acknowledgments
Icons and emojis from Twemoji

UI inspiration from modern travel platforms

MongoDB for reliable database service

Render for seamless deployment

⭐ If you find this project helpful, please give it a star on GitHub!
