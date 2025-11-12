CREATE TABLE `agent_communications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromAgentId` varchar(64) NOT NULL,
	`toAgentId` varchar(64) NOT NULL,
	`message` text NOT NULL,
	`messageType` enum('text','voice','decision','alert') NOT NULL DEFAULT 'text',
	`priority` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`status` enum('sent','delivered','read') NOT NULL DEFAULT 'sent',
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_communications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agent_decisions` (
	`id` varchar(64) NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`decision` text NOT NULL,
	`description` text,
	`recommendation` text,
	`status` enum('pending','approved','rejected','implemented') NOT NULL DEFAULT 'pending',
	`priority` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`requiresRegulatoryApproval` boolean DEFAULT false,
	`regulatoryStatus` enum('pending','approved','rejected'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`approvedBy` varchar(64),
	`approvedAt` timestamp,
	CONSTRAINT `agent_decisions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agent_training` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`trainingModule` text NOT NULL,
	`status` enum('in_progress','completed','failed') NOT NULL DEFAULT 'in_progress',
	`score` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_training_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` varchar(64) NOT NULL,
	`entityId` varchar(64) NOT NULL,
	`action` text NOT NULL,
	`performedBy` varchar(64) NOT NULL,
	`details` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `business_metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`metricName` varchar(128) NOT NULL,
	`value` decimal(15,2) NOT NULL,
	`category` enum('revenue','users','agents','consultations','satisfaction') NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `business_metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consultations` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`legalAgentId` varchar(64) NOT NULL,
	`caseType` text NOT NULL,
	`status` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`transcript` text,
	`audioUrl` text,
	`duration` int,
	`rating` int,
	`feedback` text,
	`scheduledAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `consultations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` varchar(64) NOT NULL,
	`subscriptionId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
	`dueDate` timestamp NOT NULL,
	`paidAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `knowledge_documents` (
	`id` varchar(64) NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`category` enum('curriculum','case_study','legal_update','training') NOT NULL,
	`targetRole` varchar(64),
	`vectorId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `knowledge_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `legal_agents` (
	`id` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`specialization` enum('TRAFFIC','FAMILY','CORPORATE','CRIMINAL','BENEFITS','IMMIGRATION','REAL_ESTATE','EMPLOYMENT','PERSONAL_INJURY') NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`successRate` decimal(5,2),
	`casesHandled` int DEFAULT 0,
	`status` enum('active','inactive','training') NOT NULL DEFAULT 'active',
	`voiceId` varchar(128),
	`avatar` text,
	`state` varchar(2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`trainedBy` varchar(64),
	CONSTRAINT `legal_agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `management_agents` (
	`id` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`role` enum('CEO','CTO','PM','MARKETING','BILLING','LEGAL') NOT NULL,
	`title` text NOT NULL,
	`status` enum('active','inactive','pending') NOT NULL DEFAULT 'pending',
	`avatar` text,
	`description` text,
	`recommendation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`lastSeen` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `management_agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `regulatory_board` (
	`id` varchar(64) NOT NULL,
	`name` text NOT NULL,
	`position` text NOT NULL,
	`specialization` text NOT NULL,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`avatar` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `regulatory_board_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`plan` enum('FREE','INDIVIDUAL','SMALL_BUSINESS','ENTERPRISE','LAW_FIRM_PROFESSIONAL','CORPORATE_LEGAL') NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`billingCycle` enum('monthly','annual') NOT NULL,
	`status` enum('trial','active','cancelled','expired') NOT NULL DEFAULT 'trial',
	`trialEndsAt` timestamp,
	`currentPeriodStart` timestamp NOT NULL DEFAULT (now()),
	`currentPeriodEnd` timestamp NOT NULL,
	`cancelledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','customer') NOT NULL DEFAULT 'customer';