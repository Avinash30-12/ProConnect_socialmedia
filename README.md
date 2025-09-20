# ProConnect_socialmedia

A full-stack LinkedIn-like project built with **Next.js** for the frontend and **Node.js/Express + MongoDB** for the backend.

---

## 📂 Project Structure
LinkdinFullStack/
│── frontend/ # Next.js frontend
│ ├── package.json # Frontend dependencies
│ ├── next.config.mjs # Next.js configuration
│ ├── eslint.config.mjs
│ ├── jsconfig.json
│ └── node_modules/
│
│── backend/ # Node.js backend (Express + MongoDB)
│ ├── server.js # Main server entry
│ ├── package.json # Backend dependencies
│ ├── api.http # API testing file
│ ├── models/ # Mongoose models (User, Post, Profile, etc.)
│ ├── controllers/ # Express controllers
│ ├── uploads/ # Uploaded files/images
│ └── .env # Environment variables

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Node.js (>= 18)
- MongoDB (local or cloud e.g. MongoDB Atlas)
- npm or yarn

---

### 2️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
The frontend will be available at http://localhost:3000

3️⃣ Backend Setup
bash
Copy code
cd backend
npm install
npm start
The backend server will start at http://localhost:8080 (or the port defined in .env).

4️⃣ Environment Variables
Create a .env file inside backend/:

ini
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

🛠️ Scripts
Frontend
npm run dev – Start development server

npm run build – Build for production

npm start – Start production server

npm run lint – Run linter

Backend
npm start – Start Express server

npm run dev – Start with nodemon (if configured)

