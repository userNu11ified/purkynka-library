PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_authorToBook` (
	`bookId` integer NOT NULL,
	`authorId` integer NOT NULL,
	`createdOn` integer NOT NULL,
	`updatedOn` integer NOT NULL,
	CONSTRAINT `authorToBook_pk` PRIMARY KEY(`bookId`, `authorId`),
	CONSTRAINT `fk_authorToBook_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`),
	CONSTRAINT `fk_authorToBook_authorId_authorNames_id_fk` FOREIGN KEY (`authorId`) REFERENCES `authorNames`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_authorToBook`(`bookId`, `authorId`, `createdOn`, `updatedOn`) SELECT `bookId`, `authorId`, `createdOn`, `updatedOn` FROM `authorToBook`;--> statement-breakpoint
DROP TABLE `authorToBook`;--> statement-breakpoint
ALTER TABLE `__new_authorToBook` RENAME TO `authorToBook`;--> statement-breakpoint
PRAGMA foreign_keys=ON;