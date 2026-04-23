CREATE TABLE `librarian` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`email` text NOT NULL,
	`password` text,
	`createdOn` integer NOT NULL,
	`updatedOn` integer NOT NULL
);
