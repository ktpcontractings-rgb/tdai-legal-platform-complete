import { drizzle } from "drizzle-orm/mysql2";
import { managementAgents } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const MANAGEMENT_AGENTS = [
  {
    id: "sigma-ceo",
    name: "Dr. Evelyn Reed",
    role: "CEO" as const,
    title: "Chief Executive Officer & Strategic Vision Lead",
    status: "active" as const,
    avatar: "\ud83d\udc69\u200d\ud83d\udcbc",
    description: "Strategic leadership and business vision. Oversees all TDAI operations, approves major decisions, and sets company direction. Final authority on agent deployments, budget allocations, and compliance protocols.",
    recommendation: "Focus on Michigan market penetration before expanding to additional states. Prioritize customer satisfaction metrics over rapid growth.",
  },
  {
    id: "sigma-cto",
    name: "Dr. Zade Sterling",
    role: "CTO" as const,
    title: "Chief Technology Officer & ZADE System Architect",
    status: "active" as const,
    avatar: "\ud83e\uddd1\u200d\ud83d\udcbb",
    description: "Technology infrastructure and agent training systems. Manages ZADE Ultra Agent Training System, oversees AI agent development, and ensures platform reliability and scalability.",
    recommendation: "Implement automated knowledge freshness monitoring for all Michigan legal agents. Priority: integrate Michigan Legislature API for real-time statute updates.",
  },
  {
    id: "sigma-pm",
    name: "Maya Singh",
    role: "PM" as const,
    title: "Product Manager & Customer Success Lead",
    status: "active" as const,
    avatar: "\ud83d\udc69\u200d\ud83d\udcbc",
    description: "Product development and customer experience. Analyzes user feedback, prioritizes feature development, and ensures platform meets customer needs. Monitors consultation quality and satisfaction metrics.",
    recommendation: "Add text chat fallback for customers who cannot use voice consultations. Implement consultation rating system to track agent performance.",
  },
  {
    id: "sigma-marketing",
    name: "Alex Martinez",
    role: "MARKETING" as const,
    title: "Chief Marketing Officer & Growth Strategist",
    status: "active" as const,
    avatar: "\ud83d\udcca",
    description: "Marketing strategy, customer acquisition, and brand development. Manages digital marketing campaigns, content strategy, and partnership development. Focuses on Michigan market awareness and customer education.",
    recommendation: "Launch targeted digital campaigns in Detroit, Grand Rapids, and Ann Arbor metro areas. Emphasize 45-day free trial and Michigan-specific legal expertise in messaging.",
  },
  {
    id: "sigma-cfo",
    name: "Sophia Johnson",
    role: "BILLING" as const,
    title: "Chief Financial Officer & Revenue Operations",
    status: "active" as const,
    avatar: "\ud83d\udcb0",
    description: "Financial management, billing operations, and revenue optimization. Oversees subscription management, pricing strategy, and financial forecasting. Ensures sustainable business model.",
    recommendation: "Current pricing model sustainable. Monitor trial-to-paid conversion rates. Consider introducing annual billing discount to improve cash flow.",
  },
  {
    id: "sigma-counsel",
    name: "Robert Davis",
    role: "LEGAL" as const,
    title: "General Counsel & Chief Compliance Officer (Retired Judge)",
    status: "active" as const,
    avatar: "⚖️",
    description: "Legal compliance, risk management, and regulatory oversight for TDAI's internal operations. Former Michigan Business Court Judge bringing 25+ years of judicial and corporate law experience. Ensures platform complies with Michigan bar rules, data privacy regulations, and AI ethics standards. Works with Regulatory Board on compliance protocols.",
    recommendation: "Establish formal compliance review process for all new agent deployments. Recommend quarterly audit of agent responses for legal accuracy and ethical standards.",
    education: "Juris Doctor (J.D.) - University of Michigan Law School, magna cum laude; Bachelor of Arts in Political Science - Michigan State University; Judicial Education Program - National Judicial College; AI Ethics & Law Certificate - Stanford Law School",
    knowledge: "Michigan Business Law (MCL 450 - Corporations, MCL 449 - LLCs), Corporate Governance & Fiduciary Duties, Regulatory Compliance Frameworks, AI Ethics & Algorithmic Accountability, Data Privacy Law (GDPR, CCPA, Michigan Privacy Act), Professional Responsibility & Legal Ethics (MRPC), Technology Law & Intellectual Property, Risk Management & Internal Controls, Securities Regulation, Contract Law & Commercial Transactions",
    experience: "Retired Michigan Business Court Judge (15 years) - presided over 2,000+ corporate disputes, mergers, shareholder litigation, and regulatory compliance cases. Former Senior Partner at Davis & Associates (10 years) - specialized in corporate law, regulatory compliance, and business litigation. Adjunct Professor of Business Law - Wayne State University Law School (5 years). Current advisor on AI governance and legal technology ethics.",
  },
];

async function seed() {
  console.log("\ud83c\udf31 Seeding management agents...");

  for (const agent of MANAGEMENT_AGENTS) {
    await db.insert(managementAgents).values(agent).onDuplicateKeyUpdate({
      set: {
        name: agent.name,
        title: agent.title,
        status: agent.status,
        avatar: agent.avatar,
        description: agent.description,
        recommendation: agent.recommendation,
        lastSeen: new Date(),
      },
    });
    console.log(`\u2705 ${agent.name} (${agent.role})`);
  }

  console.log("\u2728 Management agents seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("\u274c Error seeding management agents:", error);
  process.exit(1);
});
