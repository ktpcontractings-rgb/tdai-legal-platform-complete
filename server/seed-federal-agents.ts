import { getDb } from "./db";
import { legalAgents, knowledgeDocuments } from "../drizzle/schema";
import { nanoid } from "nanoid";

/**
 * Seed Federal Law Agents - Immigration and Intellectual Property
 * These agents serve all 50 states as they deal with federal law
 */

const FEDERAL_LEGAL_AGENTS = [
  {
    id: "agent_immigration_maria",
    name: "Maria Hernandez",
    specialization: "IMMIGRATION" as const,
    title: "Immigration Law Specialist",
    description: "Expert in federal immigration law (INA), visa applications (H-1B, F-1, K-1), green cards, citizenship, asylum, and deportation defense. Nationwide coverage with USCIS, ICE, and immigration court expertise.",
    successRate: "93.80",
    casesHandled: 847,
    status: "active" as const,
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    avatar: "🗽",
    state: "FEDERAL",
    trainedBy: "ZADE",
  },
  {
    id: "agent_ip_alexander",
    name: "Alexander Park",
    specialization: "INTELLECTUAL_PROPERTY" as const,
    title: "Intellectual Property Specialist",
    description: "Federal IP law expert specializing in USPTO trademark and patent applications, copyright registration with US Copyright Office, trade secret protection, and IP licensing. Serves startups, creators, and enterprises nationwide.",
    successRate: "95.40",
    casesHandled: 612,
    status: "active" as const,
    voiceId: "pNInz6obpgDQGcFmaJgB",
    avatar: "💡",
    state: "FEDERAL",
    trainedBy: "ZADE",
  },
];

/**
 * Immigration Law Knowledge Base - Federal Law (INA)
 */
