import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal } from "drizzle-orm/mysql-core";

/**
 * TDAI Legal Services Platform - Complete Database Schema
 * Integrates SIGMA management system with customer-facing legal services
 */

// ============================================================================
// CORE USER & AUTH TABLES
// ============================================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "customer"]).default("customer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// SIGMA MANAGEMENT AGENTS
// ============================================================================

export const managementAgents = mysqlTable("management_agents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  role: mysqlEnum("role", ["CEO", "CTO", "PM", "MARKETING", "BILLING", "LEGAL"]).notNull(),
  title: text("title").notNull(),
  status: mysqlEnum("status", ["active", "inactive", "pending"]).default("pending").notNull(),
  avatar: text("avatar"),
  description: text("description"),
  recommendation: text("recommendation"),
  education: text("education"), // Educational background (degrees, certifications)
  knowledge: text("knowledge"), // Areas of expertise and knowledge domains
  experience: text("experience"), // Professional experience and background
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastSeen: timestamp("lastSeen").defaultNow().notNull(),
});

export type ManagementAgent = typeof managementAgents.$inferSelect;

// ============================================================================
// REGULATORY BOARD
// ============================================================================

export const regulatoryBoard = mysqlTable("regulatory_board", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  specialization: text("specialization").notNull(),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RegulatoryBoardMember = typeof regulatoryBoard.$inferSelect;

// ============================================================================
// CUSTOMER-FACING LEGAL AGENTS
// ============================================================================

export const legalAgents = mysqlTable("legal_agents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  specialization: mysqlEnum("specialization", [
    "TRAFFIC", "FAMILY", "CORPORATE", "CRIMINAL", "BENEFITS", 
    "IMMIGRATION", "REAL_ESTATE", "EMPLOYMENT", "PERSONAL_INJURY",
    "INTELLECTUAL_PROPERTY"
  ]).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  successRate: decimal("successRate", { precision: 5, scale: 2 }),
  casesHandled: int("casesHandled").default(0),
  status: mysqlEnum("status", ["active", "inactive", "training"]).default("active").notNull(),
  voiceId: varchar("voiceId", { length: 128 }), // ElevenLabs voice ID
  avatar: text("avatar"),
  state: varchar("state", { length: 2 }), // US state code
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  trainedBy: varchar("trainedBy", { length: 64 }), // ZADE trainer ID
});

export type LegalAgent = typeof legalAgents.$inferSelect;

// ============================================================================
// AGENT COMMUNICATIONS
// ============================================================================

