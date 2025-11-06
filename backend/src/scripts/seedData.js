require('dotenv').config();
const mongoose = require('mongoose');
const Circle = require('../models/Circle');
const Department = require('../models/Department');

const circlesData = [
  {
    name: "The CEO's Office",
    slug: "ceo-office",
    icon: "👔",
    color: "#8B5CF6",
    description: "Strategic initiatives, AI transformation, and information security",
    order: 1
  },
  {
    name: "Commercial",
    slug: "commercial",
    icon: "💼",
    color: "#3B82F6",
    description: "Sales, payments, partnerships, and customer relations",
    order: 2
  },
  {
    name: "Operations",
    slug: "operations",
    icon: "⚙️",
    color: "#10B981",
    description: "Transaction processing, compliance, legal, and customer support",
    order: 3
  },
  {
    name: "Technology",
    slug: "technology",
    icon: "💻",
    color: "#6366F1",
    description: "Engineering and technical infrastructure",
    order: 4
  },
  {
    name: "Profit",
    slug: "profit",
    icon: "💰",
    color: "#F59E0B",
    description: "Finance, analytics, and business improvement",
    order: 5
  },
  {
    name: "People",
    slug: "people",
    icon: "👥",
    color: "#EC4899",
    description: "Human resources and talent development",
    order: 6
  }
];

const departmentsData = {
  "ceo-office": [
    { name: "Strategy", teamLead: "Musa", description: "Strategic planning and business development" },
    { name: "AI Transformation and Special Projects", teamLead: "Obose", description: "AI initiatives and special transformation projects" },
    { name: "Infosec (Information Security)", teamLead: "Franklin", description: "Information security and cybersecurity operations" }
  ],
  "commercial": [
  { name: "Sales", teamLead: "Luke", description: "Sales operations and client acquisition" },
  { name: "Remittance", teamLead: "Jemima", description: "Cross-border payment and remittance services" },
  { name: "Global Payment Systems", teamLead: "Malaika", description: "International payment infrastructure" },
  { name: "Kele", teamLead: "David", description: "Kele product management and operations" },
  { name: "Partnerships", teamLead: "Nenye", description: "Strategic partnerships and business development" },
  { name: "Processing", teamLead: "Ikay", description: "Payment processing operations" },
  { name: "Treasury", teamLead: "Tosin Adinlewa", description: "Foreign exchange, stablecoins, and treasury management" },
  { name: "MBC (Marketing, Branding & Communication)", teamLead: "Ellen", description: "Marketing, branding, and corporate communications" },
  { name: "Country Manager", teamLead: "Robert", description: "Regional operations and management" },
  { name: "Account Management", teamLead: "Temitayo", description: "Client relationship and account management" }
],
  "operations": [
    { name: "Transaction Processing", teamLead: "Saheed", description: "Transaction processing and reconciliation" },
    { name: "Internal Audit & Control", teamLead: "Lanre", description: "Internal audit and financial controls" },
    { name: "Compliance", teamLead: "Moses Ibeh", description: "Regulatory compliance and risk management" },
    { name: "Legal", teamLead: "TM", description: "Legal affairs and contract management" },
    { name: "Customer Support", teamLead: "Kene", description: "Customer service and technical support" }
  ],
  "technology": [
    { name: "Technology HQ", teamLead: "Babatunde/Akinyemi", description: "Engineering, product development, and technical operations" }
  ],
  "profit": [
    { name: "Finance", teamLead: "Bukky", description: "Financial planning, accounting, and reporting" },
    { name: "Business Intelligence", teamLead: "Bayo", description: "Data analytics and business insights" },
    { name: "Business Improvement and Automation", teamLead: "Funmi", description: "Process optimization and automation initiatives" },
    { name: "Transformation", teamLead: "Tobi Akeredolu", description: "Business transformation and change management" },
    { name: "Productivity/Mission Control", teamLead: "Seyi", description: "Productivity management and operational excellence" }
  ],
  "people": [
    { name: "Love & Productivity", teamLead: "Eze", description: "Employee engagement and workplace culture" },
    { name: "ACE (African College of Excellence)", teamLead: "Yewande", description: "Training, development, and talent programs" }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB\n');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Circle.deleteMany({});
    await Department.deleteMany({});
    console.log('✅ Existing data cleared\n');
    
    // Create circles
    console.log('📦 Creating circles...');
    const circles = await Circle.insertMany(circlesData);
    console.log(`✅ Created ${circles.length} circles:`);
    circles.forEach(circle => {
      console.log(`   ${circle.icon} ${circle.name}`);
    });
    console.log('');
    
    // Create departments
    console.log('📁 Creating departments...');
    let totalDepartments = 0;
    
    for (const circle of circles) {
      const depts = departmentsData[circle.slug];
      if (depts) {
        const departmentsToCreate = depts.map(dept => ({
          ...dept,
          slug: dept.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          circleId: circle._id,
          circleName: circle.name,
          documentCount: 0
        }));
        
        const createdDepts = await Department.insertMany(departmentsToCreate);
        
        // Update circle with department IDs
        await Circle.findByIdAndUpdate(circle._id, {
          departments: createdDepts.map(d => d._id)
        });
        
        console.log(`   ${circle.icon} ${circle.name}: ${createdDepts.length} departments`);
        createdDepts.forEach(dept => {
          console.log(`      • ${dept.name} (Lead: ${dept.teamLead})`);
        });
        console.log('');
        
        totalDepartments += createdDepts.length;
      }
    }
    
    console.log(`✅ Created ${totalDepartments} departments total\n`);
    
    console.log('🎉 Database seeded successfully!');
    console.log('═══════════════════════════════════════');
    console.log(`📊 Summary:`);
    console.log(`   • ${circles.length} Circles`);
    console.log(`   • ${totalDepartments} Departments`);
    console.log(`   • 0 Documents (ready for upload)`);
    console.log('═══════════════════════════════════════\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
