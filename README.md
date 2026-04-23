# Student Grievance Management System

This is a simple full-stack application built for the MSE-2 examination. It allows students to register, login, and manage their grievances.

## Features
- Student registration and login (JWT based)
- Submit, view, update, and delete grievances
- Search grievances by title
- Protected dashboard routes

## How to run

### 1. Backend
- Go to the backend folder: `cd backend`
- Install dependencies: `npm install`
- Create a `.env` file and add your `MONGO_URI` and `JWT_SECRET`.
- Start the server: `npm run dev`

### 2. Frontend
- Go to the frontend folder: `cd frontend`
- Install dependencies: `npm install`
- Start the app: `npm run dev`

## Deployment
- Backend can be deployed on Render as a Web Service.
- Frontend can be deployed on Render as a Static Site.
- Make sure to update the API URL in the frontend pages if you deploy the backend.
