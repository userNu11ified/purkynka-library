CREATE TABLE `authorNames` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bookNames` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `discardReasons` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `obtainedFrom` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `placesOfPublishing` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `publishers` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `literatureTypes` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`shortName` text NOT NULL,
	`longName` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `udc` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`shortName` text NOT NULL,
	`longName` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`isLarge` integer DEFAULT false NOT NULL,
	`bookNameId` integer,
	`publisherId` integer,
	`placeOfPublishingId` integer,
	`yearOfPublishing` text,
	`edition` text,
	`pageCount` text,
	`literatureTypeId` integer,
	`udcId` integer,
	`addDate` integer,
	`price` text,
	`documentNumber` text,
	`obtainedFromId` integer,
	`discardDate` integer,
	`discardReasonId` integer,
	`discardDocument` text,
	`annotation` text,
	`note` text,
	CONSTRAINT `fk_books_bookNameId_bookNames_id_fk` FOREIGN KEY (`bookNameId`) REFERENCES `bookNames`(`id`),
	CONSTRAINT `fk_books_publisherId_publishers_id_fk` FOREIGN KEY (`publisherId`) REFERENCES `publishers`(`id`),
	CONSTRAINT `fk_books_placeOfPublishingId_placesOfPublishing_id_fk` FOREIGN KEY (`placeOfPublishingId`) REFERENCES `placesOfPublishing`(`id`),
	CONSTRAINT `fk_books_literatureTypeId_literatureTypes_id_fk` FOREIGN KEY (`literatureTypeId`) REFERENCES `literatureTypes`(`id`),
	CONSTRAINT `fk_books_udcId_udc_id_fk` FOREIGN KEY (`udcId`) REFERENCES `udc`(`id`),
	CONSTRAINT `fk_books_obtainedFromId_obtainedFrom_id_fk` FOREIGN KEY (`obtainedFromId`) REFERENCES `obtainedFrom`(`id`),
	CONSTRAINT `fk_books_discardReasonId_discardReasons_id_fk` FOREIGN KEY (`discardReasonId`) REFERENCES `discardReasons`(`id`)
);
--> statement-breakpoint
CREATE TABLE `authorToBook` (
	`bookId` integer,
	`authorId` integer,
	CONSTRAINT `authorToBook_pk` PRIMARY KEY(`bookId`, `authorId`),
	CONSTRAINT `fk_authorToBook_bookId_books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `books`(`id`),
	CONSTRAINT `fk_authorToBook_authorId_authorNames_id_fk` FOREIGN KEY (`authorId`) REFERENCES `authorNames`(`id`)
);
