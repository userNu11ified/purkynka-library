import type { Nullable } from '$shared/common_types';

export type TransferIDMap<T> = { [key: string]: T };

export type TransferAuthor = {
	first_name: Nullable<string>;
	last_name: string;
};

export type TransferBook = {
	add_date: Date;
	discard_date: Nullable<Date>;
	price: number;
	doc_number: Nullable<string>;
	note: Nullable<string>;
	idgiver: number;
	idbook_issue: number;
};

export type TransferBookHasAuthor = {
	idbook_issue: number;
	idauthor: number;
};

export type TransferBookIssue = {
	name: string;
	year: number;
	issue: number;
	page_count: number;
	idsignature: number;
	idplace: number;
	idpublisher: number;
	idudc: number;
};

export type TransferGiver = {
	text: string;
};

export type TransferPlace = TransferGiver;
export type TransferPublisher = TransferGiver;

export type TransferSignature = {
	text: string;
	shortcut: string;
};

export type TransferUDC = {
	text: string;
	label: string;
};

export type TransferTables = {
	author: TransferIDMap<TransferAuthor>;
	book: TransferIDMap<TransferBook>;
	book_has_author: TransferIDMap<TransferBookHasAuthor>;
	book_issue: TransferIDMap<TransferBookIssue>;
	giver: TransferIDMap<TransferGiver>;
	place: TransferIDMap<TransferPlace>;
	publisher: TransferIDMap<TransferPublisher>;
	signature: TransferIDMap<TransferSignature>;
	udc: TransferIDMap<TransferUDC>;
};
