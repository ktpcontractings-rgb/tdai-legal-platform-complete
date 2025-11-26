import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  managementAgents,
  regulatoryBoard,
  legalAgents,
  agentCommunications,
  agentDecisions,
  knowledgeDocuments,
  agentTraining,
  subscriptions,
  invoices,
  consultations,
  businessMetrics,
  auditLogs,
  userTicketCredits,
  ticketPurchases,
  trafficTickets,
  ticketManagementDiscussions,
  InsertUserTicketCredit,
  InsertTicketPurchase,
  InsertTrafficTicket,
  InsertTicketManagementDiscussion,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// MANAGEMENT AGENTS
// ============================================================================

export async function getAllManagementAgents() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(managementAgents).orderBy(managementAgents.createdAt);
}

export async function getManagementAgentById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(managementAgents).where(eq(managementAgents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateManagementAgentStatus(id: string, status: "active" | "inactive" | "pending") {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(managementAgents)
    .set({ status, lastSeen: new Date() })
    .where(eq(managementAgents.id, id));
    
  return await getManagementAgentById(id);
}

// ============================================================================
// REGULATORY BOARD
// ============================================================================

export async function getAllRegulatoryBoardMembers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(regulatoryBoard).orderBy(regulatoryBoard.createdAt);
}

// ============================================================================
// LEGAL AGENTS
// ============================================================================

export async function getAllLegalAgents() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(legalAgents).where(eq(legalAgents.status, "active")).orderBy(legalAgents.casesHandled);
}

export async function getLegalAgentsBySpecialization(specialization: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(legalAgents)
    .where(and(
      eq(legalAgents.specialization, specialization as any),
      eq(legalAgents.status, "active")
    ))
    .orderBy(desc(legalAgents.successRate));
}

