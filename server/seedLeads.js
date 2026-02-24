import mongoose from "mongoose";
import Lead from "./models/Lead.js";
import dotenv from "dotenv";

dotenv.config();

const FIRST_NAMES = ["John", "Sarah", "Michael", "Emma", "David", "Lisa", "James", "Maria", "Robert", "Jennifer", "William", "Linda", "Richard", "Patricia", "Joseph", "Nancy", "Thomas", "Karen", "Charles", "Betty", "Daniel", "Helen", "Matthew", "Sandra", "Anthony", "Ashley", "Mark", "Donna", "Donald", "Carol", "Steven", "Michelle", "Paul", "Emily", "Andrew", "Amanda", "Joshua", "Melissa", "Kenneth", "Deborah", "Kevin", "Stephanie", "Brian", "Rebecca", "George", "Laura", "Edward", "Sharon", "Ronald", "Cynthia"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];
const SOURCES = ["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Facebook", "Instagram", "Twitter", "Google Ads", "Trade Show"];
const STATUSES = ["new", "contacted", "converted", "lost"];

const generateLeads = (count) => {
  const leads = [];
  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    const phone = `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const daysAgo = Math.floor(Math.random() * 90);
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    
    const rand = Math.random();
    let status;
    if (rand < 0.92) status = "converted";
    else if (rand < 0.97) status = "contacted";
    else if (rand < 0.99) status = "new";
    else status = "lost";
    
    leads.push({
      name,
      email,
      phone,
      source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
      status,
      message: `Interested in learning more about your services.`,
      createdAt,
      updatedAt: createdAt
    });
  }
  return leads;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing leads
    await Lead.deleteMany({});
    console.log("🗑️  Cleared existing leads");

    // Generate and insert 200 leads
    const leads = generateLeads(200);
    await Lead.insertMany(leads);
    console.log(`✅ Successfully added ${leads.length} leads to database`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
