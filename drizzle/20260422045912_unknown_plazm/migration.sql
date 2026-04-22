PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_borrowHistory` (
	`borrowId` integer PRIMARY KEY AUTOINCREMENT,
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
INSERT INTO `__new_borrowHistory`(`borrowId`, `bookId`, `readerName`, `readerClass`, `borrowDate`, `timesExtended`, `returnDate`, `permanent`, `createdOn`, `updatedOn`) SELECT `borrowId`, `bookId`, `readerName`, `readerClass`, `borrowDate`, `timesExtended`, `returnDate`, `permanent`, `createdOn`, `updatedOn` FROM `borrowHistory`;--> statement-breakpoint
DROP TABLE `borrowHistory`;--> statement-breakpoint
ALTER TABLE `__new_borrowHistory` RENAME TO `borrowHistory`;--> statement-breakpoint
PRAGMA foreign_keys=ON;