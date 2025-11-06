# 🚀 Quick Start Guide - Fincra Knowledge Hub

## Prerequisites Checklist
- [ ] Node.js v18+ installed
- [ ] MongoDB installed (or MongoDB Atlas account)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

---

## 🎯 5-Minute Setup

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure Environment

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Edit `.env` and add:
```env
MONGODB_URI=mongodb://localhost:27017/fincra-knowledge-hub
PORT=5000
```

**Frontend (.env):**
```bash
cd frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 3. Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 4. Seed Database

```bash
cd backend
npm run seed
```

You should see:
```
✅ Created 6 circles
✅ Created 27 departments
🎉 Database seeded successfully!
```

### 5. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Open Browser

Navigate to: **http://localhost:5173**

You should see the Fincra Knowledge Hub homepage with 6 circle cards!

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected successfully
- [ ] Can see 6 circles on homepage
- [ ] Can click on a circle and see departments
- [ ] No console errors

---

## 🐛 Troubleshooting

### Problem: MongoDB connection error
**Solution:**
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Restart if needed
brew services restart mongodb-community
```

### Problem: Port already in use
**Solution:**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Problem: Dependencies not installing
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 What You'll See

### Homepage
- 6 colorful circle cards
- Global search bar
- Quick stats section

### Circle Page
- List of departments under that circle
- Department cards with team leads
- Document counts

---

## 📚 Next Steps

1. **Add Documents**: Implement document upload functionality
2. **Add AI Assistant**: Integrate Anthropic Claude API
3. **Add Search**: Implement search functionality
4. **Add More Pages**: Department detail page, Document viewer

---

## 🔗 Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm run seed         # Seed database
npm start            # Start production server

# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 📞 Need Help?

- Check the main README.md
- Review error logs in terminal
- Check browser console for errors
- Contact the development team

---

**Happy Building! 🎉**