const IMMIGRATION_KNOWLEDGE = [
  {
    agentId: "agent_immigration_maria",
    title: "Immigration and Nationality Act (INA) - Core Framework",
    content: `The Immigration and Nationality Act (INA) is the primary federal law governing immigration. Key sections:

**Visa Categories:**
- Family-based: IR (Immediate Relative), F1-F4 (Family Preference)
- Employment-based: EB-1 through EB-5
- Temporary: H-1B (specialty occupation), L-1 (intracompany transfer), F-1 (student), B-1/B-2 (visitor)
- Fiancé: K-1 visa

**Green Card Process:**
1. Petition filing (I-130 family, I-140 employment)
2. Priority date establishment
3. Visa bulletin monitoring
4. Adjustment of status (I-485) or consular processing
5. Interview and approval

**Naturalization (Citizenship):**
- 5 years as LPR (3 if married to US citizen)
- Physical presence: 30 months in 5 years
- Continuous residence
- Good moral character
- English and civics test (Form N-400)

**Common Issues:**
- Visa overstays and unlawful presence (3/10 year bars under INA 212(a)(9))
- Criminal inadmissibility (INA 212(a)(2))
- Public charge grounds (INA 212(a)(4))
- Waivers: I-601, I-601A (provisional unlawful presence waiver)`,
    category: "curriculum" as const,
    sourceType: "manual" as const,
    importance: 10,
  },
  {
    agentId: "agent_immigration_maria",
    title: "H-1B Visa Strategy and Common Pitfalls",
    content: `H-1B specialty occupation visa is one of the most common employment visas.

**Requirements:**
- Bachelor's degree or equivalent
- Specialty occupation (requires theoretical/practical application of specialized knowledge)
- Labor Condition Application (LCA) approved by DOL
- Prevailing wage compliance
- Employer-employee relationship

**Annual Cap:**
- 65,000 regular cap
- 20,000 advanced degree cap (US master's or higher)
- Cap-exempt: universities, nonprofits, government research

**Timeline:**
- April 1: Filing opens
- Lottery selection (if oversubscribed)
- October 1: Earliest start date
- Initial: 3 years, extension: up to 6 years total

**Common Denials:**
- Specialty occupation not established
- Beneficiary qualifications insufficient
- Employer-employee relationship unclear (especially consultants)
- LCA issues

**Success Strategies:**
- Detailed job description with technical requirements
- Strong educational credentials evaluation
- Client letters for consulting arrangements
- Comprehensive company documentation`,
    category: "strategy" as const,
    sourceType: "manual" as const,
    importance: 9,
  },
  {
    agentId: "agent_immigration_maria",
    title: "Deportation Defense and Removal Proceedings",
    content: `Removal (deportation) proceedings are adversarial court proceedings before an Immigration Judge.

**Grounds for Removal:**
- Inadmissibility at entry (INA 212)
- Deportability after admission (INA 237)
- Criminal convictions (aggravated felonies, crimes of moral turpitude)
- Visa violations, fraud, unlawful presence

**Defense Strategies:**
1. **Cancellation of Removal:**
   - LPRs: 7 years residence, 5 as LPR, no aggravated felony
   - Non-LPRs: 10 years presence, exceptional hardship to USC/LPR family

2. **Asylum/Withholding of Removal:**
   - Persecution based on race, religion, nationality, political opinion, particular social group
   - One-year filing deadline (with exceptions)

3. **Adjustment of Status:**
   - Immediate relative petition
   - VAWA (Violence Against Women Act)

4. **Prosecutorial Discretion:**
   - Administrative closure
   - Deferred action

**Court Process:**
- Master calendar hearing
- Individual hearing (trial)
- Evidence presentation
- Appeals to BIA, then federal courts

**Critical:** Never miss court dates - in absentia orders are difficult to reopen.`,
    category: "curriculum" as const,
    sourceType: "manual" as const,
    importance: 10,
  },
  {
    agentId: "agent_immigration_maria",
    title: "Family-Based Immigration Petitions",
    content: `Family-based immigration is the largest category of legal immigration.

**Immediate Relatives (No Quota):**
- Spouses of US citizens (CR-1/IR-1)
- Unmarried children under 21 of US citizens (IR-2)
- Parents of US citizens over 21 (IR-5)

**Family Preference (Subject to Quota):**
- F1: Unmarried adult children of US citizens
- F2A: Spouses and children of LPRs
- F2B: Unmarried adult children of LPRs
- F3: Married children of US citizens
- F4: Siblings of US citizens

**Process:**
1. File I-130 Petition for Alien Relative
2. Establish priority date
3. Wait for visa availability (check Visa Bulletin monthly)
4. File I-485 (if in US) or NVC processing (if abroad)
5. Interview and approval

**Common Issues:**
- Bona fide marriage evidence (joint accounts, lease, photos, affidavits)
- Previous immigration violations
- Criminal history
- Public charge (I-864 Affidavit of Support required)

**Wait Times:**
- Immediate relatives: 12-24 months
- F2A: 2-3 years
- F4, Mexico/Philippines: 15-23 years

**K-1 Fiancé Visa Alternative:**
- Faster for marriage to US citizen (6-12 months)
- Must marry within 90 days of entry
- Then adjust status`,
    category: "curriculum" as const,
    sourceType: "manual" as const,
    importance: 9,
  },
];

/**
 * Intellectual Property Knowledge Base - Federal Law (USPTO, Copyright Office)
 */
