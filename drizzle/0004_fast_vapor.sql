CREATE TABLE `ticket_management_discussions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`fromAgentId` varchar(64) NOT NULL,
	`toAgentId` varchar(64),
	`message` text NOT NULL,
	`messageType` enum('assignment','strategy_discussion','status_update','approval_request','resolution','escalation') NOT NULL DEFAULT 'strategy_discussion',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`requiresResponse` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ticket_management_discussions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_purchases` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`credits` int NOT NULL,
	`amount` int NOT NULL,
	`stripePaymentId` varchar(128),
	`stripeSessionId` varchar(128),
	`status` enum('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ticket_purchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `traffic_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consultationId` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`ticketNumber` varchar(128) NOT NULL,
	`violationType` enum('SPEEDING','RED_LIGHT','STOP_SIGN','PARKING','CARELESS_DRIVING','RECKLESS_DRIVING','DUI_DWI','LICENSE_ISSUE','REGISTRATION_ISSUE','OTHER') NOT NULL,
	`issueDate` timestamp NOT NULL,
	`location` text NOT NULL,
	`fineAmount` decimal(10,2) NOT NULL,
	`courtDate` timestamp,
	`officerName` varchar(256),
	`description` text NOT NULL,
	`photoUrl` text,
	`status` enum('submitted','under_review','strategy_ready','in_progress','resolved','closed') NOT NULL DEFAULT 'submitted',
	`assignedAgentId` varchar(64),
	`strategyDocument` text,
	`outcome` text,
	`savingsAmount` decimal(10,2),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`resolvedAt` timestamp,
	CONSTRAINT `traffic_tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_ticket_credits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`balance` int NOT NULL DEFAULT 0,
	`totalPurchased` int NOT NULL DEFAULT 0,
	`totalUsed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_ticket_credits_id` PRIMARY KEY(`id`)
);
