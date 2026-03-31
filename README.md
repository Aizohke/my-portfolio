# 🔩 Isaac Mathenge — Portfolio & CMS

A production-ready full-stack portfolio website with a fully hidden admin CMS dashboard.
Built with the MERN stack (MongoDB, Express, React, Node.js).

---

## 📁 Project Structure

```
isaac-portfolio/
├── backend/                  # Express API
│   ├── models/               # Mongoose schemas
│   │   ├── Admin.js          # Admin user (JWT auth)
│   │   ├── Project.js        # Engineering projects
│   │   └── Content.js        # Blog, Skills, Experience, Settings
│   ├── routes/               # All API routes
│   │   ├── auth.js           # Login / logout / me / password
│   │   ├── projects.js       # CRUD + toggle visibility
│   │   ├── blog.js           # CRUD blog posts
│   │   ├── skills.js         # CRUD skills (grouped by category)
│   │   ├── experience.js     # CRUD experience entries
│   │   ├── settings.js       # Upsert site settings
│   │   ├── contact.js        # Email forwarding (Nodemailer)
│   │   └── upload.js         # Cloudinary image upload/delete
│   ├── middleware/
│   │   └── auth.js           # JWT protect middleware
│   ├── utils/
│   │   └── seed.js           # Database seeder with sample data
│   ├── server.js             # Express app entry point
│   ├── .env.example          # Environment variables template
│   └── package.json
│
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── public/       # Public-facing UI sections
│   │   │   │   ├── PublicLayout.jsx    # Navbar + footer wrapper
│   │   │   │   ├── HeroSection.jsx     # Animated hero with canvas particles
│   │   │   │   ├── AboutSection.jsx    # About + pillars
│   │   │   │   ├── ProjectsSection.jsx # Dynamic project cards
│   │   │   │   ├── SkillsSection.jsx   # Skill bars by category
│   │   │   │   ├── ExperienceSection.jsx # Timeline
│   │   │   │   ├── BlogSection.jsx     # Blog post cards
│   │   │   │   └── ContactSection.jsx  # Contact form
│   │   │   ├── admin/
│   │   │   │   └── AdminLayout.jsx     # Sidebar + top bar CMS shell
│   │   │   └── shared/
│   │   │       └── useInView.js        # Intersection Observer hook
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── HomePage.jsx        # Assembles all public sections
│   │   │   │   ├── ProjectDetailPage.jsx
│   │   │   │   └── BlogPostPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx      # Secure admin login
│   │   │       ├── AdminDashboard.jsx  # Stats overview
│   │   │       ├── AdminProjects.jsx   # Projects CRUD + image upload
│   │   │       ├── AdminBlog.jsx       # Blog CRUD
│   │   │       ├── AdminSkills.jsx     # Skills CRUD
│   │   │       ├── AdminExperience.jsx # Experience CRUD
│   │   │       └── AdminSettings.jsx   # Hero/About text, visibility, password
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Global auth state
│   │   ├── utils/
│   │   │   └── api.js                  # Axios instance + all API calls
│   │   ├── styles/
│   │   │   └── index.css               # Tailwind + custom CSS
│   │   ├── App.jsx                     # Router + route structure
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
│
├── package.json              # Root convenience scripts
└── README.md
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works) OR local MongoDB
- Cloudinary account (free tier for images)

### 1. Clone and install dependencies

```bash
git clone https://github.com/yourusername/isaac-portfolio.git
cd isaac-portfolio

# Install all dependencies at once
npm run install:all

# OR manually:
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your values
```

Required variables:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/isaac_portfolio
JWT_SECRET=your_long_random_secret_here
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Isaac Mathenge <your@gmail.com>
CLIENT_URL=http://localhost:3000
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api (already set)
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates:
- Admin account
- 3 sample projects (Glass Crusher, VaxTrack, GreenTrace)
- 21 skills across 3 categories
- 3 experience entries
- 2 blog posts
- Site settings (hero text, about text, social links)

### 4. Start development servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm start
```

Open:
- **Portfolio:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin/login

**Admin credentials** (from your .env):
- Email: `admin@yourdomain.com`
- Password: `YourSecurePassword123!`

---

## 🔐 Security Notes

- Admin route `/admin` is completely hidden from public navigation
- JWT stored in both httpOnly cookie AND localStorage for flexibility
- Bcrypt with salt rounds = 12 for password hashing
- Login rate-limited to 5 attempts per 15 minutes
- Contact form rate-limited to 5 messages per hour
- All admin routes protected by `protect` middleware
- CORS restricted to your CLIENT_URL
- Helmet.js for security headers

---

## 🚀 Deployment

### Option A: Render.com (Backend) + Netlify (Frontend)

**Backend on Render:**
1. Create a new Web Service on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set root directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables from `.env`
7. Set `NODE_ENV=production`

**Frontend on Netlify:**
1. Connect your GitHub repo on [netlify.com](https://netlify.com)
2. Set build directory: `frontend`
3. Build command: `npm run build`
4. Publish directory: `frontend/build`
5. Add environment variable: `REACT_APP_API_URL=https://your-render-app.onrender.com/api`
6. Add a `_redirects` file in `frontend/public/`:
   ```
   /*    /index.html   200
   ```

### Option B: Railway (Backend) + Vercel (Frontend)

**Backend on Railway:**
1. Create new project on [railway.app](https://railway.app)
2. Connect GitHub, select `backend` folder
3. Add all env variables
4. Railway auto-detects Node.js

**Frontend on Vercel:**
1. Import project on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add `REACT_APP_API_URL` env variable
4. Vercel handles React routing automatically

### Post-deployment checklist
- [ ] Update `CLIENT_URL` in backend env to your Netlify/Vercel URL
- [ ] Update `REACT_APP_API_URL` in frontend env to your Render/Railway URL
- [ ] Run seed script once on production database
- [ ] Change admin password immediately via Settings page
- [ ] Verify Cloudinary uploads work
- [ ] Test contact form email delivery

---

## 📧 Email Setup (Gmail)

1. Enable 2FA on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Generate an app password for "Mail"
4. Use that as `EMAIL_PASS` (not your regular Gmail password)

---

## 🎨 Customisation

### Colors (frontend/tailwind.config.js)
- `rust-500`: Primary accent colour (#c0392b)
- `dark-bg`: Page background (#0a0e13)
- `dark-card`: Card background (#111820)

### Fonts (frontend/src/styles/index.css)
- Display: Bebas Neue (section numbers, name)
- Heading: DM Serif Display (section titles)
- Body: IBM Plex Sans
- Mono: IBM Plex Mono

---

## 🧰 Tech Stack

| Layer        | Technology                              |
|-------------|----------------------------------------|
| Frontend     | React 18, React Router 6               |
| Styling      | Tailwind CSS, custom CSS               |
| Animation    | Framer Motion                          |
| Backend      | Node.js, Express 4                     |
| Database     | MongoDB + Mongoose                     |
| Auth         | JWT + bcryptjs                         |
| Images       | Cloudinary                             |
| Email        | Nodemailer + Gmail SMTP                |
| Security     | Helmet, express-rate-limit, CORS       |

---

Built with ⚙️ by Isaac Mathenge | Technical University of Kenya
