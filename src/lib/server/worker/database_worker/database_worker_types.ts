import type { Result } from '$shared/types/result';
import type { CloseRequest, CloseResponse } from './messages/close';
import type { ConfigureRequest, ConfigureResponse } from './messages/configure';
import type { DatabaseWorkerError } from './messages/error';
import type { InsertRequest, InsertResponse } from './messages/insert';
import type { RemoveRequest, RemoveResponse } from './messages/remove';
import type { SelectRequest, SelectResponse } from './messages/select';
import type { UpdateRequest, UpdateResponse } from './messages/update';

export type DatabaseWorkerRequest =
	| SelectRequest
	| InsertRequest
	| UpdateRequest
	| RemoveRequest
	| ConfigureRequest
	| CloseRequest;

export type DatabaseWorkerResponse =
	| SelectResponse
	| InsertResponse
	| UpdateResponse
	| RemoveResponse
	| ConfigureResponse
	| CloseResponse;

export type DatabaseWorkerResult<Response extends DatabaseWorkerResponse = DatabaseWorkerResponse> =
	Result<Response, DatabaseWorkerError>;
