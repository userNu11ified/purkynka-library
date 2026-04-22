CREATE TABLE `readerClasses` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`value` text NOT NULL,
	`createdOn` integer NOT NULL,
	`updatedOn` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `readers` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`readerName` text NOT NULL,
	`readerClassId` integer NOT NULL,
	`readerType` text NOT NULL,
	`createdOn` integer NOT NULL,
	`updatedOn` integer NOT NULL,
	CONSTRAINT `fk_readers_readerClassId_readerClasses_id_fk` FOREIGN KEY (`readerClassId`) REFERENCES `readerClasses`(`id`)
);