export async function getLegalAgentById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(legalAgents).where(eq(legalAgents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// AGENT COMMUNICATIONS
// ============================================================================

export async function getAgentCommunications(agentId: string, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(agentCommunications)
    .where(and(
      eq(agentCommunications.fromAgentId, agentId)
    ))
    .orderBy(desc(agentCommunications.timestamp))
    .limit(limit);
}

export async function sendAgentMessage(from: string, to: string, message: string, type: "text" | "voice" | "decision" | "alert" = "text") {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(agentCommunications).values({
    fromAgentId: from,
    toAgentId: to,
    message,
    messageType: type,
    priority: type === "alert" ? "critical" : "medium",
  });

  return result;
}

// ============================================================================
// AGENT DECISIONS
// ============================================================================

export async function getPendingDecisions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(agentDecisions)
    .where(eq(agentDecisions.status, "pending"))
    .orderBy(desc(agentDecisions.createdAt));
}

export async function getDecisionsByAgentId(agentId: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(agentDecisions)
    .where(eq(agentDecisions.agentId, agentId))
    .orderBy(desc(agentDecisions.createdAt));
}

export async function approveDecision(decisionId: string, approvedBy: string) {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(agentDecisions)
    .set({
      status: "approved",
      approvedBy,
      approvedAt: new Date(),
    })
    .where(eq(agentDecisions.id, decisionId));

  const result = await db.select().from(agentDecisions).where(eq(agentDecisions.id, decisionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function rejectDecision(decisionId: string, approvedBy: string) {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(agentDecisions)
    .set({
      status: "rejected",
      approvedBy,
      approvedAt: new Date(),
    })
    .where(eq(agentDecisions.id, decisionId));

  const result = await db.select().from(agentDecisions).where(eq(agentDecisions.id, decisionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// KNOWLEDGE BASE
// ============================================================================

export async function getKnowledgeDocuments(category?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (category) {
    return await db.select().from(knowledgeDocuments)
      .where(eq(knowledgeDocuments.category, category as any))
      .orderBy(knowledgeDocuments.createdAt);
  }
  
  return await db.select().from(knowledgeDocuments).orderBy(knowledgeDocuments.createdAt);
}

// ============================================================================
// SUBSCRIPTIONS
// ============================================================================

export async function getUserSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(subscriptions)
    .where(and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, "active")
    ))
    .limit(1);
    
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllActiveSubscriptions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(subscriptions)
    .where(eq(subscriptions.status, "active"))
    .orderBy(desc(subscriptions.createdAt));
}

// ============================================================================
// CONSULTATIONS
// ============================================================================

export async function getUserConsultations(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(consultations)
    .where(eq(consultations.userId, userId))
    .orderBy(desc(consultations.createdAt));
}

export async function getConsultationById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(consultations).where(eq(consultations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// BUSINESS METRICS
// ============================================================================

export async function getBusinessMetrics(category?: string, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  
  if (category) {
    return await db.select().from(businessMetrics)
      .where(eq(businessMetrics.category, category as any))
      .orderBy(desc(businessMetrics.timestamp))
      .limit(limit);
  }
  
  return await db.select().from(businessMetrics)
    .orderBy(desc(businessMetrics.timestamp))
    .limit(limit);
}

export async function recordMetric(name: string, value: number, category: "revenue" | "users" | "agents" | "consultations" | "satisfaction") {
  const db = await getDb();
  if (!db) return undefined;

  return await db.insert(businessMetrics).values({
    metricName: name,
    value: value.toString(),
    category,
  });
}

// ============================================================================
// AUDIT LOGS
// ============================================================================

export async function logAudit(entityType: string, entityId: string, action: string, performedBy: string, details?: string) {
  const db = await getDb();
  if (!db) return undefined;

  return await db.insert(auditLogs).values({
    entityType,
    entityId,
    action,
    performedBy,
    details,
  });
}

export async function getAuditLogs(entityId?: string, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  
  if (entityId) {
    return await db.select().from(auditLogs)
      .where(eq(auditLogs.entityId, entityId))
      .orderBy(desc(auditLogs.timestamp))
      .limit(limit);
  }
  
  return await db.select().from(auditLogs)
    .orderBy(desc(auditLogs.timestamp))
    .limit(limit);
}


// ============================================================================
// TRAFFIC TICKET SYSTEM
// ============================================================================

export async function getUserTicketCredits(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(userTicketCredits).where(eq(userTicketCredits.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createOrUpdateTicketCredits(userId: number, creditsToAdd: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getUserTicketCredits(userId);
  if (existing) {
    await db.update(userTicketCredits)
      .set({
        balance: existing.balance + creditsToAdd,
        totalPurchased: existing.totalPurchased + creditsToAdd,
        updatedAt: new Date(),
      })
      .where(eq(userTicketCredits.userId, userId));
  } else {
    await db.insert(userTicketCredits).values({
      userId,
      balance: creditsToAdd,
      totalPurchased: creditsToAdd,
      totalUsed: 0,
    });
  }
}

export async function deductTicketCredit(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const credits = await getUserTicketCredits(userId);
  if (!credits || credits.balance < 1) {
    throw new Error("Insufficient credits");
  }
  
  await db.update(userTicketCredits)
    .set({
      balance: credits.balance - 1,
      totalUsed: credits.totalUsed + 1,
      updatedAt: new Date(),
    })
    .where(eq(userTicketCredits.userId, userId));
}

export async function createTrafficTicket(ticket: Omit<InsertTrafficTicket, 'consultationId'>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const consultationId = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const result = await db.insert(trafficTickets).values({
    ...ticket,
    consultationId,
  });
  
  return result[0]?.insertId || 0;
}

export async function getUserTrafficTickets(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(trafficTickets).where(eq(trafficTickets.userId, userId)).orderBy(desc(trafficTickets.createdAt));
}

export async function getAllTrafficTickets() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(trafficTickets).orderBy(desc(trafficTickets.createdAt));
}

export async function updateTrafficTicketStatus(
  ticketId: number,
  status: "submitted" | "under_review" | "strategy_ready" | "in_progress" | "resolved" | "closed"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { status, updatedAt: new Date() };
  if (status === "resolved" || status === "closed") {
    updateData.resolvedAt = new Date();
  }
  
  await db.update(trafficTickets).set(updateData).where(eq(trafficTickets.id, ticketId));
}

export async function getTicketManagementDiscussions(ticketId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(ticketManagementDiscussions)
    .where(eq(ticketManagementDiscussions.ticketId, ticketId))
    .orderBy(desc(ticketManagementDiscussions.createdAt));
}

export async function getAllTicketManagementDiscussions() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(ticketManagementDiscussions).orderBy(desc(ticketManagementDiscussions.createdAt));
}

export async function createTicketManagementDiscussion(discussion: InsertTicketManagementDiscussion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(ticketManagementDiscussions).values(discussion);
}

export async function notifyManagementTeam(ticketId: number, violationType: string) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(ticketManagementDiscussions).values({
    ticketId,
    fromAgentId: "SYSTEM",
    toAgentId: "SIGMA-1",
    message: `New ${violationType} ticket submitted. Ticket ID: ${ticketId}. Requires assignment and strategy development.`,
    messageType: "assignment",
    priority: violationType === "DUI_DWI" || violationType === "RECKLESS_DRIVING" ? "urgent" : "high",
    requiresResponse: true,
  });
}
