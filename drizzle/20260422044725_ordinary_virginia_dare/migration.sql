CREATE TABLE `borrowHistory` (
	`borrowId` integer NOT NULL,
	`bookId` integer NOT NULL,
	`readerName` text NOT NULL,
	`readerClass` text NOT NULL,
	`borrowDate` integer NOT NULL,
	`timesExtended` integer,
	`returnDate` integer,
	`permanent` integer NOT NULL,
	`createdOn` integer NOT NULL,
	`updatedOn` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `borrows` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`bookId` integer NOT NULL,
	`readerId` integer NOT NULL,
	`borrowDate` integer NOT NULL,
	`timesExtended` integer DEFAULT 0,
	`returnDate` integer,
	`permanent` integer DEFAULT false NOT NULL,
	`createdOn` integer NOT NULL,
	`updatedOn` integer NOT NULL,
	CONSTRAINT `fk_borrows_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`),
	CONSTRAINT `fk_borrows_readerId_readers_id_fk` FOREIGN KEY (`readerId`) REFERENCES `readers`(`id`)
);
