# Quick Start Guide

This guide will help you get the CRM up and running in under 5 minutes!

## Prerequisites Check

Make sure you have these installed:
- [ ] Node.js (check: `node --version`)
- [ ] npm (check: `npm --version`)
- [ ] MongoDB (check: `mongod --version`)

## Installation Steps

### 1. Install Dependencies (2 minutes)

```bash
# From the project root
npm install
cd client && npm install && cd ..
```

### 2. Setup Environment (30 seconds)

The `.env` file is already configured for local development. Just verify it exists:

```bash
# Should see .env file in root directory
ls -la .env
```

### 3. Start MongoDB (30 seconds)

```bash
# Windows - Open a new terminal and run:
mongod

# Mac (if installed via Homebrew):
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### 4. Start the Application (1 minute)

```bash
# Option 1: Run everything with one command
npm run dev:full

# Option 2: Run backend and frontend separately
# Terminal 1:
npm run dev

# Terminal 2 (new terminal):
cd client && npm start
```

### 5. Open Your Browser

Navigate to: **http://localhost:3000**

## First Time Setup

1. Click "Create Account" (Register page)
2. Fill in your details:
   - Name: Your Name
   - Email: admin@example.com
   - Password: admin123 (or anything you like)
3. You're logged in! Start creating leads.

## Creating Your First Lead

1. Click "Leads" in the navigation
2. Click "+ Create Lead" button
3. Fill in the form:
   - Name: John Doe
   - Email: john@example.com
   - Phone: +1234567890
   - Company: Acme Inc
   - Source: Website
4. Click "Create Lead"
5. Click on the lead to view details and add notes!

## Troubleshooting

### MongoDB not starting?
```bash
# Make sure no other MongoDB instance is running
# Check if port 27017 is in use
```

### Port 3000 or 5000 already in use?
```bash
# Change ports in .env file (backend) and package.json (frontend)
```

### Dependencies not installing?
```bash
# Clear npm cache and try again
npm cache clean --force
npm install
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out the [API Documentation](README.md#-api-documentation)
- Explore all features in the application

## Need Help?

- Check the main README.md
- Open an issue on GitHub
- Review the code comments

---

**Happy CRM-ing! 🚀**
