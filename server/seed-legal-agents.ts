import { getDb } from "./db";
import { legalAgents, managementAgents, regulatoryBoard } from "../drizzle/schema";

/**
 * Seed database with legal agents and management team for investor demo
 */

const LEGAL_AGENTS_DATA = [
  {
    id: "agent_traffic_sarah",
    name: "Sarah Mitchell",
    specialization: "TRAFFIC" as const,
    title: "Traffic Law Specialist",
    description: "Expert in Michigan traffic violations, DUI defense under MCL 257.625, and Secretary of State license restoration with 96.2% success rate",
    successRate: "96.20",
    casesHandled: 1247,
    status: "active" as const,
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    avatar: "👩‍⚖️",
    state: "MI",
    trainedBy: "ZADE",
  },
  {
    id: "TRAFFIC-SPEED-001",
    name: "Velocity Defender",
    specialization: "TRAFFIC" as const,
    title: "Speeding Ticket Specialist",
    description: "Expert in Michigan speeding violations, radar calibration challenges, and speed limit defense strategies. Specializes in finding procedural errors.",
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
    description: "Michigan DUI/DWI expert focusing on field sobriety test challenges, breathalyzer accuracy, and constitutional rights protection.",
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
    description: "Specializes in traffic signal violations, camera ticket challenges, and intersection law. Expert at identifying faulty equipment and unclear signage.",
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
    description: "Michigan parking law expert handling meter violations, permit disputes, and handicap parking cases. Known for finding signage errors.",
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
    description: "Handles serious moving violations including reckless driving, careless driving, and aggressive driving charges. Focuses on reducing charges.",
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
    description: "Expert in license suspension, expired registration, insurance violations, and documentation issues. Helps restore driving privileges.",
    successRate: "88.90",
    casesHandled: 178,
    status: "active" as const,
    voiceId: null,
    avatar: "📋",
    state: "MI",
    trainedBy: "ZADE",
  },
  {
    id: "agent_family_michael",
    name: "Michael Rodriguez",
    specialization: "FAMILY" as const,
    title: "Family Law Expert",
    description: "Specializing in Michigan divorce (MCL 552), child custody under Michigan Child Custody Act, and family mediation with compassionate approach",
    successRate: "94.70",
    casesHandled: 892,
    status: "active" as const,
    voiceId: "pNInz6obpgDQGcFmaJgB", // Adam - professional male
    avatar: "👨‍⚖️",
    state: "MI",
  },
  {
    id: "agent_corporate_jennifer",
    name: "Jennifer Chen",
    specialization: "CORPORATE" as const,
    title: "Corporate Law Advisor",
    description: "Michigan business formation (LLC, Corp), contracts under Michigan Contract Law, and compliance for startups and enterprises",
    successRate: "98.10",
    casesHandled: 654,
    status: "active" as const,
    voiceId: "EXAVITQu4vr4xnSDxMaL", // Bella
    avatar: "👩‍💼",
    state: "MI",
  },
  {
    id: "agent_criminal_david",
    name: "David Thompson",
    specialization: "CRIMINAL" as const,
    title: "Criminal Defense Attorney",
    description: "Aggressive defense for Michigan criminal charges under MCL 750, misdemeanors, and felonies with deep knowledge of Michigan Penal Code",
    successRate: "91.50",
    casesHandled: 1089,
    status: "active" as const,
    voiceId: "VR6AewLTigWG4xSOukaG", // Arnold - commanding
    avatar: "⚖️",
    state: "MI",
  },
  {
    id: "agent_benefits_betty",
    name: "Betty Williams",
    specialization: "BENEFITS" as const,
    title: "Social Security Specialist",
    description: "30+ years helping Michigan residents navigate Social Security, SSI, SSDI, and state benefits systems with fierce advocacy",
    successRate: "97.30",
    casesHandled: 2156,
    status: "active" as const,
    voiceId: "MF3mGyEYCl7XYWbV9V6O", // Elli - professional
    avatar: "🛡️",
    state: "MI",
  },
];

