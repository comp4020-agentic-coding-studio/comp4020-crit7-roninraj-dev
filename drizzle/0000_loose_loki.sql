CREATE TABLE `sightings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`stop` text NOT NULL,
	`note` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
