CREATE INDEX `bookNameFkIdx` ON `books` (`bookNameId`);--> statement-breakpoint
CREATE INDEX `publisherFkIdx` ON `books` (`publisherId`);--> statement-breakpoint
CREATE INDEX `placeOfPublishingFkIdx` ON `books` (`placeOfPublishingId`);--> statement-breakpoint
CREATE INDEX `literatureTypeFkIdx` ON `books` (`literatureTypeId`);--> statement-breakpoint
CREATE INDEX `udcFkIdx` ON `books` (`udcId`);--> statement-breakpoint
CREATE INDEX `obtainedFromFkIdx` ON `books` (`obtainedFromId`);