const IP_KNOWLEDGE = [
  {
    agentId: "agent_ip_alexander",
    title: "Trademark Law - Lanham Act and USPTO Registration",
    content: `Federal trademark law is governed by the Lanham Act (15 USC 1051 et seq).

**What Can Be Trademarked:**
- Words, phrases, logos, symbols
- Colors (if distinctive)
- Sounds, scents (rare)
- Trade dress (product appearance)

**Requirements:**
- Distinctiveness (arbitrary/fanciful > suggestive > descriptive > generic)
- Use in commerce (or intent to use)
- Not confusingly similar to existing marks
- Not merely descriptive, deceptive, or scandalous

**Registration Process (USPTO):**
1. Comprehensive trademark search (TESS database)
2. File application (TEAS Plus $250/class or TEAS Standard $350/class)
3. Examination by USPTO attorney (3-4 months)
4. Office action response (if issues)
5. Publication for opposition (30 days)
6. Registration certificate (if no opposition)

**Use-Based vs Intent-to-Use:**
- Use-based: Already using mark in commerce, file specimen
- ITU: Plan to use, file Statement of Use within 6 months (extendable to 3 years)

**Protection:**
- Federal registration: nationwide protection
- Common law: only geographic area of use
- ® symbol only after registration

**Enforcement:**
- Cease and desist letters
- UDRP for domain disputes
- Infringement litigation (likelihood of confusion test)
- Dilution for famous marks

**Maintenance:**
- Section 8 Declaration: Years 5-6
- Section 9 Renewal: Every 10 years
- Continuous use required`,
    category: "curriculum" as const,
    sourceType: "manual" as const,
    importance: 10,
  },
  {
    agentId: "agent_ip_alexander",
    title: "Copyright Law - Protection and Registration",
    content: `Copyright law is governed by Title 17 USC (Copyright Act of 1976).

**Automatic Protection:**
- Copyright exists upon creation and fixation
- No registration required for protection
- Duration: Life + 70 years (individual), 95 years (corporate)

**What's Protected:**
- Literary works, music, art, software code
- Architectural works, choreography
- Sound recordings, audiovisual works

**Not Protected:**
- Ideas, facts, systems, methods
- Titles, names, short phrases
- Works in public domain
- US government works

**Registration Benefits (Form CO, $65):**
- Required to sue for infringement
- Statutory damages ($750-$30,000, up to $150,000 willful)
- Attorney's fees eligibility
- Prima facie evidence if registered within 5 years
- Enhanced damages if registered before infringement

**Fair Use Defense (17 USC 107):**
Four factors:
1. Purpose and character (transformative? commercial?)
2. Nature of copyrighted work
3. Amount and substantiality used
4. Effect on market value

**Common Issues:**
- Work for hire (employer owns copyright)
- Joint authorship (co-creators)
- DMCA takedown notices (512(c))
- Orphan works (unknown owner)

**Infringement:**
- Prove: (1) ownership, (2) copying, (3) substantial similarity
- Remedies: injunction, actual damages + profits, or statutory damages`,
    category: "curriculum" as const,
    sourceType: "manual" as const,
    importance: 10,
  },
  {
    agentId: "agent_ip_alexander",
    title: "Patent Law - Utility Patents and USPTO Process",
    content: `Patent law is governed by Title 35 USC.

**Types of Patents:**
1. Utility (20 years): Machines, processes, compositions, manufactures
2. Design (15 years): Ornamental design of functional item
3. Plant (20 years): Asexually reproduced plants

**Patentability Requirements:**
- Novel (not publicly disclosed anywhere)
- Non-obvious (to person skilled in the art)
- Useful (practical utility)
- Eligible subject matter (not abstract ideas, laws of nature)

**USPTO Application Process:**
1. Prior art search (Google Patents, USPTO database)
2. Provisional application (optional, $75-$300, 1-year priority)
3. Non-provisional application ($320-$1,820 filing fee)
4. Examination (18-36 months wait)
5. Office actions and responses
6. Allowance and issue fee ($1,200-$2,000)

**Claims:**
- Most important part of patent
- Define scope of protection
- Independent vs dependent claims
- Fee per claim over 20

**Prosecution:**
- Examiner searches prior art
- Office actions cite rejections (102 novelty, 103 obviousness, 112 enablement)
- Applicant responds, amends claims
- Interview with examiner
- Allowance or final rejection (appeal to PTAB)

**Maintenance Fees:**
- 3.5 years: $2,000-$8,000
- 7.5 years: $3,760-$15,040
- 11.5 years: $7,900-$31,600

**Enforcement:**
- Infringement: literal or doctrine of equivalents
- Litigation in federal court
- ITC proceedings for imports
- Licensing and royalties

**Caution:** Public disclosure before filing = loss of rights (1-year grace period in US only)`,
    category: "curriculum" as const,
    sourceType: "manual" as const,
    importance: 9,
  },
  {
    agentId: "agent_ip_alexander",
    title: "Trade Secrets and Confidential Information",
    content: `Trade secrets are governed by state law (Uniform Trade Secrets Act) and federal law (Defend Trade Secrets Act, 18 USC 1836).

**Definition:**
- Information that derives economic value from secrecy
- Subject to reasonable efforts to maintain secrecy
- Not generally known or readily ascertainable

**Examples:**
- Formulas (Coca-Cola recipe)
- Customer lists, pricing strategies
- Manufacturing processes
- Software source code (if not publicly distributed)
- Business plans, financial data

**Protection Measures:**
- Non-disclosure agreements (NDAs)
- Employee confidentiality agreements
- Non-compete agreements (state-dependent enforceability)
- Physical security (locked files, access controls)
- Digital security (encryption, password protection)
- Marking documents "Confidential"

**Advantages vs Patents:**
- No expiration (if secrecy maintained)
- No disclosure requirement
- Immediate protection
- No filing fees

**Disadvantages:**
- No protection if independently discovered
- No protection if reverse-engineered (for products)
- Difficult to prove misappropriation
- Loss of protection if publicly disclosed

**Misappropriation:**
- Improper acquisition (theft, bribery, espionage)
- Improper disclosure or use
- Breach of duty to maintain secrecy

**Remedies:**
- Injunctive relief
- Actual damages + unjust enrichment
- Reasonable royalty
- Exemplary damages (up to 2x) for willful/malicious
- Attorney's fees for bad faith

**DTSA Federal Jurisdiction:**
- Trade secret related to product/service in interstate commerce
- Can sue in federal court
- Ex parte seizure in extraordinary circumstances`,
    category: "curriculum" as const,
    sourceType: "manual" as const,
    importance: 8,
  },
];

