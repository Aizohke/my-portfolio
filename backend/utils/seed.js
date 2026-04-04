/**
 * seed.js
 * Seeds the database with sample projects, skills, experience, blog posts and settings.
 * Auth is handled by Clerk — no admin user needed here.
 *
 * Run from backend/ directory:
 *   node utils/seed.js
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Project = require('../models/Project');
const { Blog, Skill, Experience, Settings } = require('../models/Content');

const seed = async () => {
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('YOUR_USERNAME')) {
      console.error('\n❌  MONGO_URI is not set in backend/.env\n');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await Promise.all([
      Project.deleteMany({}),
      Blog.deleteMany({}),
      Skill.deleteMany({}),
      Experience.deleteMany({}),
      Settings.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // ─── Projects ─────────────────────────────────────────────────────────────
    await Project.create([
      {
        title: 'Hydraulically Operated Glass Crusher',
        problem: 'Manual glass recycling operations are highly labor-intensive, dangerous, and inefficient. Workers face injury risks from sharp glass fragments while achieving only minimal throughput using hand tools — a critical barrier for small-scale recycling initiatives in Kenya.',
        solution: 'Designed and fabricated a hydraulic jaw crusher with an automated feeding mechanism. The system uses a double-acting hydraulic cylinder driven by a hand-pump to deliver crushing forces exceeding 15kN, processing glass bottles into sub-10mm cullets safely behind a polycarbonate guard screen.',
        techStack: ['SolidWorks 3D CAD', 'MATLAB Simulation', 'Hydraulic Systems', 'Steel Fabrication', 'Welding & Machining'],
        impact: '15% efficiency increase over manual methods; reduces operator injury risk by 90%; processes 40kg/hr of mixed glass waste.',
        category: 'mechanical',
        featured: true,
        order: 1,
        images: [],
      },
      {
        title: 'VaxTrack — Vaccination Management System',
        problem: 'Rural health facilities in Kenya struggle with missed childhood vaccine appointments due to lack of reminder systems, leading to preventable disease outbreaks and incomplete immunisation records scattered across paper registers.',
        solution: 'Built a full-stack MERN web application that allows clinic staff to register patients, schedule vaccinations, and send automated SMS/email reminders. Features include a dashboard for health workers, appointment analytics, and an offline-capable PWA for low-connectivity areas.',
        techStack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JWT Auth', 'Twilio SMS', 'Chart.js'],
        impact: 'Deployed at 3 community health centres; improved appointment adherence by 34%; digitised records for 200+ children.',
        category: 'software',
        featured: true,
        order: 2,
        githubUrl: 'https://github.com/isaacmathenge/vaxtrack',
        images: [],
      },
      {
        title: 'GreenTrace — Land Regeneration Tracker',
        problem: 'Land degradation monitoring in semi-arid regions relies on infrequent manual surveys that miss rapid changes. Farmers lack data-driven insights to guide sustainable land use.',
        solution: 'Developed a web platform during the Land ReGen Hackathon that ingests satellite NDVI data to track vegetation recovery over time. Features an interactive map dashboard, automated report generation, and a community forum for farmers.',
        techStack: ['React', 'Python Flask', 'Google Earth Engine API', 'Leaflet.js', 'PostgreSQL'],
        impact: 'Hackathon finalist; tracks 1,200+ hectares across 4 counties; endorsed by Kenya Forestry Research Institute.',
        category: 'software',
        featured: false,
        order: 3,
        images: [],
      },
    ]);
    console.log('📂 Projects seeded');

    // ─── Skills ───────────────────────────────────────────────────────────────
    await Skill.create([
      { category: 'engineering', name: 'SolidWorks CAD', level: 88, icon: '⚙️', order: 1 },
      { category: 'engineering', name: 'AutoCAD', level: 80, icon: '📐', order: 2 },
      { category: 'engineering', name: 'MATLAB / Simulink', level: 75, icon: '📊', order: 3 },
      { category: 'engineering', name: 'Hydraulic & Pneumatic Systems', level: 82, icon: '🔧', order: 4 },
      { category: 'engineering', name: 'MIG/TIG Welding & Fabrication', level: 78, icon: '🏭', order: 5 },
      { category: 'engineering', name: 'Finite Element Analysis (FEA)', level: 70, icon: '🔩', order: 6 },
      { category: 'engineering', name: 'CNC Machining', level: 65, icon: '⚒️', order: 7 },
      { category: 'engineering', name: 'Thermodynamics & Heat Transfer', level: 80, icon: '🌡️', order: 8 },
      { category: 'software', name: 'JavaScript / TypeScript', level: 85, icon: '💻', order: 1 },
      { category: 'software', name: 'React.js', level: 83, icon: '⚛️', order: 2 },
      { category: 'software', name: 'Node.js / Express', level: 80, icon: '🟢', order: 3 },
      { category: 'software', name: 'MongoDB / PostgreSQL', level: 78, icon: '🗄️', order: 4 },
      { category: 'software', name: 'Python', level: 72, icon: '🐍', order: 5 },
      { category: 'software', name: 'Arduino / Raspberry Pi', level: 76, icon: '🤖', order: 6 },
      { category: 'software', name: 'Docker / Linux', level: 65, icon: '🐳', order: 7 },
      { category: 'software', name: 'Git / GitHub', level: 88, icon: '📦', order: 8 },
      { category: 'strengths', name: 'Engineering Problem Solving', level: 92, icon: '🧠', order: 1 },
      { category: 'strengths', name: 'Technical Documentation', level: 85, icon: '📝', order: 2 },
      { category: 'strengths', name: 'Project Leadership', level: 80, icon: '🎯', order: 3 },
      { category: 'strengths', name: 'Cross-disciplinary Collaboration', level: 88, icon: '🤝', order: 4 },
      { category: 'strengths', name: 'Rapid Prototyping', level: 85, icon: '⚡', order: 5 },
    ]);
    console.log('🎯 Skills seeded');

    // ─── Experience ───────────────────────────────────────────────────────────
    await Experience.create([
      {
        title: 'Lead Developer & Co-Founder',
        organization: 'Hela Youth Self-Help Group',
        type: 'work',
        startDate: new Date('2023-03-01'),
        endDate: null,
        description: 'Leading digital transformation of a grassroots community savings and loans organisation serving 80+ members in Nairobi.',
        highlights: [
          'Built a custom member management web app with loan tracking, dividend calculations, and meeting minutes storage',
          'Reduced manual record-keeping errors by 95% and cut report generation time from 3 hours to 5 minutes',
          'Trained 6 committee members on the platform; onboarded all 80+ members within 2 months',
        ],
        order: 1,
      },
      {
        title: 'Hackathon Finalist — GreenTrace',
        organization: 'Land ReGen Hackathon',
        type: 'project',
        startDate: new Date('2023-11-01'),
        endDate: new Date('2023-11-30'),
        description: 'Competed in a 48-hour sustainability hackathon focused on land degradation solutions across East Africa.',
        highlights: [
          'Built GreenTrace, a satellite-data-driven platform for tracking land regeneration progress',
          'Reached the top 5 finalist teams out of 120+ participating teams',
          'Received mentorship from KIRDI and Kenya Forestry Research Institute engineers',
        ],
        order: 2,
      },
      {
        title: 'B.Eng Mechanical Engineering',
        organization: 'Technical University of Kenya (TUK)',
        type: 'education',
        startDate: new Date('2020-09-01'),
        endDate: null,
        description: 'Pursuing a Bachelor of Engineering degree with a focus on fabrication, thermal systems, and mechatronics.',
        highlights: [
          'Final-year project: Hydraulically Operated Glass Crusher — CAD, simulation, and full fabrication',
          'Active member of the TUK Engineering Society and Robotics Club',
          'Practical training in workshop fabrication, lathe operations, and hydraulic test rigs',
        ],
        order: 3,
      },
    ]);
    console.log('💼 Experience seeded');

    // ─── Blog Posts ───────────────────────────────────────────────────────────
    await Blog.create([
      {
        title: 'From Drawing Board to Workshop Floor: Building the Glass Crusher',
        content: `<p>When I first sketched the concept for a hydraulically operated glass crusher on a napkin during a thermodynamics lecture, I had no idea how much that doodle would consume the next eight months of my life.</p><h2>The Problem That Wouldn't Leave Me Alone</h2><p>Glass recycling in Kenya is dominated by the informal sector. The process is brutal: injuries are common, throughput is low, and the inconsistent cullet size fetches poor prices from recyclers. I wanted to change that.</p><h2>Designing in SolidWorks</h2><p>The jaw crusher mechanism was deceptively simple in theory but the devil was in the details. Getting the toggle mechanism geometry right took three full iterations in SolidWorks before the kinematics produced the correct crushing action without binding.</p><p>I ran MATLAB simulations to validate the hydraulic cylinder sizing. The required 15kN crushing force meant specifying a 63mm bore cylinder operating at 5 MPa — well within standard hydraulic hand-pump capacity.</p><h2>The Workshop Reality</h2><p>Fabrication was humbling. Welding the main frame from 50×50mm square hollow section steel taught me more about distortion control than any textbook. The final assembly tested at 17.2kN peak force — 15% above design spec.</p>`,
        excerpt: 'How a napkin sketch became a fully fabricated hydraulic glass crusher — a journey through SolidWorks, MATLAB, and the TUK workshop.',
        tags: ['mechanical engineering', 'fabrication', 'hydraulics', 'project build'],
        visible: true,
      },
      {
        title: 'Why Every Mechanical Engineer Should Learn to Code',
        content: `<p>There's a divide in engineering education that nobody talks about enough: the gap between those who design with atoms and those who design with bits. I've lived on both sides, and I'm here to tell you the divide is artificial.</p><h2>The Mechatronics Wake-Up Call</h2><p>In my second year, we tore apart an industrial servo controller. Inside was a microcontroller running firmware that implemented a PID control loop. My software friends immediately understood the code. My mechanical friends understood the motor. I realised I needed to be fluent in both.</p><h2>Where to Start</h2><p>Start with Python. It's close enough to pseudocode that the logic patterns are immediately applicable to engineering thinking. Then move to Arduino — bridging physical hardware and code is where the magic happens for mechanical engineers.</p>`,
        excerpt: "A mechanical engineering student's case for learning full-stack development — and how it transformed my approach to engineering problems.",
        tags: ['career', 'coding', 'mechatronics', 'engineering education'],
        visible: true,
      },
    ]);
    console.log('📝 Blog posts seeded');

    // ─── Settings ─────────────────────────────────────────────────────────────
    await Settings.create([
      { key: 'hero_name', value: 'Isaac Mathenge' },
      { key: 'hero_title', value: 'Mechanical Engineering Student | Full-Stack Developer | Mechatronics Enthusiast' },
      { key: 'hero_statement', value: 'Bridging the gap between heavy machinery and smart automation through engineering design and full-stack development.' },
      { key: 'about_text', value: "Currently finishing my B.Eng at the Technical University of Kenya, I thrive at the intersection of fabrication and software. Whether I'm running a simulation in MATLAB, turning a design in SolidWorks, or building a full-stack web app from scratch, I'm driven by one question: how can engineering create lasting change?\n\nMy journey has taken me from the workshop floor — welding frames, operating lathes, and testing hydraulic systems — to writing production code for community organisations. That dual fluency is my superpower." },
      { key: 'github_url', value: 'https://github.com/isaacmathenge' },
      { key: 'linkedin_url', value: 'https://linkedin.com/in/isaacmathenge' },
      { key: 'email', value: 'mathengeisaac0@gmail.com' },
      { key: 'sections_order', value: ['hero', 'about', 'projects', 'skills', 'experience', 'blog', 'contact'] },
      { key: 'sections_visible', value: { hero: true, about: true, projects: true, skills: true, experience: true, blog: true, contact: true } },
    ]);
    console.log('⚙️  Settings seeded');

    console.log('\n✨ Database seeded successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
