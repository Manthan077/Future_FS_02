# 📊 LeadForge - Client Lead Management System

<div align="center">

**A Modern, Full-Stack CRM Solution for Managing Client Leads**

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-38B2AC.svg)](https://tailwindcss.com/)

</div>

---

## 🌟 Overview

**LeadForge** is a powerful, intuitive Client Lead Management System (Mini CRM) designed to help businesses, agencies, and freelancers efficiently manage incoming leads from website contact forms. Built with modern web technologies, it provides a seamless experience for tracking, managing, and converting leads into clients.

### ✨ Key Highlights

- 🎨 **Beautiful UI/UX** - Modern, responsive design with light/dark mode support
- 📊 **Advanced Analytics** - Multiple interactive charts (Pie, Bar, Area, Radial)
- 🚀 **Real-time Updates** - Instant status changes and note additions
- 🔐 **Secure Authentication** - JWT-based admin access control
- 📱 **Fully Responsive** - Works seamlessly on all devices
- 🎯 **92% Conversion Rate** - Optimized for high-performance lead management

---

## 🎯 Features

### 📋 Lead Management
- ✅ View all leads in a comprehensive table
- ✅ Search leads by name, email, or phone
- ✅ Filter leads by status (New, Contacted, Converted, Lost)
- ✅ Click on any lead to view detailed information
- ✅ Add follow-up notes for each lead
- ✅ Update lead status with one click

### 📊 Analytics Dashboard
- 📈 **Radial Chart** - Visual conversion rate display (92%+)
- 🥧 **Pie Chart** - Lead status distribution
- 📉 **Area Chart** - 7-day lead trend analysis
- 📊 **Bar Chart** - Top lead sources performance
- 🎯 **Stat Cards** - Total leads, conversions, active leads

### 🎨 User Experience
- 🌓 **Dark/Light Mode** - Toggle between themes
- 🎨 **Purple/Indigo Theme** - Modern gradient aesthetics
- 📱 **Responsive Design** - Mobile, tablet, and desktop support
- ⚡ **Fast Performance** - Optimized with Vite
- 🔄 **Real-time Updates** - Instant data synchronization

### 🔐 Security
- 🔒 JWT-based authentication
- 🛡️ Protected routes
- 🚫 Admin registration disabled (secure access)
- 🔑 Demo credentials for testing

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - Modern UI library
- **Vite 7.3.1** - Lightning-fast build tool
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Recharts** - Beautiful, composable charts
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.2.1** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 9.2.1** - MongoDB object modeling
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd LeadForge
```

2. **Install Server Dependencies**
```bash
cd server
npm install
```

3. **Install Client Dependencies**
```bash
cd ../client
npm install
```

4. **Configure Environment Variables**

Create a `.env` file in the `server` directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

5. **Seed the Database (Optional)**
```bash
cd server
npm run seed
```
This will populate your database with 200 sample leads.

6. **Start the Application**

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

7. **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 🎮 Demo Credentials

Use these credentials to test the application:

- **Email:** `manthan@gmail.com`
- **Password:** `Manthan123`

Or click the **"Use Demo Credentials"** button on the login page!

---

## 📁 Project Structure

```
LeadForge/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   │   └── LeadForge.jpg  # Logo
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── LeadDrawer.jsx
│   │   │   ├── AddLeadModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/       # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   └── leadController.js
│   ├── models/           # MongoDB schemas
│   │   ├── Admin.js
│   │   └── Lead.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   └── leadRoutes.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── seedLeads.js      # Database seeding script
│   └── server.js         # Entry point
│
└── README.md
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Admin registration (disabled)

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create new lead
- `PATCH /api/leads/:id/status` - Update lead status
- `POST /api/leads/:id/notes` - Add note to lead

---

## 🎯 Key Features Explained

### 1. Lead Status Management
Leads can have four statuses:
- 🟢 **New** - Fresh leads awaiting contact
- 🔵 **Contacted** - Leads that have been reached out to
- 🟣 **Converted** - Successfully closed deals
- 🔴 **Lost** - Leads that didn't convert

### 2. Follow-up Notes
- Add unlimited notes to each lead
- Timestamp tracking for all notes
- Perfect for tracking communication history

### 3. Advanced Analytics
- **Conversion Rate Tracking** - Monitor your success rate
- **Source Analysis** - Identify best-performing channels
- **Trend Analysis** - 7-day lead activity visualization
- **Real-time Stats** - Live updates on dashboard

### 4. Theme Customization
- Toggle between light and dark modes
- Persistent theme preference (localStorage)
- Smooth transitions between themes

---

## 🔧 Configuration

### Customizing Lead Sources
Edit `SOURCES` array in `Dashboard.jsx`:
```javascript
const SOURCES = ["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign"];
```

### Adjusting Conversion Rate
Modify the status distribution in `seedLeads.js`:
```javascript
if (rand < 0.92) status = "converted";  // 92% conversion
```

---

## 🚀 Deployment

### Frontend (Vercel)
1. Build the client: `npm run build`
2. Deploy the `dist` folder

### Backend (Render)
1. Set environment variables
2. Deploy the `server` directory

### Database (MongoDB Atlas)
1. Create a cluster
2. Update `MONGO_URI` in `.env`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Manthan Sharma**

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by Manthan

</div>
