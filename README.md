# 🔩 Isaac Mathenge — Portfolio & CMS

A production-ready full-stack portfolio website
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