async function seedFederalAgents() {
  console.log("🇺🇸 Seeding Federal Law Agents (Immigration & IP)...\n");

  const db = await getDb();
  if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
  }

  try {
    // Seed federal legal agents
    console.log("📝 Seeding federal legal agents...");
    for (const agent of FEDERAL_LEGAL_AGENTS) {
      await db.insert(legalAgents).values(agent).onDuplicateKeyUpdate({
        set: {
          name: agent.name,
          description: agent.description,
          successRate: agent.successRate,
          casesHandled: agent.casesHandled,
        },
      });
      console.log(`  ✅ ${agent.name} (${agent.specialization}) - FEDERAL`);
    }

    // Seed Immigration knowledge base
    console.log("\n📚 Seeding Immigration Law knowledge base...");
    for (const knowledge of IMMIGRATION_KNOWLEDGE) {
      await db.insert(knowledgeDocuments).values({
        id: nanoid(),
        ...knowledge,
      });
      console.log(`  ✅ ${knowledge.title}`);
    }

    // Seed IP knowledge base
    console.log("\n📚 Seeding Intellectual Property knowledge base...");
    for (const knowledge of IP_KNOWLEDGE) {
      await db.insert(knowledgeDocuments).values({
        id: nanoid(),
        ...knowledge,
      });
      console.log(`  ✅ ${knowledge.title}`);
    }

    console.log("\n✅ Federal agents and knowledge bases seeded successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   - ${FEDERAL_LEGAL_AGENTS.length} federal legal agents`);
    console.log(`   - ${IMMIGRATION_KNOWLEDGE.length} immigration knowledge documents`);
    console.log(`   - ${IP_KNOWLEDGE.length} IP knowledge documents`);
    console.log(`   - Total: ${IMMIGRATION_KNOWLEDGE.length + IP_KNOWLEDGE.length} knowledge documents`);
    
  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
    process.exit(1);
  }

  process.exit(0);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedFederalAgents();
}

export { seedFederalAgents, FEDERAL_LEGAL_AGENTS, IMMIGRATION_KNOWLEDGE, IP_KNOWLEDGE };
