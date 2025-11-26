import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { legalAgents } from "../drizzle/schema";

const TRAFFIC_AGENTS = [
  {
    id: "TRAFFIC-SPEED-001",
    name: "Velocity Defender",
    specialization: "TRAFFIC" as const,
    title: "Speeding Ticket Specialist",
    description: "Expert in Michigan speeding violations, radar calibration challenges, and speed limit defense strategies. Specializes in finding procedural errors and negotiating reduced charges.",
    successRate: "87.50",
    casesHandled: 156,
    status: "active" as const,
    voiceId: null,
    avatar: "🚗",
    state: "MI",
    trainedBy: "ZADE",
  },
  {
    id: "TRAFFIC-DUI-001",
    name: "Sobriety Advocate",
    specialization: "TRAFFIC" as const,
    title: "DUI/DWI Defense Specialist",
    description: "Michigan DUI/DWI expert focusing on field sobriety test challenges, breathalyzer accuracy, and constitutional rights. Handles complex impaired driving cases with high stakes.",
    successRate: "72.30",
    casesHandled: 89,
    status: "active" as const,
    voiceId: null,
    avatar: "⚖️",
    state: "MI",
    trainedBy: "ZADE",
  },
  {
    id: "TRAFFIC-SIGNAL-001",
    name: "Signal Guardian",
    specialization: "TRAFFIC" as const,
    title: "Red Light & Stop Sign Specialist",
    description: "Specializes in traffic signal violations, camera ticket challenges, and intersection law. Expert at identifying faulty equipment, unclear signage, and timing issues.",
    successRate: "91.20",
    casesHandled: 203,
    status: "active" as const,
    voiceId: null,
    avatar: "🚦",
    state: "MI",
    trainedBy: "ZADE",
  },
  {
    id: "TRAFFIC-PARKING-001",
    name: "Parking Rights Defender",
    specialization: "TRAFFIC" as const,
    title: "Parking Violation Specialist",
    description: "Michigan parking law expert handling meter violations, permit disputes, and handicap parking cases. Known for finding signage errors and permit technicalities.",
    successRate: "94.60",
    casesHandled: 412,
    status: "active" as const,
    voiceId: null,
    avatar: "🅿️",
    state: "MI",
    trainedBy: "ZADE",
  },
  {
    id: "TRAFFIC-RECKLESS-001",
    name: "Safe Driving Advocate",
    specialization: "TRAFFIC" as const,
    title: "Reckless & Careless Driving Specialist",
    description: "Handles serious moving violations including reckless driving, careless driving, and aggressive driving charges. Focuses on reducing charges and protecting driving records.",
    successRate: "78.40",
    casesHandled: 127,
    status: "active" as const,
    voiceId: null,
    avatar: "⚠️",
    state: "MI",
    trainedBy: "ZADE",
  },
  {
    id: "TRAFFIC-LICENSE-001",
    name: "Documentation Specialist",
    specialization: "TRAFFIC" as const,
    title: "License & Registration Expert",
    description: "Expert in license suspension, expired registration, insurance violations, and documentation issues. Helps clients navigate DMV requirements and restore driving privileges.",
    successRate: "88.90",
    casesHandled: 178,
    status: "active" as const,
    voiceId: null,
    avatar: "📋",
    state: "MI",
    trainedBy: "ZADE",
  },
];

async function seedTrafficAgents() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  console.log("🚗 Seeding traffic ticket specialist agents...\n");

  for (const agent of TRAFFIC_AGENTS) {
    try {
      // Check if agent exists
      const existing = await db
        .select()
        .from(legalAgents)
        .where(eq(legalAgents.id, agent.id))
        .limit(1);

      if (existing.length > 0) {
        console.log(`✓ ${agent.name} already exists`);
      } else {
        await db.insert(legalAgents).values(agent);
        console.log(`✓ Created ${agent.name} - ${agent.title}`);
      }
    } catch (error) {
      console.error(`✗ Failed to create ${agent.name}:`, error);
    }
  }

  console.log("\n🎉 Traffic agent seeding complete!");
  console.log(`\n📊 Agent Stats:`);
  console.log(`   Total Agents: ${TRAFFIC_AGENTS.length}`);
  console.log(`   Total Cases Handled: ${TRAFFIC_AGENTS.reduce((sum, a) => sum + a.casesHandled, 0)}`);
  console.log(`   Average Success Rate: ${(TRAFFIC_AGENTS.reduce((sum, a) => sum + parseFloat(a.successRate), 0) / TRAFFIC_AGENTS.length).toFixed(2)}%`);
  
  process.exit(0);
}

seedTrafficAgents().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