export const agentCommunications = mysqlTable("agent_communications", {
  id: int("id").autoincrement().primaryKey(),
  fromAgentId: varchar("fromAgentId", { length: 64 }).notNull(),
  toAgentId: varchar("toAgentId", { length: 64 }).notNull(),
  message: text("message").notNull(),
  messageType: mysqlEnum("messageType", ["text", "voice", "decision", "alert"]).default("text").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  status: mysqlEnum("status", ["sent", "delivered", "read"]).default("sent").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AgentCommunication = typeof agentCommunications.$inferSelect;

// ============================================================================
// AGENT DECISIONS & APPROVALS
// ============================================================================

export const agentDecisions = mysqlTable("agent_decisions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  agentId: varchar("agentId", { length: 64 }).notNull(),
  decision: text("decision").notNull(),
  description: text("description"),
  recommendation: text("recommendation"),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "implemented"]).default("pending").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  requiresRegulatoryApproval: boolean("requiresRegulatoryApproval").default(false),
  regulatoryStatus: mysqlEnum("regulatoryStatus", ["pending", "approved", "rejected"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  approvedBy: varchar("approvedBy", { length: 64 }),
  approvedAt: timestamp("approvedAt"),
});

export type AgentDecision = typeof agentDecisions.$inferSelect;

// ============================================================================
// ZADE TRAINER & KNOWLEDGE BASE
// ============================================================================

export const knowledgeDocuments = mysqlTable("knowledge_documents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  agentId: varchar("agentId", { length: 64 }).notNull(), // Each agent has their own knowledge base
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: mysqlEnum("category", ["curriculum", "case_study", "legal_update", "training", "strategy", "technical", "market_research"]).notNull(),
  sourceType: mysqlEnum("sourceType", ["manual", "learned", "imported", "generated"]).default("manual").notNull(),
  vectorId: varchar("vectorId", { length: 128 }), // Pinecone vector ID for semantic search
  importance: int("importance").default(5), // 1-10 scale for knowledge prioritization
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type KnowledgeDocument = typeof knowledgeDocuments.$inferSelect;

export const agentTraining = mysqlTable("agent_training", {
  id: int("id").autoincrement().primaryKey(),
  agentId: varchar("agentId", { length: 64 }).notNull(),
  trainingModule: text("trainingModule").notNull(),
  status: mysqlEnum("status", ["in_progress", "completed", "failed"]).default("in_progress").notNull(),
  score: int("score"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentTraining = typeof agentTraining.$inferSelect;

// ============================================================================
// SUBSCRIPTIONS & BILLING
// ============================================================================

export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: int("userId").notNull(),
  plan: mysqlEnum("plan", [
    "FREE", "INDIVIDUAL", "SMALL_BUSINESS", "ENTERPRISE", 
    "LAW_FIRM_PROFESSIONAL", "CORPORATE_LEGAL"
  ]).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  billingCycle: mysqlEnum("billingCycle", ["monthly", "annual"]).notNull(),
  status: mysqlEnum("status", ["trial", "active", "cancelled", "expired"]).default("trial").notNull(),
  trialEndsAt: timestamp("trialEndsAt"), // 45-day trial
  currentPeriodStart: timestamp("currentPeriodStart").defaultNow().notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelledAt: timestamp("cancelledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;

export const invoices = mysqlTable("invoices", {
  id: varchar("id", { length: 64 }).primaryKey(),
  subscriptionId: varchar("subscriptionId", { length: 64 }).notNull(),
  userId: int("userId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  dueDate: timestamp("dueDate").notNull(),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;

// ============================================================================
// CUSTOMER CONSULTATIONS
// ============================================================================

export const consultations = mysqlTable("consultations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: int("userId").notNull(),
  legalAgentId: varchar("legalAgentId", { length: 64 }).notNull(),
  caseType: text("caseType").notNull(),
  status: mysqlEnum("status", ["scheduled", "in_progress", "completed", "cancelled"]).default("scheduled").notNull(),
  transcript: text("transcript"),
  audioUrl: text("audioUrl"),
  duration: int("duration"), // in seconds
  rating: int("rating"), // 1-5 stars
  feedback: text("feedback"),
  scheduledAt: timestamp("scheduledAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Consultation = typeof consultations.$inferSelect;

// ============================================================================
// BUSINESS METRICS
// ============================================================================

export const businessMetrics = mysqlTable("business_metrics", {
  id: int("id").autoincrement().primaryKey(),
  metricName: varchar("metricName", { length: 128 }).notNull(),
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  category: mysqlEnum("category", ["revenue", "users", "agents", "consultations", "satisfaction"]).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type BusinessMetric = typeof businessMetrics.$inferSelect;

// ============================================================================
// COMPLIANCE & AUDIT LOGS
// ============================================================================

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityId: varchar("entityId", { length: 64 }).notNull(),
  action: text("action").notNull(),
  performedBy: varchar("performedBy", { length: 64 }).notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;

// ============================================================================
// LEGAL DATA SOURCES & CONTINUOUS LEARNING
// ============================================================================

/**
 * Tracks external legal data sources for agent knowledge updates
 * Future integrations: Westlaw, LexisNexis, Library of Congress
 */
export const legalDataSources = mysqlTable("legal_data_sources", {
  id: varchar("id", { length: 64 }).primaryKey(),
  sourceName: mysqlEnum("sourceName", [
    "WESTLAW", 
    "LEXISNEXIS", 
    "LIBRARY_OF_CONGRESS",
    "MICHIGAN_LEGISLATURE",
    "MICHIGAN_COURTS",
    "MICHIGAN_ATTORNEY_GENERAL",
    "INTERNAL_TRAINING"
  ]).notNull(),
  sourceType: mysqlEnum("sourceType", ["statute", "case_law", "regulation", "opinion", "training"]).notNull(),
  jurisdiction: varchar("jurisdiction", { length: 64 }), // e.g., "Michigan", "Federal"
  documentId: text("documentId"), // External reference ID
  title: text("title").notNull(),
  content: text("content"),
  url: text("url"),
  publicationDate: timestamp("publicationDate"),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  status: mysqlEnum("status", ["active", "archived", "pending_review"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LegalDataSource = typeof legalDataSources.$inferSelect;

/**
 * Tracks which agents have been updated with which legal data
 * Enables continuous learning and knowledge freshness tracking
 */
export const agentKnowledgeUpdates = mysqlTable("agent_knowledge_updates", {
  id: int("id").autoincrement().primaryKey(),
  agentId: varchar("agentId", { length: 64 }).notNull(),
  dataSourceId: varchar("dataSourceId", { length: 64 }).notNull(),
  updateType: mysqlEnum("updateType", ["initial_training", "incremental_update", "full_refresh"]).notNull(),
  vectorsUpdated: int("vectorsUpdated"), // Number of Pinecone vectors added/updated
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "failed"]).default("pending").notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentKnowledgeUpdate = typeof agentKnowledgeUpdates.$inferSelect;

/**
 * Tracks agent knowledge freshness and last update times
 * Helps identify when agents need retraining with latest legal updates
 */
export const agentKnowledgeFreshness = mysqlTable("agent_knowledge_freshness", {
  id: int("id").autoincrement().primaryKey(),
  agentId: varchar("agentId", { length: 64 }).notNull().unique(),
  lastFullUpdate: timestamp("lastFullUpdate"),
  lastIncrementalUpdate: timestamp("lastIncrementalUpdate"),
  totalDocuments: int("totalDocuments").default(0),
  totalVectors: int("totalVectors").default(0),
  freshnessScore: decimal("freshnessScore", { precision: 5, scale: 2 }), // 0-100 score
  needsUpdate: mysqlEnum("needsUpdate", ["yes", "no", "scheduled"]).default("no").notNull(),
  nextScheduledUpdate: timestamp("nextScheduledUpdate"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AgentKnowledgeFreshness = typeof agentKnowledgeFreshness.$inferSelect;


// ============================================================================
// TRAFFIC TICKET SYSTEM (PAY-PER-TICKET MVP)
// ============================================================================

/**
 * User ticket credits - pay-per-use model for traffic ticket consultations
 */
export const userTicketCredits = mysqlTable("user_ticket_credits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  balance: int("balance").default(0).notNull(),
  totalPurchased: int("totalPurchased").default(0).notNull(),
  totalUsed: int("totalUsed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserTicketCredit = typeof userTicketCredits.$inferSelect;
export type InsertUserTicketCredit = typeof userTicketCredits.$inferInsert;

/**
 * Traffic ticket credit purchases
 */
export const ticketPurchases = mysqlTable("ticket_purchases", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: int("userId").notNull(),
  credits: int("credits").notNull(),
  amount: int("amount").notNull(), // Amount in cents
  stripePaymentId: varchar("stripePaymentId", { length: 128 }),
  stripeSessionId: varchar("stripeSessionId", { length: 128 }),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TicketPurchase = typeof ticketPurchases.$inferSelect;
export type InsertTicketPurchase = typeof ticketPurchases.$inferInsert;

/**
 * Traffic ticket details - extends consultations for traffic-specific data
 */
export const trafficTickets = mysqlTable("traffic_tickets", {
  id: int("id").autoincrement().primaryKey(),
  consultationId: varchar("consultationId", { length: 64 }).notNull(),
  userId: int("userId").notNull(),
  ticketNumber: varchar("ticketNumber", { length: 128 }).notNull(),
  violationType: mysqlEnum("violationType", [
    "SPEEDING", "RED_LIGHT", "STOP_SIGN", "PARKING", 
    "CARELESS_DRIVING", "RECKLESS_DRIVING", "DUI_DWI",
    "LICENSE_ISSUE", "REGISTRATION_ISSUE", "OTHER"
  ]).notNull(),
  issueDate: timestamp("issueDate").notNull(),
  location: text("location").notNull(),
  fineAmount: decimal("fineAmount", { precision: 10, scale: 2 }).notNull(),
  courtDate: timestamp("courtDate"),
  officerName: varchar("officerName", { length: 256 }),
  description: text("description").notNull(),
  photoUrl: text("photoUrl"), // Photo of the ticket
  status: mysqlEnum("status", ["submitted", "under_review", "strategy_ready", "in_progress", "resolved", "closed"]).default("submitted").notNull(),
  assignedAgentId: varchar("assignedAgentId", { length: 64 }),
  strategyDocument: text("strategyDocument"), // AI-generated defense strategy
  outcome: text("outcome"), // Final result
  savingsAmount: decimal("savingsAmount", { precision: 10, scale: 2 }), // How much we saved them
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type TrafficTicket = typeof trafficTickets.$inferSelect;
export type InsertTrafficTicket = typeof trafficTickets.$inferInsert;

/**
 * Management team discussions about traffic tickets
 * Connects to existing agent_communications but specific to ticket workflow
 */
export const ticketManagementDiscussions = mysqlTable("ticket_management_discussions", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  fromAgentId: varchar("fromAgentId", { length: 64 }).notNull(),
  toAgentId: varchar("toAgentId", { length: 64 }), // null for broadcast to all
  message: text("message").notNull(),
  messageType: mysqlEnum("messageType", [
    "assignment", "strategy_discussion", "status_update", 
    "approval_request", "resolution", "escalation"
  ]).default("strategy_discussion").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  requiresResponse: boolean("requiresResponse").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TicketManagementDiscussion = typeof ticketManagementDiscussions.$inferSelect;
export type InsertTicketManagementDiscussion = typeof ticketManagementDiscussions.$inferInsert;

// ============================================================================
// CEO DASHBOARD CHAT
// ============================================================================

export const ceoChatMessages = mysqlTable("ceo_chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // CEO/user who sent the message
  message: text("message").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(), // user = CEO, assistant = SIGMA
  agentId: varchar("agentId", { length: 64 }), // Which agent responded (SIGMA, CEO, etc.)
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type CeoChatMessage = typeof ceoChatMessages.$inferSelect;
export type InsertCeoChatMessage = typeof ceoChatMessages.$inferInsert;
