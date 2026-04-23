CREATE TABLE `sessions` (
	`id` text PRIMARY KEY,
	`librarianId` integer NOT NULL,
	`expiresAt` integer NOT NULL,
	CONSTRAINT `fk_sessions_librarianId_librarians_id_fk` FOREIGN KEY (`librarianId`) REFERENCES `librarians`(`id`)
);
