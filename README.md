# 🎯 Client Lead Management System (Mini CRM)

A full-stack web application for managing client leads, tracking their status, and organizing follow-ups. Built with React, Node.js, Express, and MongoDB.

![CRM Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### Core Functionality
- 📋 **Lead Management** - Create, read, update, and delete leads
- 🔄 **Status Tracking** - Track leads through the sales pipeline (New → Contacted → Qualified → Converted/Lost)
- 📝 **Notes & Follow-ups** - Add detailed notes and track follow-up activities for each lead
- 🔍 **Advanced Filtering** - Filter leads by status, source, and search by name/email/company
- 📊 **Dashboard Analytics** - View key metrics and recent lead activity
- 🔐 **Secure Authentication** - JWT-based authentication with role-based access

### Technical Features
- ✅ RESTful API design
- ✅ Responsive UI for desktop and mobile
- ✅ Real-time status updates
- ✅ Input validation and error handling
- ✅ Secure password hashing
- ✅ MongoDB database with Mongoose ODM

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI framework
- **React Router** 6.20.0 - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express** 4.18.2 - Web framework
- **MongoDB** - Database
- **Mongoose** 8.0.0 - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/client-lead-crm.git
cd client-lead-crm
```

### 2. Install Dependencies

Install both server and client dependencies:

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

Or use the convenient script:

```bash
npm run install:all
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/lead-crm
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:3000
```

**Important:** Change the `JWT_SECRET` to a secure random string in production.

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows
mongod

# On macOS (using Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

### 5. Run the Application

**Development Mode (Recommended):**

Run both backend and frontend concurrently:

```bash
npm run dev:full
```

**Or run them separately:**

```bash
# Terminal 1 - Run backend server
npm run dev

# Terminal 2 - Run frontend
npm run client
```

**Production Mode:**

```bash
# Start backend
npm start

# Build and serve frontend (in client directory)
cd client
npm run build
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## 👤 Default Login

Create your first admin account by registering at `/register` or use the API:

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Lead Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/leads` | Get all leads (with filters) | Yes |
| GET | `/api/leads/:id` | Get single lead | Yes |
| POST | `/api/leads` | Create new lead | Yes |
| PUT | `/api/leads/:id` | Update lead | Yes |
| DELETE | `/api/leads/:id` | Delete lead | Yes |
| POST | `/api/leads/:id/notes` | Add note to lead | Yes |
| PATCH | `/api/leads/:id/status` | Update lead status | Yes |

### Query Parameters for GET /api/leads

- `status` - Filter by status (New, Contacted, Qualified, Converted, Lost)
- `source` - Filter by source (Website, Referral, Social Media, etc.)
- `search` - Search by name, email, or company
- `sortBy` - Sort results (newest, oldest, name)

### Example API Requests

**Create a Lead:**
```bash
POST http://localhost:5000/api/leads
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Acme Inc",
  "source": "Website",
  "status": "New",
  "value": 5000
}
```

**Add a Note:**
```bash
POST http://localhost:5000/api/leads/:leadId/notes
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "content": "Follow up next week regarding pricing"
}
```

## 📁 Project Structure

```
client-lead-crm/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable components
│       ├── context/         # React Context (State management)
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── App.js
│       └── index.js
├── server/                 # Express backend
│   ├── config/            # Configuration files
│   │   └── database.js
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   └── leadController.js
│   ├── middleware/        # Custom middleware
│   │   └── auth.js
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   └── Lead.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   └── leads.js
│   └── server.js         # Entry point
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🎨 Features Walkthrough

### Dashboard
- View key metrics (total leads, new leads, contacted, converted)
- Quick access to recent leads
- Visual statistics cards

### Lead Management
- **Create Lead:** Add new leads with contact information, source, and estimated value
- **Edit Lead:** Update lead details anytime
- **Delete Lead:** Remove leads with confirmation
- **Status Updates:** Quickly change lead status using dropdown
- **Filter & Search:** Find leads using multiple filters and search

### Notes & Follow-ups
- Add unlimited notes to each lead
- Track conversation history
- Plan follow-up activities
- Timestamps and author tracking

## 🔒 Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🎯 Skills Demonstrated

This project demonstrates proficiency in:

- ✅ Full-stack JavaScript development
- ✅ RESTful API design and implementation
- ✅ MongoDB database design and queries
- ✅ React state management with Context API
- ✅ JWT authentication and authorization
- ✅ CRUD operations
- ✅ Responsive UI design
- ✅ Error handling and validation
- ✅ Git version control
- ✅ Project documentation

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Create a new app on your platform
2. Set environment variables
3. Deploy from GitHub or using CLI

### Frontend Deployment (Vercel/Netlify)

1. Build the React app: `cd client && npm run build`
2. Deploy the `build` folder
3. Update API URL in environment variables

### Database (MongoDB Atlas)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in `.env`

## 📝 Future Enhancements

Potential features to add:

- [ ] Email notifications for follow-ups
- [ ] Export leads to CSV
- [ ] Advanced analytics and reporting
- [ ] Calendar integration for scheduling
- [ ] File attachments for leads
- [ ] Multi-user collaboration
- [ ] Activity timeline
- [ ] Custom fields and tags
- [ ] Email templates
- [ ] Integration with email services

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- React documentation
- Express.js documentation
- MongoDB documentation
- Open source community

## 📞 Support

If you have any questions or need help with setup, please open an issue in the GitHub repository.

---

**Made with ❤️ for the developer community**