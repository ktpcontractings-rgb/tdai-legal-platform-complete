CREATE TABLE `agent_knowledge_freshness` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`lastFullUpdate` timestamp,
	`lastIncrementalUpdate` timestamp,
	`totalDocuments` int DEFAULT 0,
	`totalVectors` int DEFAULT 0,
	`freshnessScore` decimal(5,2),
	`needsUpdate` enum('yes','no','scheduled') NOT NULL DEFAULT 'no',
	`nextScheduledUpdate` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agent_knowledge_freshness_id` PRIMARY KEY(`id`),
	CONSTRAINT `agent_knowledge_freshness_agentId_unique` UNIQUE(`agentId`)
);
--> statement-breakpoint
CREATE TABLE `agent_knowledge_updates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`agentId` varchar(64) NOT NULL,
	`dataSourceId` varchar(64) NOT NULL,
	`updateType` enum('initial_training','incremental_update','full_refresh') NOT NULL,
	`vectorsUpdated` int,
	`status` enum('pending','in_progress','completed','failed') NOT NULL DEFAULT 'pending',
	`startedAt` timestamp,
	`completedAt` timestamp,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_knowledge_updates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `legal_data_sources` (
	`id` varchar(64) NOT NULL,
	`sourceName` enum('WESTLAW','LEXISNEXIS','LIBRARY_OF_CONGRESS','MICHIGAN_LEGISLATURE','MICHIGAN_COURTS','MICHIGAN_ATTORNEY_GENERAL','INTERNAL_TRAINING') NOT NULL,
	`sourceType` enum('statute','case_law','regulation','opinion','training') NOT NULL,
	`jurisdiction` varchar(64),
	`documentId` text,
	`title` text NOT NULL,
	`content` text,
	`url` text,
	`publicationDate` timestamp,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`status` enum('active','archived','pending_review') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `legal_data_sources_id` PRIMARY KEY(`id`)
);
