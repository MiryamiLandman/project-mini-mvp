
---

# AI Learning Platform - Mini MVP

This project is a mini learning platform that allows users to explore various topics through AI-generated lessons. Users can register, select learning categories, and receive personalized educational content powered by OpenAI. 

## 🚀 Overview

The platform is built as a production-grade system with a clear separation of concerns, featuring a REST API backend and a responsive React dashboard. 

## 🛠 Technologies Used

### Backend

* 
**Node.js & Express**: Server framework. 


* 
**TypeScript**: For type-safe development. 


* 
**MongoDB & Mongoose**: Database and ODM for storing users, categories, and prompts. 


* 
**OpenAI API**: To generate educational content. 


* 
**JWT (JSON Web Token)**: For secure user authentication. 


* 
**Winston/Logger**: For systematic error tracking. 



### Frontend

* 
**React**: Modern UI library. 


* 
**Vite**: Fast build tool and development server. 


* 
**React Router**: For navigation between Dashboard, History, and Admin pages. 


* 
**CSS**: Custom styling for all components. 



### DevOps

* 
**Docker & Docker Compose**: To containerize the application and manage services. 



## 📂 Project Structure

The project follows a modular architecture: 

* 
`/backend`: Contains `models`, `controllers`, `services`, `routes`, `middleware`, and `config`. 


* 
`/frontend`: Contains `components`, `pages`, `services`, and `context`. 


* 
`/docker`: Configuration for containerization. 



## ⚙️ Setup and Installation

### Prerequisites

* Node.js installed locally.
* Docker Desktop (optional, for running with containers).
* OpenAI API Key.

### Local Development

1. **Clone the repository**
2. **Backend Setup:**
```bash
cd backend
npm install

```


Create a `.env` file in the `backend` folder: 


```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_api_key_here
JWT_SECRET=your_secret_key

```


Run the seed script to populate categories: 


```bash
npm run seed

```


Start the server: 


```bash
npm run dev

```


3. **Frontend Setup:**
```bash
cd frontend
npm install
npm start
[cite_start]

```



## 📝 Assumptions & Features

* 
**Authentication**: Users must register/login to access the learning dashboard. 


* 
**Admin Access**: A dedicated admin dashboard allows viewing all users and their complete learning history. 


* 
**Error Handling**: Centralized error handling middleware is implemented on the backend. 


* 
**Validation**: Input validation is performed using custom middleware before reaching the controllers. 



## 📖 Example Use Case

1. 
**Register**: A user creates an account. 


2. 
**Select Topic**: User chooses a category (e.g., Science) and sub-category (e.g., Space). 


3. 
**Prompt**: User asks "Teach me about black holes." 


4. 
**Learn**: The AI returns a lesson, which is automatically saved to the user's history for future reference. 



---

*Developed as part of the Practec Internship assessment.*
