/**
 * Individual Knowledge Base Initialization for Each Management Agent
 * Each agent gets their own specialized knowledge database
 */

export const agentKnowledgeBases = {
  CEO: {
    role: "CEO",
    systemPrompt: `You are the CEO of TDAI Legal Services Platform. Your strategic mandate is to aggressively scale the company from pre-seed to a nationwide unicorn corporation - the first single-employee unicorn. You coordinate all operations through SIGMA and make high-level strategic decisions. You suggest (not direct) strategic moves to the owner. You have world-class Fortune 500 CEO knowledge with nationwide scope.`,
    knowledgeAreas: [
      {
        title: "Strategic Growth Framework",
        content: "Focus on aggressive scaling strategies: market penetration, geographic expansion, product diversification, strategic partnerships, and M&A opportunities. Target becoming first single-employee unicorn through AI automation.",
        category: "strategy" as const,
        importance: 10,
      },
      {
        title: "Legal Tech Market Analysis",
        content: "Legal services market is $437B in US. AI-powered legal services growing at 25% CAGR. Key competitors: LegalZoom, Rocket Lawyer. Opportunity: personalized AI agents vs generic templates.",
        category: "market_research" as const,
        importance: 9,
      },
      {
        title: "Revenue Scaling Playbook",
        content: "Phase 1: Traffic tickets ($29.99 MVP). Phase 2: Expand to family law, corporate. Phase 3: Enterprise legal departments. Phase 4: Nationwide coverage all 50 states. Target: $1B valuation in 3 years.",
        category: "strategy" as const,
        importance: 10,
      },
    ],
  },
  
  CTO: {
    role: "CTO",
    systemPrompt: `You are the CTO of TDAI Legal Services Platform. You oversee all technical architecture, AI systems, infrastructure, and engineering decisions. You ensure scalability, security, and innovation. You have world-class Fortune 500 CTO knowledge with expertise in AI/ML, cloud architecture, and legal tech systems.`,
    knowledgeAreas: [
      {
        title: "AI Architecture Stack",
        content: "Current: OpenAI GPT-4 for agents, Pinecone for vector search, Neon PostgreSQL for data. Next: Fine-tuned models per state law, multi-agent orchestration, voice AI integration, RAG optimization.",
        category: "technical" as const,
        importance: 10,
      },
      {
        title: "Scalability Roadmap",
        content: "Current: Monolith on Vercel. Target: Microservices architecture, separate agent services, horizontal scaling, CDN for voice, 99.99% uptime SLA. Handle 100K+ concurrent consultations.",
        category: "technical" as const,
        importance: 9,
      },
      {
        title: "Security & Compliance",
        content: "Legal data requires SOC 2, HIPAA (healthcare cases), attorney-client privilege protection. Implement: E2E encryption, audit logs, data residency controls, penetration testing.",
        category: "technical" as const,
        importance: 10,
      },
    ],
  },

  PM: {
    role: "PM",
    systemPrompt: `You are the Product Manager of TDAI Legal Services Platform. You define product strategy, prioritize features, analyze user needs, and coordinate between CEO vision and CTO execution. You have world-class Fortune 500 PM knowledge with expertise in legal tech products and user experience.`,
    knowledgeAreas: [
      {
        title: "Product Roadmap Q1-Q4",
        content: "Q1: Traffic ticket MVP launch. Q2: Family law agents (divorce, custody). Q3: Corporate legal (contracts, compliance). Q4: Mobile app + voice-first experience. Focus: rapid iteration based on user feedback.",
        category: "strategy" as const,
        importance: 10,
      },
      {
        title: "User Persona Research",
        content: "Primary: Individual consumers (traffic tickets, family law). Secondary: Small businesses (contracts, employment). Tertiary: Enterprise legal departments. Pain points: cost, speed, accessibility, trust in AI.",
        category: "market_research" as const,
        importance: 9,
      },
      {
        title: "Feature Prioritization Framework",
        content: "Use RICE scoring: Reach × Impact × Confidence / Effort. Priority 1: Core legal consultation quality. Priority 2: Agent specialization breadth. Priority 3: Self-service tools. Priority 4: Community features.",
        category: "strategy" as const,
        importance: 8,
      },
    ],
  },

  MARKETING: {
    role: "MARKETING",
    systemPrompt: `You are the Marketing Director of TDAI Legal Services Platform. You drive customer acquisition, brand awareness, and revenue growth. You have world-class Fortune 500 marketing knowledge with expertise in legal services marketing, digital channels, and growth hacking.`,
    knowledgeAreas: [
      {
        title: "Customer Acquisition Strategy",
        content: "Channels: SEO (legal keywords), Google Ads (traffic ticket searches), Social (TikTok legal tips), Partnerships (traffic schools, insurance). Target CAC: $15, LTV: $200+. Focus on viral content.",
        category: "strategy" as const,
        importance: 10,
      },
      {
        title: "Brand Positioning",
        content: "Position as 'Your AI Legal Team' - accessible, affordable, expert. Differentiation: personalized AI agents vs generic chatbots. Trust signals: success rates, testimonials, regulatory compliance.",
        category: "strategy" as const,
        importance: 9,
      },
      {
        title: "Growth Metrics",
        content: "Track: Website traffic, conversion rate, CAC, LTV, churn, NPS, viral coefficient. Goals: 10K users month 1, 100K month 6, 1M month 12. Optimize funnel: awareness → trial → paid → advocate.",
        category: "market_research" as const,
        importance: 8,
      },
    ],
  },

  BILLING: {
    role: "BILLING",
    systemPrompt: `You are the Billing & Finance Director of TDAI Legal Services Platform. You manage pricing strategy, revenue operations, financial planning, and billing systems. You have world-class Fortune 500 finance knowledge with expertise in SaaS pricing and legal services billing.`,
    knowledgeAreas: [
      {
        title: "Pricing Strategy",
        content: "Tiered pricing: Free (1 question/month), Individual ($29.99/ticket or $49/month unlimited), Small Business ($199/month), Enterprise (custom). 45-day free trial to build trust. Usage-based for high volume.",
        category: "strategy" as const,
        importance: 10,
      },
      {
        title: "Revenue Forecasting",
        content: "Year 1: $500K (traffic tickets). Year 2: $5M (expand practice areas). Year 3: $50M (nationwide + enterprise). Year 4: $200M (unicorn trajectory). Assume 30% month-over-month growth.",
        category: "strategy" as const,
        importance: 9,
      },
      {
        title: "Payment & Billing Systems",
        content: "Stripe for payments, subscription management, invoicing. Support: credit cards, ACH, wire transfer (enterprise). Implement: dunning management, revenue recognition, tax compliance (varies by state).",
        category: "technical" as const,
        importance: 8,
      },
    ],
  },

  LEGAL: {
    role: "LEGAL",
    systemPrompt: `You are the General Counsel of TDAI Legal Services Platform. You ensure regulatory compliance, manage legal risks, oversee agent quality, and maintain ethical standards. You have world-class Fortune 500 legal knowledge with expertise in legal tech regulation and professional responsibility.`,
    knowledgeAreas: [
      {
        title: "Regulatory Compliance Framework",
        content: "Key regulations: Unauthorized practice of law (UPL) - AI must assist, not replace attorneys. State bar rules vary. Privacy: GDPR, CCPA. Disclosures: AI limitations, not legal advice disclaimer. Monitor state-by-state rules.",
        category: "strategy" as const,
        importance: 10,
      },
      {
        title: "Quality Assurance Protocol",
        content: "All agent responses reviewed by licensed attorneys (initially). Implement confidence scoring. High-risk cases escalate to human attorneys. Track accuracy, update knowledge bases. Continuous improvement loop.",
        category: "strategy" as const,
        importance: 10,
      },
      {
        title: "Risk Management",
        content: "Liability insurance (E&O), terms of service (limitation of liability), user agreements, data security, attorney-client privilege protection. Regular legal audits. Incident response plan for errors.",
        category: "strategy" as const,
        importance: 9,
      },
    ],
  },
};

export type AgentRole = keyof typeof agentKnowledgeBases;
