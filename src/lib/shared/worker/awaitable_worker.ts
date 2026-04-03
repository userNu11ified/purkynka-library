export type AwaitableWorkerRequest<T> = {
	id: number;
	request: T;
};

export type AwaitableWorkerResponse<T> = {
	$type: 'response';
	id: number;
	response: T;
};

export type AwaitableWorkerInitialized = {
	$type: 'initialized';
};

export class AwaitableWorker<Request = unknown, Response = unknown> {
	private worker: Worker;
	private nextId: number = 0;
	private promiseResolvers: Map<number, (value: Response) => void> = new Map();

	public initialized: Promise<void>;
	private initializedResolver!: () => void;

	constructor(workerScriptURL: URL) {
		this.worker = new Worker(workerScriptURL, { type: 'module' });
		this.initialized = new Promise((res) => (this.initializedResolver = res));

		this.worker.onmessage = (
			e: MessageEvent<AwaitableWorkerResponse<Response> | AwaitableWorkerInitialized>
		) => {
			const data = e.data;
			if (data.$type === 'initialized') {
				this.initializedResolver();
				return;
			}

			this.handleResponse(data);
		};
	}

	private getAndDeleteResolver(resolverId: number) {
		const resolver = this.promiseResolvers.get(resolverId);
		this.promiseResolvers.delete(resolverId);

		return resolver;
	}

	public sendAsyncRequest(request: Request): Promise<Response> {
		return new Promise((res) => {
			const wrappedRequest = AwaitableWorker.wrapRequest(this.nextId++, request);
			this.promiseResolvers.set(wrappedRequest.id, res);

			this.worker.postMessage(wrappedRequest);
		});
	}

	public handleResponse(awaitableWorkerResponse: AwaitableWorkerResponse<Response>) {
		const { id, response } = awaitableWorkerResponse;

		const resolver = this.getAndDeleteResolver(id);
		if (resolver === undefined)
			throw new Error('Received ID did not have any promise resolver registered!');

		resolver(response);
	}

	private static wrapResponse<Response>(
		id: number,
		response: Response
	): AwaitableWorkerResponse<Response> {
		return {
			$type: 'response',
			id,
			response
		};
	}

	private static wrapRequest<Request>(
		id: number,
		request: Request
	): AwaitableWorkerRequest<Request> {
		return {
			id,
			request
		};
	}

	public static async setupWorker<Request, Response, Context = unknown>(
		worker: Worker,
		createContext: () => Promise<Context>,
		requestHandler: (context: Context, request: Request) => Promise<Response>
	) {
		const context = await createContext();
		worker.postMessage({ $type: 'initialized' } satisfies AwaitableWorkerInitialized);

		worker.onmessage = async (e: MessageEvent<AwaitableWorkerRequest<Request>>) => {
			const { id, request } = e.data;
			const response = await requestHandler(context, request);

			worker.postMessage(AwaitableWorker.wrapResponse(id, response));
		};
	}
}
