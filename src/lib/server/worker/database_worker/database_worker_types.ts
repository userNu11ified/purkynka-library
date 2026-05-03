import type { Result } from '$shared/types/result';
import type { ClearRequest, ClearResponse } from './messages/clear';
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
	| CloseRequest
	| ClearRequest;

export type DatabaseWorkerResponse =
	| SelectResponse
	| InsertResponse
	| UpdateResponse
	| RemoveResponse
	| ConfigureResponse
	| CloseResponse
	| ClearResponse;

export type DatabaseWorkerResult<Response extends DatabaseWorkerResponse = DatabaseWorkerResponse> =
	Result<Response, DatabaseWorkerError>;