const MANAGEMENT_AGENTS_DATA = [
  {
    id: "mgmt_ceo_evelyn",
    name: "Dr. Evelyn Reed",
    role: "CEO" as const,
    title: "Chief Executive Officer",
    status: "active" as const,
    avatar: "👑",
    description: "Strategic visionary leading TDAI's mission to democratize legal services through AI",
  },
  {
    id: "mgmt_cto_zade",
    name: "Dr. Zade Sterling",
    role: "CTO" as const,
    title: "Chief Technology Officer",
    status: "active" as const,
    avatar: "🏗️",
    description: "Architecting scalable AI infrastructure for Michigan legal service delivery with plans for state-by-state expansion",
  },
  {
    id: "mgmt_pm_maya",
    name: "Maya Singh",
    role: "PM" as const,
    title: "Product Manager",
    status: "active" as const,
    avatar: "📊",
    description: "Driving product-market fit and customer success across all legal specializations",
  },
  {
    id: "mgmt_marketing_alex",
    name: "Alex Martinez",
    role: "MARKETING" as const,
    title: "Chief Marketing Officer",
    status: "active" as const,
    avatar: "📢",
    description: "Building TDAI brand and acquiring customers in Michigan with strategic plans for multi-state expansion"
  },
  {
    id: "mgmt_billing_sophia",
    name: "Sophia Johnson",
    role: "BILLING" as const,
    title: "Chief Financial Officer",
    status: "active" as const,
    avatar: "💰",
    description: "Managing subscriptions, billing, and financial operations",
  },
  {
    id: "mgmt_legal_robert",
    name: "Robert Davis",
    role: "LEGAL" as const,
    title: "General Counsel",
    status: "active" as const,
    avatar: "⚖️",
    description: "Ensuring compliance and legal integrity across all operations",
  },
];

const REGULATORY_BOARD_DATA = [
  {
    id: "board_chair_james",
    name: "James Patterson",
    position: "Board Chair",
    specialization: "Corporate Governance",
    status: "active" as const,
    avatar: "👔",
  },
  {
    id: "board_ethics_maria",
    name: "Maria Gonzalez",
    position: "Ethics Officer",
    specialization: "AI Ethics & Compliance",
    status: "active" as const,
    avatar: "🎯",
  },
  {
    id: "board_legal_thomas",
    name: "Thomas Anderson",
    position: "Legal Oversight",
    specialization: "Legal Practice Standards",
    status: "active" as const,
    avatar: "⚖️",
  },
  {
    id: "board_tech_lisa",
    name: "Lisa Wong",
    position: "Technology Auditor",
    specialization: "AI Safety & Security",
    status: "active" as const,
    avatar: "🔒",
  },
  {
    id: "board_consumer_john",
    name: "John Smith",
    position: "Consumer Advocate",
    specialization: "Customer Protection",
    status: "active" as const,
    avatar: "🛡️",
  },
  {
    id: "board_quality_rachel",
    name: "Rachel Brown",
    position: "Quality Assurance",
    specialization: "Service Quality Standards",
    status: "active" as const,
    avatar: "✅",
  },
];

async function seedDatabase() {
  console.log("🌱 Seeding TDAI Legal Platform database...\n");

  const db = await getDb();
  if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
  }

  try {
    // Seed legal agents
    console.log("📝 Seeding legal agents...");
    for (const agent of LEGAL_AGENTS_DATA) {
      await db.insert(legalAgents).values(agent).onDuplicateKeyUpdate({
        set: {
          name: agent.name,
          description: agent.description,
          successRate: agent.successRate,
          casesHandled: agent.casesHandled,
        },
      });
      console.log(`  ✅ ${agent.name} (${agent.specialization})`);
    }

    // Seed management agents
    console.log("\n👔 Seeding management agents...");
    for (const agent of MANAGEMENT_AGENTS_DATA) {
      await db.insert(managementAgents).values(agent).onDuplicateKeyUpdate({
        set: {
          name: agent.name,
          description: agent.description,
          status: agent.status,
        },
      });
      console.log(`  ✅ ${agent.name} (${agent.role})`);
    }

    // Seed regulatory board
    console.log("\n🏛️ Seeding regulatory board...");
    for (const member of REGULATORY_BOARD_DATA) {
      await db.insert(regulatoryBoard).values(member).onDuplicateKeyUpdate({
        set: {
          name: member.name,
          position: member.position,
          status: member.status,
        },
      });
      console.log(`  ✅ ${member.name} (${member.position})`);
    }

    console.log("\n✅ Database seeded successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   - ${LEGAL_AGENTS_DATA.length} legal agents`);
    console.log(`   - ${MANAGEMENT_AGENTS_DATA.length} management agents`);
    console.log(`   - ${REGULATORY_BOARD_DATA.length} regulatory board members`);
    
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase };
