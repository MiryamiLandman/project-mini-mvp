
---

# AI Learning Platform - Mini MVP

This project is a mini learning platform that allows users to explore various topics through AI-generated lessons. Users can register, select learning categories, and receive personalized educational content powered by OpenAI.

## 🚀 Overview

The platform is built as a production-grade system with a clear separation of concerns, featuring a REST API backend and a responsive React dashboard.

## 🛠 Technologies Used

### Backend

* **Node.js & Express**: Server framework.
* **TypeScript**: For type-safe development.
* **MongoDB & Mongoose**: Database and ODM.
* **OpenAI API**: To generate educational content.
* **JWT**: For secure user authentication.
* **Winston**: For systematic logging.

### Frontend

* **React & Vite**: Modern UI library and fast build tool.
* **React Router**: For navigation.
* **CSS**: Custom styling for all components.

### DevOps

* **Docker & Docker Compose**: For containerization and service management.

## 📂 Project Structure

* `/backend`: Models, controllers, services, routes, middleware, and config.
* `/frontend`: Components, pages, services, and context.
* `/docker`: Container configuration.

## ⚙️ Setup and Installation

### Prerequisites

* Node.js installed locally.
* Docker Desktop (optional).
* OpenAI API Key.

### Local Development

1. **Clone the repository**
2. **Backend Setup:**
```bash
cd backend
npm install

```


Create a `.env` file in the `backend` folder based on the structure in `.env.example`:

```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_api_key_here
   JWT_SECRET=your_secret_key
   NODE_ENV=development

```

3. **Database Seeding & Admin Access:**
Run the seed script to populate categories and create the default admin user:
```bash
npm run seed

```


**Default Admin Credentials:**
* **Name:** Admin
* **Phone:** 123456789 (Use these credentials to log in as admin)


4. **Start the server:**
```bash
npm run dev

```


5. **Frontend Setup:**

```bash
   cd ../frontend
   npm install
   npm run start

```

## 📝 Assumptions & Features

* **Authentication**: Users must register/login to access the dashboard.
* **Admin Access**: A dedicated dashboard allows viewing all users and their history.
* **Error Handling**: Centralized middleware for systematic error management.

## 📖 Example Use Case

1. **Register**: User creates an account.
2. **Select Topic**: User chooses a category (e.g., Science).
3. **Prompt**: User asks "Teach me about black holes."
4. **Learn**: The AI returns a lesson, which is saved to the user's history.

---

